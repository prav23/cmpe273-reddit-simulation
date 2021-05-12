const Joi = require("joi");

const createValidation = (body) => {
  const createSchema = Joi.object().keys({
    userId: Joi.string().required(),
    userName: Joi.string().required(),
    communityId: Joi.string().required(),
    communityName: Joi.string().required(),
    status: Joi.string(),
    sentBy: Joi.string(),
  });

  const { error } = createSchema.validate(body);
  return error;
};

const createManyValidation = (body) => {
  const schema = Joi.array().items(
    Joi.object({
      userId: Joi.string().required(),
      userName: Joi.string().required(),
      communityId: Joi.string().required(),
      communityName: Joi.string().required(),
      status: Joi.string(),
      sentBy: Joi.string(),
    })
  );

  const { error } = schema.validate(body);
  return error;
};

const updateValidation = (body) => {
  const updateSchema = Joi.object().keys({
    status: Joi.string().required(),
  });
  const { error } = updateSchema.validate(body);
  return error;
};

module.exports = {
  createValidation,
  createManyValidation,
  updateValidation,
};
