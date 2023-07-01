import cryptoRandomString from "crypto-random-string";
import client from "axios";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const sendResponse = (
  res,
  statusCode,
  message,
  data = null,
  errors = null
) => {
  return res.status(statusCode).json({
    status: statusCode,
    message: message || "success",
    data,
    errors,
  });
};

export const generateOtp = () => {
  return cryptoRandomString({
    type: "numeric",
    length: 4,
  });
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
            label: "",
          },
        },
        ...options,
      }
    );

    if (error) {
      const errors = error.details.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.context?.key || "error"]: cur.message,
        }),
        { error: null }
      );
      // @ts-ignore
      errors.error = error.message;
      return sendResponse(res, 422, "Validation error", null, errors);
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
          ...(typeof err.response.data === "object" ? err.response.data : {}),
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
  const token = req.headers.authorization?.split(" ")[1];
  const secret = process.env.JWT_ACCESS_TOKEN_SECRET ?? "";

  if (!token)
    return sendResponse(res, 401, "Authorization is required", null, {
      code: AuthError.NO_TOKEN,
    });

  jwt.verify(token, secret, {}, async (err, payload) => {
    if (err) {
      const errMessage =
        err.name === "TokenExpiredError"
          ? "Access token expired"
          : "Invalid access token";

      sendResponse(res, 401, errMessage, null, {
        code:
          err.name === "TokenExpiredError"
            ? AuthError.TOKEN_EXPIRED
            : AuthError.INVALID_TOKEN,
      });
      return;
    }
    // @ts-ignore
    const user = await User.findOne({ _id: payload.userId }).lean();
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    req.user = user;

    next();
  });
};
