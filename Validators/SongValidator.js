const Joi = require("joi");

const validateAdd = (schema) => {
  return async (req, res, next) => {
    try {
      const val = await schema.validateAsync(req.body);
      req.value = req.value ?? {};
      req.value.body = req.value.body ?? val;
      next();
    } catch (error) {
      res.status(400).json(error);
    }
  };
};

const addSongSchema = Joi.object().keys({
  title: Joi.string().required(),
  artist: Joi.string().required(),
  album: Joi.string(),
  genre: Joi.string().required(),
  imgUrl: Joi.string().uri(),
  description: Joi.string(),
});

const updateSongSchema = Joi.object().keys({
  artist: Joi.string(),
  album: Joi.string(),
  genre: Joi.string(),
  imgUrl: Joi.string().uri(),
  description: Joi.string(),

});

module.exports = {
  validateAdd,
  addSongSchema,
  updateSongSchema
};
