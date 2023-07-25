import jwt from 'jsonwebtoken';
import User from '../../../shared/models/user.js';
import { sendResponse } from '../../../shared/utils/helper.js';

/*
export default function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const secret = process.env.JWT_ACCESS_TOKEN_SECRET ?? '';

  if (!token)
    return sendResponse(res, 401, 'Authorization is required', null, {
      code: AuthError.NO_TOKEN,
    });

  jwt.verify(token, secret, {}, async (err, payload) => {
    if (err) {
      const errMessage =
        err.name === 'TokenExpiredError'
          ? 'Access token expired'
          : 'Invalid access token';

      sendResponse(res, 401, errMessage, null, {
        code:
          err.name === 'TokenExpiredError'
            ? AuthError.TOKEN_EXPIRED
            : AuthError.INVALID_TOKEN,
      });
      return;
    }
    // @ts-ignore
    const user = await User.findOne({ _id: payload.userId }).lean();
    if (!user) {
      return sendResponse(res, 404, 'User not found');
    }

    req.user = user;
    req.userId = user._id;

    next();
  });
}
*/

export const checkAuth = () => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const secret = process.env.JWT_ACCESS_TOKEN_SECRET ?? '';

  if (!token)
    return sendResponse(res, 401, 'Authorization is required', null, {
      code: AuthError.NO_TOKEN,
    });

  jwt.verify(token, secret, {}, async (err, payload) => {
    if (err) {
      const errMessage =
        err.name === 'TokenExpiredError'
          ? 'Access token expired'
          : 'Invalid access token';

      sendResponse(res, 401, errMessage, null, {
        code:
          err.name === 'TokenExpiredError'
            ? AuthError.TOKEN_EXPIRED
            : AuthError.INVALID_TOKEN,
      });
      return;
    }
    // @ts-ignore
    const user = await User.findOne({ _id: payload.userId }).lean();
    if (!user) {
      return sendResponse(res, 404, 'User not found');
    }

    req.user = user;

    next();
  });
};