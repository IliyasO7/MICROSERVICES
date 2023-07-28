import { sendResponse } from '../../../shared/utils/helper';

export const getOverview = async (req, res) => {
  const payload = {
    ownerCount: 0,
    tenantCount: 0,
    contractCount: 0,
    propertyCount: 0,
  };
  sendResponse(res, 200, 'success', payload);
};
