module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('ApiKey', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        hashed_key: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });
    },
    down: async (queryInterface) => {
      await queryInterface.dropTable('ApiKey');
    },
  };
  