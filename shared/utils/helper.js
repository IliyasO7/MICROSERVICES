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
