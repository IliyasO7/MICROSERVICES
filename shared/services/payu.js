import crypto from 'crypto';
import qs from 'qs';
import Payment from '../models/payment.js';
import cryptoRandomString from 'crypto-random-string';

export const createPaymentOrder = async ({
  name,
  email,
  mobile,
  product = 'order',
  amount,
}) => {
  amount = 1;

  const payment = await Payment.create({
    orderId: cryptoRandomString({
      type: 'hex',
      length: 10,
    }),
    amount,
  });

  const input = [
    process.env.PAYU_KEY,
    payment._id.toString(),
    amount,
    product,
    name,
    email,
    '|||||||||',
    process.env.PAYU_SALT,
  ].join('|');

  const hash = crypto.createHash('sha512').update(input).digest('hex');
  const query = qs.stringify({
    name,
    email,
    mobile,
    product,
    hash,
    callbackUrl: `${process.env.BASE_URL}/customer/payments/${payment._id}/payu-callback`,
  });

  return {
    ...payment.toJSON(),
    url: `${process.env.BASE_URL}/customer/payments/${payment._id}/payu-checkout?${query}`,
  };
};
