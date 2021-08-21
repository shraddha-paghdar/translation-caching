const express = require('express')
const router = express.Router()
const axios = require('axios')
const qs = require('qs');
const { languages } = require('../langauge');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index',
    {
      title: 'Text Translation',
      languages: languages.languages
    });
});

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

router.get('/fetch_languages', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: `${process.env.API_URL}/languages`,
      headers: {
        'accept-encoding': 'application/gzip',
        'x-rapidapi-key': process.env.API_KEY,
        'x-rapidapi-host': 'google-translate1.p.rapidapi.com'
      }
    };
    const language = await axios.request(options)
    console.log('language: ' + language.data)

    res.send(language.data)
  } catch (err) {
    console.log(err);
  }
})

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
    // const existingTranslation = await models.Translation.findOne({
    //   where: {
    //     sourceLangCode: req.body.source,
    //     targetLangCode: req.body.target,
    //     query: req.body.query,
    //   },
    // })

    // if (existingTranslation) {
    //   res.send(existingTranslation)
    // } else {

    // }


    const language = await fetchTranslation(req.body)
    console.log('language: ' + language)

    // const newTranslation = await models.Transalation.create({
    //   sourceLangCode: req.body.source,
    //     targetLangCode: req.body.target,
    //     query: req.body.query,
    // });

    res.send({
      message: language.data.translations[0].translatedText
    })
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
