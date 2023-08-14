import Address from '../../../shared/models/address.js';
import Bank from '../../../shared/models/bank.js';
import User from '../../../shared/models/user.js';
import { sendResponse } from '../../../shared/utils/helper.js';

export const createUser = async (req, res) => {
  const exist = await User.findOne({ mobile: req.body.mobile });

  if (exist) {
    return sendResponse(res, 400, 'mobile no is already taken', null, {
      code: 11,
    });
  }

  const user = new User({
    ...req.body,
  });

  if (req.body.bank) {
    await Bank.create({
      user: user._id,
      name: req.body.bank.name,
      accountNo: req.body.bank.accountNo,
      ifscCode: req.body.bank.ifscCode,
      document: req.body.bank.document,
      isDefault: true,
    });
  }

  if (req.body.isOwner) {
    user.owner = {
      isRegistered: true,
      isActive: true,
      addedBy: req.user._id,
    };
  }

  if (req.body.isTenant) {
    user.owner = {
      isRegistered: true,
      isActive: true,
      addedBy: req.user._id,
    };
  }

  user.addedBy = req.user._id;

  await user.save();

  sendResponse(res, 200, 'success', user);
};

export const getUsers = async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter['fname'] = new RegExp(req.query.name, 'i');
  }

  if (req.query.mobile) {
    filter['mobile'] = req.query.mobile;
  }

  if (req.query.isOwner === 'true') {
    filter['owner.isRegistered'] = true;
  }

  if (req.query.isTenant === 'true') {
    filter['tenant.isRegistered'] = true;
  }

  const data = await User.find(filter).lean();

  return sendResponse(res, 200, 'success', data);
};

export const getUserById = async (req, res) => {
  const data = await User.findById(req.params.id).lean();
  if (!data) return sendResponse(res, 404, 'customer does not exist');

  sendResponse(res, 200, 'success', data);
};

export const updateUser = async (req, res) => {
  const data = await User.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'customer does not exist');

  Object.assign(data, req.body);

  if (req.body.isOwner === false) {
    data.owner.isRegistered = false;
  }

  if (req.body.isTenant) {
    data.tenant.isRegistered = true;
  }

  await data.save();
  sendResponse(res, 200, 'success', data);
};

export const deleteUser = async (req, res) => {
  const data = await User.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'user does not exist');

  await data.deleteOne();

  sendResponse(res, 200, 'success');
};

export const createUserAddress = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return sendResponse(res, 404, 'user does not exist');

  const address = await Address.create({
    fname: user.fname,
    lname: user.lname,
    user: user._id,
    mobile: user.mobile,
    ...req.body,
  });
  sendResponse(res, 200, 'success', address);
};

export const getUserAddresses = async (req, res) => {
  const data = await Address.find({ user: req.params.id }).lean();

  sendResponse(res, 200, 'success', data);
};
