import Payu from "payu";
import Payment, { PaymentStatus } from "../models/payment.js";

export const payU = new Payu({
  merchantKey: process.env.PAYUMERCHANTKEY,
  salt: process.env.PAYUSALT,
});
