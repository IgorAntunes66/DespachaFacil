import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  if (error instanceof MethodNotAllowedError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.error(publicErrorObject);

  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
