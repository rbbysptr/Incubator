'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Incubator extends Model {
    static associate(models) {
      Incubator.hasMany(models.Startup, { foreignKey: 'IncubatorId' });
    }
  }
  Incubator.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    location: DataTypes.STRING,
    level: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Incubator',
    hooks: {
      beforeCreate: (Incubator, options) => {
        let code;
        switch (Incubator.level) {
          case 'International':
            code = `1992-A`;
            break;
          case 'National':
            code = `1994-B`;
            break;
          case 'Province':
            code = `1996-C`;
            break;
        }
        Incubator.code = `${code}-${new Date().getTime()}`;
      }
    }
  });
  return Incubator;
};