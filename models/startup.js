'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Startup extends Model {
    static associate(models) {
      Startup.belongsTo(models.Incubator, { foreignKey: 'IncubatorId' });
    }

    static async getStartUpByRoleOfFounder(role) {
      try {
        const startups = await Startup.findAll({
          where: {
            roleOfFounder: role
          }
        });
        return startups;
      } catch (error) {
        throw new Error('Error fetching startups by role of founder');
      }
    }
  }
  
  Startup.init({
    startUpName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    founderName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    dateFound: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
        isAfter: new Date('2019-01-01').toISOString(),
        async isOldEnough(value) {
          const currentDate = new Date();
          const startupDate = new Date(value);
          const ageInMilliseconds = currentDate - startupDate;
          const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365);
          if (ageInYears < 5) {
            throw new Error('Startup must be at least 5 years old.');
          }
        }
      }
    },
    educationOfFounder: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    roleOfFounder: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isHustlerRole(value) {
          if (value.toLowerCase() === 'hustler' && value.toLowerCase() !== 's2') {
            throw new Error('Founder with Hustler role must have at least S2 education.');
          }
        }
      }
    },
    valuation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true
      }
    },
    IncubatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true
      }
    },
    founderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'User',
        key: 'id'
    }
}

  }, {
    sequelize,
    modelName: 'Startup',
    getterMethods: {
      age() {
        const currentDate = new Date();
        const startupDate = new Date(this.dateFound);
        const ageInMilliseconds = currentDate - startupDate;
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365);
        return Math.floor(ageInYears);
      }
    }
  });
  
  return Startup;
};
