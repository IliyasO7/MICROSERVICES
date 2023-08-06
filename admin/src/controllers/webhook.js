import Lead, { LeadPlatform, LeadType } from '../../../shared/models/lead.js';
import {
  parseMobileNumber,
  sendResponse,
} from '../../../shared/utils/helper.js';
import Service from '../../../shared/models/ods/service.js';

export const createZapierLead = async (req, res) => {
  const service = await Service.findOne({
    name: req.body.serviceName,
  }).lean();

  console.log(req.body);

  const data = new Lead({
    type: req.body.type,
    platform: req.body.platform,
    customerInfo: {
      name: req.body.name,
      email: req.body.email,
      mobile: parseMobileNumber(req.body.mobile),
    },
    service: service?._id || '64ca3577c1c1e0703b2bab4d',
  });

  await data.save();

  sendResponse(res, 200, 'success');
};
