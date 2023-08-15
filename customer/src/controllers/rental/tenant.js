import dayjs from 'dayjs';
import { ContractStatus } from '../../../../shared/models/rental/contract.js';
import {
  ContractPaymentStatus,
  ContractPaymentType,
} from '../../../../shared/models/rental/contractPayment.js';
import { sendResponse } from '../../../../shared/utils/helper.js';
import Contract from '../../../../shared/models/rental/contract.js';
import ContractPayment from '../../../../shared/models/rental/contractPayment.js';
import {
  createPaymentOrder,
  verifyPayment,
} from '../../../../shared/services/payu.js';

export const getContracts = async (req, res) => {
  const filter = { tenant: req.user._id };

  if (req.query.status) {
    filter['status'] = req.query.status;
  }

  const data = await Contract.find(filter)
    .populate('property')
    .populate('owner')
    .lean();

  const payload = data.map((item) => ({
    _id: item._id,
    contractId: item.contractId,
    property: {
      _id: item.property._id,
      name: item.property.name,
      images: item.property.mainImages,
      bhk: item.property.bhk,
      door: item.property.door,
      address: item.property.address,
    },
    rentAmount: item.rentAmount,
    paymentDueDate: item.dueDate,
    isPaymentDue: dayjs().isAfter(item.dueDate),
    isTokenAdvancePaid: item.tokenAdvance.isPaid,
    isSecurityDepositPaid: item.securityDeposit.isPaid,
    createdAt: item.createdAt,
  }));

  return sendResponse(res, 200, 'success', payload);
};

export const getContractById = async (req, res) => {
  const userId = req.user._id;
  const data = await Contract.findOne({
    _id: req.params.id,
    tenant: userId,
  })
    .populate('property')
    .populate('owner', 'fname lname mobile')
    .lean();

  if (!data) return sendResponse(res, 404, 'contract does not exist');

  return sendResponse(res, 200, 'success', {
    ...data,
    isPaymentDue: dayjs().isAfter(data.dueDate),
  });
};

export const getPayments = async (req, res) => {
  const data = await ContractPayment.find({
    contract: req.params.id,
  }).lean();

  return sendResponse(res, 200, 'success', data);
};

export const tokenPayment = async (req, res) => {
  const userId = req.user._id;
  const contractId = req.params.id;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });

  if (!contract) {
    return sendResponse(res, 404, 'Contract does not exist');
  }

  if (contract.tokenAdvance.isPaid) {
    return sendResponse(res, 400, 'token advance is already paid');
  }

  const payment = await createPaymentOrder({
    name: req.user.fname,
    email: req.user.email,
    mobile: req.user.mobile,
    userId: req.user._id.toString(),
    referenceId: contract._id.toString(),
    product: 'Token Advance',
    amount: contract.tokenAdvance.amount,
    callbackUrl: `${process.env.BASE_URL}/customer/rental/tenant/contracts/${contract._id}/token-payment-confirm`,
    redirectUrl: `https://housejoygroup.com/account/contracts/${contract._id}`,
  });

  sendResponse(res, 200, 'success', {
    id: contract._id,
    amount: payment.amount,
    paymentUrl: payment.url,
  });
};

export const tokenPaymentConfirm = async (req, res) => {
  const contractId = req.params.id;
  const userId = req.body.udf1;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });

  if (!contract) {
    return sendResponse(res, 404, 'Contract does not exist');
  }

  const payment = await verifyPayment(req.body);
  if (!payment.success) return res.redirect(payment.redirectUrl);

  await ContractPayment.create({
    contract: contractId,
    type: ContractPaymentType.TOKEN,
    amount: contract.tokenAdvance.amount,
    payment: payment.data._id,
    status: ContractPaymentStatus.PAID,
  });

  contract.tokenAdvance.isPaid = true;
  (contract.tokenAdvance.paidAt = payment.data.paidAt),
    (contract.status = ContractStatus.ACTIVE);

  await contract.save();

  res.redirect(payment.redirectUrl);
};

