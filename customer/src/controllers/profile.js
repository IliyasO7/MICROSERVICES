import Address from '../../../shared/models/address.js';
import Bank from '../../../shared/models/bank.js';
import User from '../../../shared/models/user.js';
import { sendResponse } from '../../../shared/utils/helper.js';

export const getProfile = async (req, res) => {
  sendResponse(res, 200, 'success', req.user);
};

export const createProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return sendResponse(res, 401, 'user not found');

  Object.assign(user, req.body);

  user.isProfileCompleted = true;

  await user.save();

  sendResponse(res, 200, 'success');
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return sendResponse(res, 401, 'user not found');

  Object.assign(user, req.body);

  await user.save();

  sendResponse(res, 200, 'success', user);
};

// address
export const getAddresses = async (req, res) => {
  const data = await Address.find({ user: req.user._id }).lean();
  sendResponse(res, 200, 'success', data);
};

export const createAddress = async (req, res) => {
  const address = await Address.create({
    fname: req.user.fname,
    lname: req.user.lname,
    user: req.user._id,
    mobile: req.user.mobile,
    ...req.body,
  });
  sendResponse(res, 201, 'success', address);
};

export const getAddressById = async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).lean();
  if (!address) return sendResponse(res, 404, 'address not found');

  sendResponse(res, 200, 'success', address);
};

export const updateAddress = async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!address) return sendResponse(res, 404, 'address not found');

  Object.assign(address, req.body);

  await address.save();

  sendResponse(res, 200, 'success', address);
};

export const deleteAddress = async (req, res) => {
  await Address.deleteOne({ _id: req.params.id, user: req.user._id });
  sendResponse(res, 200, 'success');
};

export const setDefaultAddress = async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!address) return sendResponse(res, 404, 'address not found');

  await Address.updateMany({ user: req.user._id }, { isDefault: false });

  address.isDefault = true;

  await address.save();

  sendResponse(res, 200, 'success');
};

// bankAccount
export const getBankAccounts = async (req, res) => {
  const data = await Bank.find({ user: req.user._id }).lean();
  sendResponse(res, 200, 'success', data);
};

export const createBankAccount = async (req, res) => {
  const bankAccount = await Bank.create({
    user: req.user._id,
    ...req.body,
  });
  sendResponse(res, 201, 'success', bankAccount);
};

export const getBankAccountById = async (req, res) => {
  const bankAccount = await Bank.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).lean();
  if (!bankAccount) return sendResponse(res, 404, 'bank account not found');

  sendResponse(res, 200, 'success', bankAccount);
};

export const updateBankAccount = async (req, res) => {
  const bankAccount = await Bank.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!bankAccount) return sendResponse(res, 404, 'bank account not found');

  Object.assign(bankAccount, req.body);

  await bankAccount.save();

  sendResponse(res, 200, 'success', bankAccount);
};

export const deleteBankAccount = async (req, res) => {
  await Bank.deleteOne({ _id: req.params.id, user: req.user._id });
  sendResponse(res, 200, 'success');
};

export const setDefaultBankAccount = async (req, res) => {
  const bankAccount = await Bank.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!bankAccount) return sendResponse(res, 404, 'bank account not found');

  await Bank.updateMany({ user: req.user._id }, { isDefault: false });

  bankAccount.isDefault = true;

  await bankAccount.save();

  sendResponse(res, 200, 'success');
};
