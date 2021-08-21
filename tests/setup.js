const { languages } = require("../langauge");
const models = require("../models");

module.exports = () => {
  // Make DB Schema
  return models.sequelize.authenticate()
    .then(()=> {
      return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    })
    .then(() => {
      return models.sequelize.sync({
        force: true,
      })
    })
    .then(()=> {
      return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    })
    .then(() => {
      return models.Language.bulkCreate(languages.languages)
    })
    .catch(err => {
      console.log(err)
      throw err;
    })
};