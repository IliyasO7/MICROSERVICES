import cryptoRandomString from 'crypto-random-string';
import client from 'axios';
import User from '../../shared/models/user.js';
import Admin from '../../shared/models/admin.js';
import Vendor from '../../shared/models/ods/vendor.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const getEnums = (obj) => {
  return Object.values(obj);
};

export const ObjectId = mongoose.Schema.Types.ObjectId;

export const roundValue = (value, decimals = 2, direction = 'up') => {
  const pow = Math.pow(10, decimals);
  const fn = direction === 'up' ? Math.ceil : Math.floor;

  return fn(value * pow) / pow;
};

export const sendResponse = (
  res,
  statusCode,
  message,
  data = null,
  errors = null
) => {
  return res.status(statusCode).json({
    status: statusCode,
    message: message || 'success',
    data,
    errors,
  });
};

export const generateOtp = () => {
  return cryptoRandomString({
    type: 'numeric',
    length: 4,
  });
};

export const generateOrderId = () => {
  const prefix = 'HJ';
  const randomId = cryptoRandomString({
    type: 'distinguishable',
    length: 10,
  });

  return prefix + randomId.toUpperCase();
};

export const parseMobileNumber = (phoneNumber) => {
  const cleanedNumber = phoneNumber.replace(/[^\d]/g, '').replace(/^\+/, '');
  const digitsToRemove = 2;
  const parsedNumber =
    cleanedNumber.length === 12
      ? cleanedNumber.substring(digitsToRemove)
      : cleanedNumber;

  return parsedNumber;
};

export const verifyAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return sendResponse(res, 401, 'Unauthorized');
  }

  next();
};

export const validate = (schema, options = {}) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(
      // @ts-ignore
      options?.field ? req[options.field] : req.body,
      {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
        errors: {
          wrap: {
            label: '',
          },
        },
        ...options,
      }
    );

    if (error) {
      const errors = error.details.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.context?.key || 'error']: cur.message,
        }),
        { error: null }
      );
      // @ts-ignore
      errors.error = error.message;
      return sendResponse(res, 422, 'Validation error', null, errors);
    }

    req.body = value;
    next();
  };
};

export const axiosClient = () => {
  const axios = client.create();

  axios.interceptors.response.use(
    (response) => response.data,
    (err) => {
      if (err.response) {
        return Promise.reject({
          status: err.response.status,
          ...(typeof err.response.data === 'object' ? err.response.data : {}),
        });
      } else if (err.request) {
        throw new Error(err.message);
      } else {
        throw new Error(err);
      }
    }
  );
  return axios;
};

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

export const checkAuthAdmin = () => (req, res, next) => {
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
    console.log('here in check Admin auth');
    const user = await Admin.findOne({ _id: payload.userId }).lean();
    if (!user) {
      return sendResponse(res, 404, 'User not found');
    }

    req.user = user;

    next();
  });
};

export const checkVendorAuth = () => (req, res, next) => {
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
    const vendor = await Vendor.findOne({ _id: payload.userId }).lean();
    if (!vendor) {
      return sendResponse(res, 404, 'User not found');
    }
    req.user = vendor;
    next();
  });
};
