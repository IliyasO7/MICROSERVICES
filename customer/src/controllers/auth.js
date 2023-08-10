import bcrypt from 'bcrypt';
import { generateOtp, sendResponse } from '../../../shared/utils/helper.js';
import redis from '../../../shared/utils/redis.js';
import User from '../../../shared/models/user.js';
import { generateTokens } from '../../../shared/utils/token.js';

export const sendOtp = async (req, res) => {
  const otp = '0000' || generateOtp();

  await redis.setEx(
    `mobile:${req.body.mobile}`,
    60 * 3,
    await bcrypt.hash(otp, 12)
  );
  // const [data, err] = await smsService.send({
  //   type: "TXN",
  //   senderId: "HSEJOY",
  //   templateId: "1107167421497698923",
  //   mobile: req.body.mobile,
  //   message: `Thanks For Choosing Housejoy & Your Login OTP Is ${otp} -Sarvaloka Services On Call Pvt Ltd`,
  // });

  // if (err) {
  //   return sendResponse(res, 400, "something went wrong");
  // }

  sendResponse(res, 200, 'success');
};

export const verifyOtp = async (req, res) => {
  const mobile = req.body.mobile;
  const key = `mobile:${mobile}`;
  const otp = await redis.get(key);

  const isValid = await bcrypt.compare(req.body.otp, otp || '');
  if (!isValid) return sendResponse(res, 400, 'Invalid OTP');

  let user = await User.findOne({ mobile: req.body.mobile });

  if (!user) {
    user = await User.create({ mobile: req.body.mobile });
  }

  await redis.del(key);

  const tokens = generateTokens({ userId: user._id });

  sendResponse(res, 200, 'Otp Verified', {
    accessToken: tokens.accessToken,
    isProfileCompleted: user.isProfileCompleted,
  });
};

export const register = async (req, res) => {
  const exist = await User.findOne({ mobile: req.body.mobile }).lean();
  if (exist)
    return sendResponse(res, 400, 'Mobile number is already registered', null, {
      code: 21,
    });

  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    mobile: req.body.mobile,
  });

  const otp = '0000' || generateOtp();

  await redis.setEx(
    `mobile:${user.mobile}`,
    60 * 3,
    await bcrypt.hash(otp, 12)
  );
  // const [data, err] = await smsService.send({
  //   type: "TXN",
  //   senderId: "HSEJOY",
  //   templateId: "1107167421497698923",
  //   mobile: req.body.mobile,
  //   message: `Thanks For Choosing Housejoy & Your Login OTP Is ${otp} -Sarvaloka Services On Call Pvt Ltd`,
  // });

  // if (err) {
  //   return sendResponse(res, 400, "something went wrong");
  // }

  await user.save();

  sendResponse(res, 200, 'success', user);
};
