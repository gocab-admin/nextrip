
import CustomError from '@abserve/errors/index'
import Jwt from 'jsonwebtoken'
import { Config } from '@abserve/Config/AppConfig'
import { Enum } from '@abserve/Utils/Enum'
import { CustomSocket } from '@abserve/Interfaces/Requests'

type authObject = { authToken: string }
class AuthMiddleware {
  /**
   * Adds two numbers together.
   * @param {object} generateObject The first number.
   * @returns {object} Auth Data.
   */
  static readonly generateAuth = async (generateObject: authObject) => {
    let authObject = {
      status: false,
      data: {},
      message: '',
    }

    try {
      const { authToken = '' } = generateObject
      const cipherKey = Config.auth.cipherKey
      console.log(cipherKey)
      if (cipherKey != '') { 
        const authInfo: any = await new Promise((resolve, reject) => {
          Jwt.verify(authToken, cipherKey, function (err, decoded) {
            if (err) { reject(new Error(err.message || 'Failed to authenticate.')) }
            else {
              resolve(decoded)
            }
          })
        })
        authObject = {
          status: true,
          data: {
            userId: authInfo.userId,
            email: authInfo.email,
            name: authInfo.name,
            role: authInfo.type,
          },
          message: 'Auth Verified',
        }
      }
    } catch (error) {
      console.log("ERROR", error)
      authObject = {
        status: true,
        data: {},
        message: error.message || 'Authentication Error',
      }
    }
    return authObject
  }

  /**
   * Adds two numbers together.
   */

  static readonly addAuth =
    (roles = []) =>
      async (req, res, next) => {
        try {
          const Authorization = req.headers['authorization'] || null
          let authData = null
          if (Authorization) {
            const generateObject = {
              authToken: Authorization,
            }
            const generateAuthFunc = await this.generateAuth(generateObject)
            if (!generateAuthFunc.status) throw new CustomError.BadRequestError('Authentication token is invalid.')

            authData = generateAuthFunc.data
            if (!roles.includes(authData.role))
              throw new CustomError.UnAuthorizedError('Authentication role not permit for this action.')
          }
          req.auth = authData
          next()
        } catch (error) {
          return res.status(req, res, error)
        }
      }

  /**
   * Adds two numbers together.
   */
  static readonly authorize =
    (roles = []) =>
      async (req, res, next) => {
        try {
          const Authorization = req.headers['authorization'] || null
          if (!Authorization) throw new CustomError.BadRequestError('Authentication is required.')
          const generateObject = {
            authToken: Authorization
          }

          const generateAuthFunc = await this.generateAuth(generateObject)
          if (!generateAuthFunc.status) throw new CustomError.BadRequestError('Authentication token is invalid.')

          const authData: any = generateAuthFunc.data
          if (!roles.includes(authData.role)) throw new CustomError.UnAuthorizedError('Authentication role not permit for this action.')

          req.auth = authData
          next()

        } catch (error) {     
          return res.status(401).json({ 'success': false, message: error.message || 'Authentication Failed' });
        }
      }
}

function authenticateSocket(socket: CustomSocket, next: (err?: any) => void) {
  try {
    const Authorization = socket.handshake.headers['authorization'] || null;
    if (!Authorization) throw new Error('Socket authentication is required.');

    // Verify the token and get user data
    const generateObject = {
      authToken: Authorization,
    };

    AuthMiddleware.generateAuth(generateObject)
      .then((authData: any) => {
        if (!authData.status) throw new CustomError.BadRequestError('Socket authentication token is invalid.');

        // Check if the user's role is permitted
        if (![Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN].includes(authData.data.role)) throw new CustomError.UnAuthorizedError('Socket authentication role not permitted for this action.');


        // Attach the authenticated user data to the socket
        socket.authData = authData.data;

        // Continue with the connection
        next();
      })
      .catch((error: any) => {
        throw new Error(error.message || 'Socket authentication failed.');
      });
  } catch (error) {
    next(error);
  }
}

export { AuthMiddleware, authenticateSocket }