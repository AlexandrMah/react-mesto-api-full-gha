const { BadRequestError } = require('../utils/badRequest');

const {
  UnauthorizedError,
} = require('../utils/unauthorized');

const {
  ForbiddenError,
} = require('../utils/forbidden');

const {
  NotFoundError,
} = require('../utils/notFound');

const {
  ConflictError,
} = require('../utils/conflict');

const error = (err, req, res, next) => {
  if (err instanceof BadRequestError) {
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof UnauthorizedError) {
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof ConflictError) {
    res.status(409).json({ message: err.message });
  } else { res.status(500).send({ message: 'Произошла ошибка' }); }

  next();
};

module.exports = { error };
