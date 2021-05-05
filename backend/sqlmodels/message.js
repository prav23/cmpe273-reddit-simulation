const { Sequelize } = require(".");
const message = require("./message");

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    receivedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    sentBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },    
  },
  {
    // https://sequelize.org/master/manual/model-basics.html#model-definition
    timestamps: true,
  });
  Message.associate = function (models) {
    // associations can be defined here
  };
  return Message;
};
