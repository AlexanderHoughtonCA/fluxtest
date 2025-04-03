'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Style extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Style.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    styleId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    prompt: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Style',
    tableName: 'Style'
  });
  return Style;
};