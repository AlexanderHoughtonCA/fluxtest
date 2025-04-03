module.exports = (sequelize, DataTypes) => {
    const ApiKey = sequelize.define('ApiKey', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      hashed_key: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      tableName: 'ApiKey',
      timestamps: true,
    });
  
    // Custom getData function
    ApiKey.prototype.getData = function() {
      return {
        id: this.id,
        hashed_key: this.hashed_key,
        description: this.description,
      };
    };
  
    return ApiKey;
  };
  