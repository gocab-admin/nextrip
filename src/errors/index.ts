// export { default as CustomError } from './customError';
// export { default as UnAuthenticatedError } from './unauthenticatedError';
// export { default as UnAuthorizedError } from './unauthorizedError';
// export { default as NotFoundError } from './notFoundError';
// export { default as UnProcessableError } from './unprocessableError';
// export { default as BadRequestError } from './badRequestError';

import CustomError from "./CustomError";
import UnAuthenticatedError from "./UnauthenticatedError";
import UnAuthorizedError from "./UnauthorizedError";
import NotFoundError from "./NotFoundError";
import UnProcessableError from "./UnprocessableError";
import BadRequestError from "./BadRequestError";
import UnAvailableError from "./UnavailableError";

const Errors = {
    CustomError,
    UnAuthenticatedError,
    NotFoundError,
    BadRequestError,
    UnAuthorizedError,
    UnProcessableError,
    UnAvailableError
}

export default Errors


