import { repeatFunction, sendResponse } from '../../../shared/utils/helper.js';
import {
  baseS3Url,
  createPreSignedUrl,
} from '../.././../shared/services/s3.js';

const generate = async ({ path, count }) => {
  const items = [];

  for (let i = 0; i < count; i++) {
    items.push(createPreSignedUrl(path));
  }

  return Promise.all(items);
};

export const getBaseUrl = async (req, res) => {
  sendResponse(res, 200, 'success', {
    baseURL: baseS3Url,
  });
};

export const createSignedUrl = async (req, res) => {
  const payload = await Promise.all(
    req.body.files.map(async (item) => ({
      path: item.path,
      count: item.count,
      files: await repeatFunction({
        fn: createPreSignedUrl,
        args: [item.path],
        count: item.count,
        parallel: true,
      }),
    }))
  );

  sendResponse(res, 200, 'success', payload);
};
