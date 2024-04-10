'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.Rsvp);
      Event.belongsTo(models.User, { foreignKey: 'UserId' }); // Add this line
    }
  }
  Event.init({
    title: DataTypes.STRING,
    desc: DataTypes.TEXT,
    imgUrl: DataTypes.STRING,
    UserId: DataTypes.INTEGER // Add this line
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};