import { sendResponse } from "../../../shared/utils/helper.js";
import User from "../../models/user.js";
import Contract from "../../models/contract.js";
import Property from "../../models/property.js";

export const getOverview = async (req, res) => {
  console.log("over view");
  const data = {
    ownerCount: 0,
    tenantCount: 0,
    contractCount: 0,
    propertyCount: 0,
  };

  const admin = req.user._id;
  console.log("user is:", admin);

  const userTenantCount = await User.countDocuments({
    "tenant.addedBy": req.user._id,
    "tenant.isActive": true,
  });

  const userOwnerCount = await User.countDocuments({
    "proprietor.addedBy": req.user._id,
    "proprietor.isActive": true,
  });

  const properties = await Property.countDocuments({ createdBy: admin });

  const contracts = await Contract.countDocuments({ createdBy: admin });

  (data.ownerCount = userOwnerCount),
    (data.tenantCount = userTenantCount),
    (data.contractCount = contracts),
    (data.propertyCount = properties);

  sendResponse(res, 200, "success", data);
};
