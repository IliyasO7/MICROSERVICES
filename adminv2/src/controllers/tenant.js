import User from "../../models/user.js";
import Property from "../../models/property.js";
import Admin from "../../models/admin.js";
import Contract from "../../models/contract.js";
import dayjs from "dayjs";
import { sendResponse } from "../../../shared/utils/helper.js";

export const createTenant = async (req, res) => {
  let user = await User.findOne({ mobile: req.body.mobile });
  let propertyDetails = await Property.findOne({ _id: req.body.propertyId });

  if (!propertyDetails) {
    return sendResponse(res, 400, "Property Does Not Exists");
  }

  let contract = await Contract.findOne({
    property: req.body.propertyId,
    tenant: user._id,
  });

  if (contract) {
    return sendResponse(res, 400, "Contract Already Exists With This Property");
  }

  if (user?.tenant?.isActive) {
    return sendResponse(res, 400, "Tenant already exists");
  }

  if (!user) {
    user = new User({
      fname: req.body.fname,
      email: req.body.email,
      mobile: req.body.mobile,
      isProfileCompleted: true,
      tenant: {
        isActive: true,
        addedBy: req.user._id,
      },
    });
    await user.save();
  }

  const dueDates = dayjs(req.body.moveInDate).add(1, "month").toDate();
  const totalContracts = await Contract.countDocuments({});
  const currentContractNo = totalContracts + 1;
  const sku = `HJR${currentContractNo}`;

  if (!contract) {
    contract.tenant = user._id;
    contract.contractId = sku;
    contract.property = req.body.propertyId;
    contract.proprietor = propertyDetails.proprietor;
    contract.rentAmount = propertyDetails.rent;
    contract.moveInDate = req.body.moveInDate;
    contract.moveOutDate = req.body.moveOutDate;
    contract.dueDate = dueDates;
    contract.commissionPercentage = req.body.commision;
    contract.tokenAdvance.amount = req.body.tokenAdvance;
    contract.secuirityDeposit.amount = propertyDetails.depositAmount;
    contract.createdBy = req.user._id;

    propertyDetails.tokenAmount = req.body.tokenAdvance;
    await propertyDetails.save();
    await contract.save();

    return sendResponse(res, 200, "Tenant And Contract Added successfully", {
      user,
      propertyDetails,
      contract,
    });
  }
};

export const getTenants = async (req, res) => {
  const filter = {
    "tenant.isActive": true,
  };

  if (req.query.mine == "true") {
    filter["tenant.addedBy"] = req.user._id;
  }

  if (req.query.mobile) {
    filter["mobile"] = req.query.mobile;
  }

  const data = await User.find(filter);

  return sendResponse(res, 200, "success", data);
};

export const getTenantById = async (req, res) => {
  const data = await User.findById(req.params.id).lean();
  if (!data) return sendResponse(res, 404, "Tenant does not exist");

  sendResponse(res, 200, "success", data);
};

export const getTenantContracts = async (req, res) => {
  const data = await Contract.find({ tenant: req.params.id }).lean();
  sendResponse(res, 200, "success", data);
};

export const getTenantProperties = async (req, res) => {
  const contract = await Contract.find({ tenant: req.params.id }).lean();
  if (!contract) {
    return sendResponse(res, 200, "Data Not Found");
  }
  const data = await Property.find({ proprietor: contract.proprietor }).lean();
  return sendResponse(res, 200, "success", data);
};
