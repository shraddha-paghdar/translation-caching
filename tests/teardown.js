const models = require('../models')

module.exports = async function () {
  await models.sequelize.close()
};

module.exports.models = models