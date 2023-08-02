import { sendResponse } from '../../../../shared/utils/helper.js';
import Cart from '../../../models/ods/cart.js';
import ServicePackage from '../../../models/ods/package.js';

const getRate = (packageData, subPackageId = null) => {
  const subPackage = packageData.subPackages?.find((item) =>
    item._id.equals(subPackageId)
  );
  if (!subPackageId) return packageData.price;

  return subPackage.prices;
};

export const getCart = async (req, res) => {
  const data = await Cart.find({ user: req.user._id, isActive: true })
    .populate('service')
    .populate('items.packageId')
    .lean();

  const payload = [];

  for (const cart of data) {
    let totalAmount = 0;

    const items = cart.items.map((item) => {
      if (!item.packageId) return null;

      const rate = getRate(item.packageId, item.subPackageId);
      const amount = item.quantity * rate;

      totalAmount += amount;

      return {
        packageId: item.packageId._id,
        packageName: item.packageId.name,
        subPackageId: item.subPackageId ?? null,
        quantity: item.quantity,
        rate,
        amount,
      };
    });

    payload.push({
      cartId: cart._id,
      serviceId: cart.service._id,
      serviceName: cart.service.name,
      serviceImage: cart.service?.image ?? '',
      items: items.filter(Boolean),
      totalAmount,
    });
  }

  sendResponse(res, 200, 'success', payload);
};

export const getCartById = async (req, res) => {
  const cart = await Cart.findOne({
    _id: req.params.id,
    user: req.user._id,
    isActive: true,
  })
    .populate('service')
    .populate('items.packageId')
    .lean();

  if (!cart) return sendResponse(res, 404, 'cart not found');

  let totalAmount = 0;

  const items = cart.items.map((item) => {
    if (!item.packageId) return null;

    const rate = getRate(item.packageId, item.subPackageId);
    const amount = item.quantity * rate;

    totalAmount += amount;

    return {
      packageId: item.packageId._id,
      packageName: item.packageId.name,
      subPackageId: item.subPackageId ?? null,
      quantity: item.quantity,
      rate,
      amount,
    };
  });

  const payload = {
    cartId: cart._id,
    serviceId: cart.service._id,
    serviceName: cart.service.name,
    serviceImage: cart.service?.image ?? '',
    items: items.filter(Boolean),
    totalAmount,
  };

  sendResponse(res, 200, 'success', payload);
};

export const addItem = async (req, res) => {
  const packageData = await ServicePackage.findById(req.body.packageId);
  if (!packageData) return sendResponse(res, 404, 'package not found');

  let cart = await Cart.findOne({
    user: req.user._id,
    service: packageData.service,
  });

  if (!cart) {
    cart = new Cart({ user: req.user._id, service: packageData.service });
  }

  const item = cart.items.find((element) =>
    element.packageId.equals(packageData._id)
  );

  if (item) {
    item.quantity += 1;
    item.subPackageId = req.body.subPackageId || null;
  } else {
    cart.items.push({
      packageId: packageData._id,
      subPackageId: req.body.subPackageId || null,
      quantity: 1,
    });
  }

  await cart.save();

  sendResponse(res, 200, 'success', { cartId: cart._id });
};

export const removeItem = async (req, res) => {
  const cart = await Cart.findOne({
    user: req.user._id,
    'items.packageId': req.body.packageId,
    isActive: true,
  });
  if (!cart) return sendResponse(res, 404, 'item does not exist');

  const item = cart.items.find((item) =>
    item.packageId.equals(req.body.packageId)
  );

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart.items.pull({ _id: item._id });
  }

  if (cart.items.length) {
    await cart.save();
  } else {
    await cart.deleteOne();
  }

  sendResponse(res, 200, 'success');
};

export const clearCart = async (req, res) => {
  const filter = { user: req.user._id };

  if (req.body.cartId) {
    filter['_id'] = req.body.cartId;
  }

  await Cart.deleteMany(filter);

  sendResponse(res, 200, 'success');
};
