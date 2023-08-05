import Lead, { LeadPlatform, LeadType } from '../../../shared/models/lead.js';
import { sendResponse } from '../../../shared/utils/helper.js';
import Service from '../../../shared/models/ods/service.js';

export const createZapierOdsLead = async (req, res) => {
  if (
    !req.body.full_name ||
    !req.body.phone_number ||
    !req.body.email ||
    !req.body.city
  ) {
    return sendResponse(res, 400, 'Parameters Required');
  }

  const service = await Service.findOne({
    name: req.body.types_of_service_,
  }).lean();

  const data = new Lead({
    type: LeadType.ODS,
    platform: LeadPlatform.FACEBOOK,
    customerInfo: {
      name: req.body.full_name,
      mobile: req.body.phone_number,
      city: req.body.city,
    },
    service: service?._id || '64ca3577c1c1e0703b2bab4d',
    inspectionDate:
      req.body['when_would_you_prefer_the_inspection_to_take_place?'],
  });

  await data.save();

  sendResponse(res, 200, 'success');
};
