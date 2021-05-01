const Joi = require("joi");

const newCommunityValidation = (body) => {
  const schema = Joi.object().keys({
    description: Joi.string(),
    name: Joi.string().required(),
    createdBy: Joi.string().required(),
  });

  const { error } = schema.validate(body);
  return error;
};

const newCommunityRuleValidation = (body) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string(),
  });

  const { error } = schema.validate(body);
  return error;
};

module.exports = {
  newCommunityValidation,
  newCommunityRuleValidation,
};