export const depositPayment = async (req, res) => {
  const userId = req.user._id;
  const contractId = req.params.id;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });

  if (!contract) {
    return sendResponse(res, 404, 'Contract Does not Exist');
  }

  if (contract.securityDeposit.isPaid) {
    return sendResponse(res, 400, 'token advance is already paid');
  }

  const payment = await createPaymentOrder({
    name: req.user.fname,
    email: req.user.email,
    mobile: req.user.mobile,
    userId: req.user._id.toString(),
    referenceId: contract._id.toString(),
    product: 'Security Deposit',
    amount: contract.securityDeposit.amount,
    callbackUrl: `${process.env.BASE_URL}/customer/rental/tenant/contracts/${contract._id}/deposit-payment-confirm`,
    redirectUrl: `https://housejoygroup.com/account/contracts/${contract._id}`,
  });

  sendResponse(res, 200, 'success', {
    id: contract._id,
    amount: payment.amount,
    paymentUrl: payment.url,
  });
};

export const depositPaymentConfirm = async (req, res) => {
  const contractId = req.params.id;
  const userId = req.body.udf1;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });

  if (!contract) {
    return sendResponse(res, 404, 'Contract Does not Exist');
  }

  const payment = await verifyPayment(req.body);
  if (!payment.success) return res.redirect(payment.redirectUrl);

  await ContractPayment.create({
    contract: contractId,
    type: ContractPaymentType.DEPOSIT,
    amount: contract.securityDeposit.amount,
    payment: payment.data._id,
    status: ContractPaymentStatus.PAID,
  });

  contract.securityDeposit.isPaid = true;
  contract.securityDeposit.paidAt = payment.data.paidAt;

  await contract.save();

  res.redirect(payment.redirectUrl);
};

export const rentPayment = async (req, res) => {
  const userId = req.user._id;
  const contractId = req.params.id;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });
  const prevDue = contract.dueDate;

  if (!contract) {
    return sendResponse(res, 404, 'Contract Does not Exist');
  }

  const payment = await createPaymentOrder({
    name: req.user.fname,
    email: req.user.email,
    mobile: req.user.mobile,
    userId: req.user._id.toString(),
    referenceId: contract._id.toString(),
    product: 'Security Deposit',
    amount: contract.securityDeposit.amount,
    callbackUrl: `${process.env.BASE_URL}/customer/rental/tenant/contracts/${contract._id}/rent-payment-confirm`,
    redirectUrl: `https://housejoygroup.com/account/contracts/${contract._id}`,
  });

  sendResponse(res, 200, 'success', {
    id: contract._id,
    amount: payment.amount,
    paymentUrl: payment.url,
  });

  const data = await ContractPayment.create({
    contract: contractId,
    type: ContractPaymentType.RENT,
    amount: contract.rentAmount,
    status: ContractPaymentStatus.PAID,
  });

  contract.dueDate = dayjs(prevDue).add(1, 'month').toDate();

  await contract.save();

  return sendResponse(res, 200, 'Rent Paid Successfully', data);
};

export const rentPaymentConfirm = async (req, res) => {
  const contractId = req.params.id;
  const userId = req.body.udf1;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });
  const prevDue = contract.dueDate;

  if (!contract) {
    return sendResponse(res, 404, 'Contract Does not Exist');
  }

  const payment = await verifyPayment(req.body);
  if (!payment.success) return res.redirect(payment.redirectUrl);

  await ContractPayment.create({
    contract: contractId,
    type: ContractPaymentType.RENT,
    amount: contract.rentAmount,
    payment: payment.data._id,
    status: ContractPaymentStatus.PAID,
  });

  contract.dueDate = dayjs(prevDue).add(1, 'month').toDate();

  await contract.save();

  res.redirect(payment.redirectUrl);
};
