'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rsvp extends Model {
    static associate(models) {
      Rsvp.belongsTo(models.Event);
      Rsvp.belongsTo(models.User, { foreignKey: 'UserId' }); 
    }
  }
  Rsvp.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    UserId: DataTypes.INTEGER 
  }, {
    sequelize,
    modelName: 'Rsvp',
  });
  return Rsvp;
};