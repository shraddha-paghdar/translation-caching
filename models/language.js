module.exports = (sequelize, DataTypes) => {
	const Language = sequelize.define('Language', {
		code: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
			unique: true
		},
		languageName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		relatedLanguage: {
			type: DataTypes.JSON,
		}
	}, {
		indexes: [],
	})
	// eslint-disable-next-line func-names
	Language.associate = function (models) {
	}
	return Language
}
