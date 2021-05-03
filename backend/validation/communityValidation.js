const Joi = require("joi");

const addPostValidation = (body) => {
  const schema = Joi.object().keys({
    communityName: Joi.string(),
  });

  const { error } = schema.validate(body);
  return error;
};

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
    communityId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string(),
  });

  const { error } = schema.validate(body);
  return error;
};

const updateCommunityValidation = (body) => {
  const schema = Joi.object().keys({
    communityId: Joi.string().required(),
    newName: Joi.string().allow(null),
    description: Joi.string().allow(null),
  });

  const { error } = schema.validate(body);
  return error;
};

module.exports = {
  newCommunityValidation,
  newCommunityRuleValidation,
  updateCommunityValidation,
};
