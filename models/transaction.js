'use strict';

var sequelize = require('sequelize');
var DataTypes = sequelize.DataTypes;

module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE
    }
  }, scopes: {
    income: {
      where: {
        amount: { $gt: 0 }
      }
    },
    expense: {
      where: {
        amount: {
          $lt: 0
        }
      }
    },
    scheduled: {
      where: {
        date: { $ne: null }
      }
    },
    unscheduled: {
      where: {
        date: null
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Transaction;
};