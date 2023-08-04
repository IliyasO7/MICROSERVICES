import multer from 'multer';
import cryptoRandomString from 'crypto-random-string';
import multerS3 from 'multer-s3';
import s3 from './s3.js';

const fileUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (_req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueId = cryptoRandomString({ type: 'hex', length: 25 });
      // @ts-ignore
      const folderName = req.folderMaps?.[file?.fieldname];

      cb(null, `${folderName ? `${folderName}/` : ''}${uniqueId}`);
    },
  }),
});

const _middleware =
  (req, next, raw = false) =>
  (err) => {
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(new Error(`Unexpected field: ${err.field}`));
      }
      return next(err);
    }

    if (req.file) {
      // @ts-ignore
      req.body[req.file.fieldname] = req.file.key;
    }

    if (req.files) {
      for (const file in req.files) {
        if (raw) {
          // @ts-ignore
          req.body[file] = req.files[file].map((e) => e.key);
        } else {
          // @ts-ignore
          req.body[file] = req.files[file][0].key;
        }
      }
    }

    if (req.body.payload_json) {
      Object.assign(req.body, JSON.parse(req.body.payload_json));
    }

    next();
  };

fileUpload.auto =
  (fields, folders, raw = false) =>
  (req, res, next) => {
    if (Array.isArray(fields)) {
      req.folderMaps = fields.reduce((prev, curr, index) => {
        prev[curr?.name || curr] = folders?.[index];
        return prev;
      }, {});

      if (raw) {
        fileUpload.fields(fields)(req, res, _middleware(req, next, true));
        return;
      }

      fileUpload.fields(fields.map((item) => ({ name: item, maxCount: 1 })))(
        req,
        res,
        _middleware(req, next)
      );
      return;
    }

    req.folderMaps = {
      [fields]: folders,
    };

    fileUpload.single(fields)(req, res, _middleware(req, next));
  };

export default fileUpload;
