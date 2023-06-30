import cryptoRandomString from "crypto-random-string";
import client from "axios";

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

/*
// Check if customer is logged In
export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded
    console.log('here in islogged in');
    next();
  } catch (err) {
    next({
      status: 401,
      message: 'Invalid authorization'
    })
  }
}
*/