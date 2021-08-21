const express = require('express')
const router = express.Router()
const axios = require('axios')
const qs = require('qs');
const { languages } = require('../langauge');
const models = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index',
    {
      title: 'Text Translation',
      languages: languages.languages
    });
});

/**
 * Fn to hit the google translation API
 * @param {*} queryObject 
 * @returns translated text object
 */
const fetchTranslation = async (queryObject) => {
  const options = {
    method: 'POST',
    url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'accept-encoding': 'application/gzip',
      'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
      'x-rapidapi-key': 'bc1c50330bmshac9784253709ff2p1622cbjsnb0ddcc608c5a'
    },
    data: qs.stringify({
      q: queryObject.query,
      target: queryObject.target,
      source: queryObject.source
    })
  };
  const language = await axios(options)
  return language.data
}

/**
 * Fn to create the translations of requested language
 * @param {*} queryObject requested object
 * @param {*} result result from google-translate api
 */
const createTranslation = async (queryObject, result) => {
  await models.Transalation.create({
    sourceLangCode: queryObject.source,
    targetLangCode: queryObject.target,
    query: queryObject.query,
    result
  })
}

/**
 * Fn to create translations of related languages
 * @param {*} queryObject requested object
 * @param {*} otherLanguages array of other language to be translated
 */
const createRelatedTranslation = async (queryObject, otherLanguages) => {
  if (otherLanguages && otherLanguages.length > 0) {
    otherLanguages = otherLanguages.sort((a, b) => (a.count) - (b.count))

    /* If related language is more than 5 only select top 5 language */
    if (otherLanguages.length > 5) {
      otherLanguages = otherLanguages.slice(0, 5)
    }

    await Promise.all(
      otherLanguages.map(async (otherLanguage) => {
        if (otherLanguage.langCode !== queryObject.targetLangCode) {

          const languageResult = await fetchTranslation(queryObject)

          await models.Transalation.findOrCreate({
            where: {
              sourceLangCode: queryObject.source,
              targetLangCode: otherLanguage.langCode,
              query: queryObject.query,
            },
            defaults: {
              sourceLangCode: queryObject.source,
              targetLangCode: otherLanguage.langCode,
              query: queryObject.query,
              result: languageResult.data.translations[0].translatedText
            }
          });

        }
      })
    )
  }
}

/* API to fetch the translations */
router.post('/fetch_translation', async (req, res) => {
  try {
    if (!req.body.source) {
      throw new Error('Source language is required')
    }
    if (!req.body.target) {
      throw new Error('Target language is required')
    }
    if (!req.body.query) {
      throw new Error('Query is required')
    }

    /* Check if translation is already available */
    const existingTranslation = await models.Transalation.findOne({
      where: {
        sourceLangCode: req.body.source,
        query: req.body.query,
      },
    })

    /* Findout related language to the source language */
    const language = await models.Language.findOne({
      where: {
        code: req.body.source
      }
    })

    if(language) {
      const index = language.relatedLanguage.findIndex(l => l.langCode === req.body.target)
      /* Update the count of existing language */
      if (index !== -1) {
        language.relatedLanguage[index].count += 1
        language.changed("relatedLanguage", true);
      } else {
        /* If target language is new add it to array */
        language.relatedLanguage = [...language.relatedLanguage, {
          langCode: req.body.target,
          count: 1
        }]
      }
    }

    if (existingTranslation && existingTranslation.targetLangCode === req.body.target) {
      /* send already existing translation */
      res.send({
        message: existingTranslation.result,
      })

    } else {
      /* Hit the translation api and send the result */
      const translatedResult = await fetchTranslation(req.body)

      res.send({
        message: translatedResult.data.translations[0].translatedText,
      })
      /* Create the result in Database after sending the response to save time */
      await createTranslation(req.body, translatedResult.data.translations[0].translatedText)
    }

    /* Create the related language transaction */
    await createRelatedTranslation(req.body, language.relatedLanguage)
    await language.save()
  } catch (err) {
    console.log(err);
  }
})

/* Sync the database */
router.get('/syncDb', (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    return models.sequelize.authenticate()
      .then(() => {
        return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
      })
      .then(() => {
        return models.sequelize.sync({
          force: true,
        })
      })
      .then(() => {
        return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
      }).then(async () => {
        await models.Language.bulkCreate(languages.languages)
        res.send('Database sync complete')
      }).catch(err => {
        console.log(err);
      })
  }
})

module.exports = router;
