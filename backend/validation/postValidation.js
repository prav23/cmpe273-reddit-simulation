const Joi = require("joi");

const createPostValidation = (body) => {
  const schema = Joi.object().keys({
    communityName: Joi.string().required(),
    author: Joi.string().required(),
    title: Joi.string().required(),    
    // numPosts: Joi.number().integer().required(),
  });
  const { error } = schema.validate(body);
  return error;
};

module.exports = {
  createPostValidation,
};
