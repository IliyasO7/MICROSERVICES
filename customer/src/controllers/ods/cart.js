import { sendResponse } from '../../../../shared/utils/helper.js';
import Cart from '../../../../shared/models/ods/cart.js';
import ServicePackage from '../../../../shared/models/ods/package.js';
import Service from '../../../../shared/models/ods/service.js';

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

      const subPackage = item.packageId.subPackages.find((element) =>
        element._id.equals(item.subPackageId)
      );
      const rate = subPackage?.price || item.packageId.price;
      const amount = item.quantity * rate;

      totalAmount += amount;

      console.log(subPackage);

      return {
        packageId: item.packageId._id,
        packageName: item.packageId.name,
        subPackageId: item.subPackageId ?? null,
        subPackageName: subPackage ? subPackage.name : null,
        quantity: item.quantity,
        rate,
        amount,
      };
    });

    if (!cart.service) continue;

    payload.push({
      cartId: cart._id,
      serviceId: cart.service._id,
      serviceName: cart.service.name,
      serviceIcon: cart.service.icon ?? '',
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

    const subPackage = item.packageId.subPackages.find((element) =>
      element._id.equals(item.subPackageId)
    );
    const rate = subPackage?.price || item.packageId.price;
    const amount = item.quantity * rate;

    totalAmount += amount;

    return {
      packageId: item.packageId._id,
      packageName: item.packageId.name,
      subPackageId: item.subPackageId ?? null,
      subPackageName: subPackage ? subPackage.name : null,
      quantity: item.quantity,
      rate,
      amount,
    };
  });

  const payload = {
    cartId: cart._id,
    serviceId: cart.service._id,
    serviceName: cart.service.name,
    serviceIcon: cart.service?.icon ?? '',
    items: items.filter(Boolean),
    totalAmount,
  };

  sendResponse(res, 200, 'success', payload);
};

export const getCartServiceById = async (req, res) => {
  const serviceId = req.params.id;
  const service = await Service.findById(serviceId).lean();
  if (!service) return sendResponse(res, 400, 'service does not exist');

  const payload = {
    cartId: '',
    serviceId: service._id,
    serviceName: service.name,
    serviceIcon: service?.icon ?? '',
    items: [],
    totalAmount: 0,
  };

  const cart = await Cart.findOne({
    service: service._id,
    user: req.user._id,
    isActive: true,
  })
    .populate('items.packageId')
    .lean();

  if (cart) {
    let totalAmount = 0;

    const items = cart.items.map((item) => {
      if (!item.packageId) return null;

      const subPackage = item.packageId.subPackages.find((element) =>
        element._id.equals(item.subPackageId)
      );
      const rate = subPackage?.price || item.packageId.price;
      const amount = item.quantity * rate;

      totalAmount += amount;

      return {
        packageId: item.packageId._id,
        packageName: item.packageId.name,
        subPackageId: item.subPackageId ?? null,
        subPackageName: subPackage ? subPackage.name : null,
        quantity: item.quantity,
        rate,
        amount,
      };
    });

    Object.assign(payload, {
      cartId: cart._id,
      items: items.filter(Boolean),
      totalAmount,
    });
  }

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
  } else if (req.body.serviceId) {
    filter['service'] = req.body.serviceId;
  }

  await Cart.deleteMany(filter);

  sendResponse(res, 200, 'success');
};
