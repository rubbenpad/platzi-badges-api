const boom = require('@hapi/boom');
const { config } = require('../../config/index');
const debug = require('debug')('app:error');

function validateEnvironment(error, stack) {
  if (config.dev) {
    return { ...error, stack };
  }

  return error;
}

function logErrors(err, req, res, next) {
  debug(err);
  next(err);
}

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }
  next(err);
}

function errorHandler(err, req, res, next) {// eslint-disable-line
  const {
    output: { statusCode, payload }
  } = err;
  res.status(statusCode);
  res.json(validateEnvironment(payload, err.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  errorHandler
};
