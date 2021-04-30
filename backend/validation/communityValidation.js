const Joi = require("joi");

const newCommunityValidation = (body) => {
  const schema = Joi.object().keys({
    description: Joi.string(),
    name: Joi.string().required(),
  });

  const { error } = schema.validate(body);
  return error;
};

module.exports = {
  newCommunityValidation,
};
