import Address from '../../../shared/models/address.js';
import Bank from '../../../shared/models/bank.js';
import User from '../../../shared/models/user.js';
import { sendResponse } from '../../../shared/utils/helper.js';

export const getProfile = async (req, res) => {
  const user = await User.findById(req.userId).lean();
  if (!user) return sendResponse(res, 401, 'user not found');

  sendResponse(res, 200, 'success', user);
};

export const createProfile = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return sendResponse(res, 401, 'user not found');

  Object.assign(user, req.body);

  user.isProfileCompleted = true;

  await user.save();

  sendResponse(res, 201, 'success');
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return sendResponse(res, 401, 'user not found');

  Object.assign(user, req.body);

  await user.save();

  sendResponse(res, 200, 'success', user);
};

// address
export const getAddresses = async (req, res) => {
  const data = await Address.find({ user: req.userId }).lean();
  sendResponse(res, 200, 'success', data);
};

export const createAddress = async (req, res) => {
  const address = await Address.create({
    user: req.userId,
    isDefault:true,
    ...req.body,
  });
  sendResponse(res, 201, 'success', address);
};

export const addAddress = async (req, res) => {
  const address = await Address.create({
    user: req.userId,
    isDefault:false,
    ...req.body,
  });
  sendResponse(res, 201, 'success', address);
};

export const getAddressById = async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.userId,
  }).lean();
  if (!address) return sendResponse(res, 404, 'address not found');

  sendResponse(res, 200, 'success', address);
};

export const updateAddress = async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.userId,
  });
  if (!address) return sendResponse(res, 404, 'address not found');

  Object.assign(address, req.body);

  await address.save();

  sendResponse(res, 200, 'success', address);
};

export const deleteAddress = async (req, res) => {
  await Address.deleteOne({ _id: req.params.id, user: req.userId });
  sendResponse(res, 200, 'success');
};

export const setDefaultAddress = async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.userId,
  });
  if (!address) return sendResponse(res, 404, 'address not found');

  await Address.updateMany(
    { _id: { $ne: address._id }, user: req.userId },
    { isDefault: req.body.default }
  );

  sendResponse(res, 200, 'success');
};

// bankAccount
export const getBankAccounts = async (req, res) => {
  const data = await Bank.find({ user: req.userId }).lean();
  sendResponse(res, 200, 'success', data);
};

export const createBankAccount = async (req, res) => {
  const bankAccount = await Bank.create({
    user: req.userId,
    ...req.body,
    isDefault:true
  });
  sendResponse(res, 201, 'success', bankAccount);
};

export const getBankAccountById = async (req, res) => {
  const bankAccount = await Bank.findOne({
    _id: req.params.id,
    user: req.userId,
  }).lean();
  if (!bankAccount) return sendResponse(res, 404, 'bank account not found');

  sendResponse(res, 200, 'success', bankAccount);
};

export const updateBankAccount = async (req, res) => {
  const bankAccount = await Bank.findOne({
    _id: req.params.id,
    user: req.userId,
  });
  if (!bankAccount) return sendResponse(res, 404, 'bank account not found');

  Object.assign(bankAccount, req.body);

  await bankAccount.save();

  sendResponse(res, 200, 'success', bankAccount);
};

export const deleteBankAccount = async (req, res) => {
  await Bank.deleteOne({ _id: req.params.id, user: req.userId });
  sendResponse(res, 200, 'success');
};

export const setDefaultBankAccount = async (req, res) => {
  const bankAccount = await bankAccount.findOne({
    _id: req.params.id,
    user: req.userId,
  });
  if (!bankAccount) return sendResponse(res, 404, 'bank account not found');

  await Bank.updateMany(
    { _id: { $ne: bankAccount._id }, user: req.userId },
    { isDefault: false }
  );

  sendResponse(res, 200, 'success');
};
