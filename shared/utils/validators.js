import joi from 'joi';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

const validators = {
  fileKey: (folder) => {
    return joi
      .string()
      .custom((value, helpers) => {
        if (value.startsWith(folder)) {
          return value;
        } else {
          return helpers.error('startsWith', {
            v: value,
            prefix: folder,
          });
        }
      })
      .messages({
        startsWith: `{{#label}} must starts with ${folder}`,
      });
  },

  objectId: () =>
    joi
      .string()
      .custom((value, helpers) => {
        if (mongoose.isObjectIdOrHexString(value) === false) {
          return helpers.error('objectId');
        }

        return value;
      })
      .messages({
        objectId: '{{#label}} must be a valid ObjectId',
      }),

  date: () =>
    joi
      .string()
      .custom((value, helpers) => {
        const date = dayjs(value, 'DD/MM/YYYY');
        if (!date.isValid()) return helpers.error('dateFormat');

        return date.toDate();
      })
      .messages({
        dateFormat: '{{#label}} must be in `DD/MM/YYYY` format',
      }),
};

export default validators;
