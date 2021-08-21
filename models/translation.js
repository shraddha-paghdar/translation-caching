module.exports = (sequelize, DataTypes) => {
	const Transalation = sequelize.define('Transalation', {
		tranId: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		sourceLangCode: {
			type: DataTypes.STRING,
			references: {
				model: 'Languages',
				key: 'code',
			},
		},
		targetLangCode: {
			type: DataTypes.STRING,
			references: {
				model: 'Languages',
				key: 'code',
			},
		},
		query: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		result: {
			type: DataTypes.TEXT,
		}
	}, {
		indexes: [],
	})
	// eslint-disable-next-line func-names
	Transalation.associate = function (models) {
		models.Transalation.belongsTo(models.Language, {
			foreignKey: 'sourceLangCode',
			sourceKey: 'code',
			onDelete: 'RESTRICT',
		})

		models.Transalation.belongsTo(models.Language, {
			foreignKey: 'targetLangCode',
			sourceKey: 'code',
			onDelete: 'RESTRICT',
		})
	}
	return Transalation
}
