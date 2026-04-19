const Joi = require('joi');

// Validation schemas
const userRegisterSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required',
  }),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string()
    .valid('Programming', 'Business', 'Self-Development', 'Fiction', 'Cybersecurity', 'Psychology')
    .required(),
  price: Joi.number().min(0).required(),
  discountedPrice: Joi.number().min(0),
  coverImage: Joi.string().required(),
  pages: Joi.number(),
  isbn: Joi.string(),
  language: Joi.string(),
  format: Joi.string().valid('eBook', 'Paperback', 'Hardcover'),
  stock: Joi.number().min(0),
  tags: Joi.array().items(Joi.string()),
});

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  title: Joi.string().required(),
  content: Joi.string().min(10).max(2000).required(),
});

const addToCartSchema = Joi.object({
  bookId: Joi.string().required(),
  quantity: Joi.number().min(1).default(1),
});

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = {
  validateRequest,
  userRegisterSchema,
  userLoginSchema,
  bookSchema,
  reviewSchema,
  addToCartSchema,
};
