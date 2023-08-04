import Property from "../../../shared/models/rental/property.js";
import User from "../../../shared/models/user.js";
import Admin from "../../../shared/models/admin.js";
import Contract from "../../../shared/models/rental/contract.js";
import { sendResponse } from "../../../shared/utils/helper.js";
import axios from "axios";
import fs from "fs";

export const createProperty = async (req, res) => {
  const ownerId = req.body.ownerId;
  const name = req.body.name;
  const address = req.body.address;
  const floor = req.body.floor;
  const door = req.body.door;
  const bhk = req.body.bhk;
  const carpetArea = req.body.carpetArea;
  const coordinates = req.body.coordinates;
  const rentAmount = req.body.rentAmount;
  const securityDepositAmount = req.body.depositAmount;

  const property = await Property.countDocuments({});
  const sku = `HJR${property + 1}`;

  const data = await Property.create({
    propertyId: sku,
    proprietor: ownerId,
    name,
    address,
    floor,
    door,
    bhk,
    carpetArea,
    coordinates,
    rentAmount,
    securityDepositAmount,
    createdBy: req.user._id,
  });

  return sendResponse(res, 200, "Property Saved Successfully", data);
};

export const getProperties = async (req, res) => {
  const filter = {};

  if (req.query.mine == "true") {
    filter["createdBy"] = req.user._id;
  }

  const data = await Property.find(filter).populate("proprietor");
  return sendResponse(res, 200, "Properties Fetched Successfully", data);
};

export const getPropertyById = async (req, res) => {
  const data = await Property.findOne({
    _id: req.params.id,
  })
    .populate("proprietor")
    .lean();

  if (!data) return sendResponse(res, 404, "Property does not exist");

  sendResponse(res, 200, "Property Data Fetched Successfully", data);
};

export const updatePropertyImages = async (req, res, next) => {
  try {
    console.log("UPDATING OWNER IMAGES");
    const property = await Property.findOne({
      _id: req.params.propertyId,
    }).lean();

    if (!property) {
      return sendResponse(res, 400, "Property Does Not Exist");
    }
    let data = {
      mainImages: [],
      entranceImages: [],
      kitchenImages: [],
      livingImages: [],
      bedroomImages: [],
      //serviceAgreementUpload: undefined,
    };

    if (req.files.mainImage) {
      for (let i = 0; i < req.files.mainImage.length; i++) {
        const options = {
          method: "PUT",
          url: `https://storage.bunnycdn.com/housejoy/owner/inventory/main/${req.params.propertyId}-${req.files.mainImage[i].originalname}`,
          headers: {
            AccessKey: process.env.BUNNYCDN_API_KEY,
            "content-type": "multipart/form-data",
          },
          data: fs.readFileSync(req.files.mainImage[i].path),
        };
        const mainImages = await axios(
          options,
          function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
          }
        );
        if (mainImages.status === 201) {
          data.mainImages[
            i
          ] = `https://housejoy.b-cdn.net/owner/inventory/main/${req.params.propertyId}-${req.files.mainImage[i].originalname}`;
        }
        await Property.updateOne(
          { _id: req.params.propertyId },
          {
            $set: data,
          }
        );
      }
    }

    if (req.files.entranceImage) {
      for (let i = 0; i < req.files.entranceImage.length; i++) {
        const options = {
          method: "PUT",
          url: `https://storage.bunnycdn.com/housejoy/owner/inventory/entrance/${req.params.propertyId}-${req.files.entranceImage[i].originalname}`,
          headers: {
            AccessKey: "af1a5c9e-c720-4f55-b177cd11060e-86b0-47be",
            "content-type": "multipart/form-data",
          },
          data: fs.readFileSync(req.files.entranceImage[i].path),
        };
        const entranceImages = await axios(
          options,
          function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
          }
        );
        if (entranceImages.status === 201) {
          data.entranceImages[
            i
          ] = `https://housejoy.b-cdn.net/owner/inventory/entrance/${req.params.propertyId}-${req.files.entranceImage[i].originalname}`;
        }
        await Property.updateOne(
          { _id: req.params.propertyId },
          {
            $set: data,
          }
        );
      }
    }

    if (req.files.livingImage) {
      for (let i = 0; i < req.files.livingImage.length; i++) {
        const options = {
          method: "PUT",
          url: `https://storage.bunnycdn.com/housejoy/owner/inventory/living/${req.params.propertyId}-${req.files.livingImage[i].originalname}`,
          headers: {
            AccessKey: process.env.BUNNYCDN_API_KEY,
            "content-type": "multipart/form-data",
          },
          data: fs.readFileSync(req.files.livingImage[i].path),
        };
        const livingImages = await axios(
          options,
          function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
          }
        );
        if (livingImages.status === 201) {
          data.livingImages[
            i
          ] = `https://housejoy.b-cdn.net/owner/inventory/living/${req.params.propertyId}-${req.files.livingImage[i].originalname}`;
        }
        await Property.updateOne(
          { _id: req.params.propertyId },
          {
            $set: data,
          }
        );
      }
    }

    if (req.files.bedroomImage) {
      for (let i = 0; i < req.files.bedroomImage.length; i++) {
        const options = {
          method: "PUT",
          url: `https://storage.bunnycdn.com/housejoy/owner/inventory/bedroom/${req.params.propertyId}-${req.files.bedroomImage[i].originalname}`,
          headers: {
            AccessKey: process.env.BUNNYCDN_API_KEY,
            "content-type": "multipart/form-data",
          },
          data: fs.readFileSync(req.files.bedroomImage[i].path),
        };
        const bedroomImages = await axios(
          options,
          function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
          }
        );
        if (bedroomImages.status === 201) {
          data.bedroomImages[
            i
          ] = `https://housejoy.b-cdn.net/owner/inventory/bedroom/${req.params.propertyId}-${req.files.bedroomImage[i].originalname}`;
        }
        await Property.updateOne(
          { _id: req.params.propertyId },
          {
            $set: data,
          }
        );
      }
    }

    if (req.files.kitchenImage) {
      for (let i = 0; i < req.files.kitchenImage.length; i++) {
        const options = {
          method: "PUT",
          url: `https://storage.bunnycdn.com/housejoy/owner/inventory/kitchen/${req.params.propertyId}-${req.files.kitchenImage[i].originalname}`,
          headers: {
            AccessKey: process.env.BUNNYCDN_API_KEY,
            "content-type": "multipart/form-data",
          },
          data: fs.readFileSync(req.files.kitchenImage[i].path),
        };

        const kitchenImages = await axios(
          options,
          function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
          }
        );
        if (kitchenImages.status === 201) {
          data.kitchenImages[
            i
          ] = `https://housejoy.b-cdn.net/owner/inventory/kitchen/${req.params.propertyId}-${req.files.kitchenImage[i].originalname}`;
        }

        await Property.updateOne(
          { _id: req.params.propertyId },
          {
            $set: data,
          }
        );
      }
    }
    res.json({
      result: "success",
    });
  } catch (err) {
    next(err);
  }
};
