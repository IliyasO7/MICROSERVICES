import Inventory from "../../../shared/models/inventory.js";
import User from "../../../shared/models/user.js";
import { sendResponse } from "../../../shared/utils/helper.js";
import dayjs from 'dayjs';






export const saveInventory = async (req, res) => {

    const userId = req.params.ownerId;
    const propertyName = req.body.propertyName;
    const address= req.body.address;
    const floor= req.body.floor;
    const door= req.body.door;
    const bhk= req.body.bhk;
    const carpetArea= req.body.carpetArea;
    const geolocation= req.body.geolocation;
    const rent=req.body.rent;
    const securityDeposit= req.body.securityDeposit;
    const adminData = req.user;
  
  
  
    const totalInventory = await Inventory.countDocuments({});
    console.log('total Inventory',totalInventory);
    let currentPropertyNo = totalInventory + 1;
    const sku = `HJR${currentPropertyNo}`
    console.log('SKU',sku);
  
          const createInventory = await Inventory.create({
            inventoryId: sku,
            user:userId,
            propertyName: req.body.propertyName,
            address: req.body.address,
            floor: req.body.floor,
            bhk:req.body.bhk,
            door:req.body.door,
            carpetArea: req.body.carpetArea,
            geolocation: req.body.geolocation,
            rent:req.body.rent,
            securityDeposit: req.body.securityDeposit,
            createdBy:adminData._id,
  
        })
  
    sendResponse(res, 200, "Inventory Saved Successful", {createInventory});
  };




  //Get Admin Inventory Details
  export const getInventoryDetails = async (req, res) => {
    const userId = req.user;
         let allInventories = await Inventory.find({ createdBy :userId }).populate('user')
         return sendResponse(res, 200, "Inventories Fetched Successfully", { allInventories });
  };



 //Get Owner Inventory With Mobile No
export const getOwnerInventory = async (req, res) => {
    const userId = req.user;
    let user = await User.findOne({ mobile: req.params.mobile });
  
         let allInventoriesData = await Inventory.find({ user:user }).populate('user')
         return sendResponse(res, 200, "All Owner Inventories Fetched Successfully", { allInventoriesData });
  };



//GET Inventory Details With Inventory ID
export const getInventorywithId = async (req, res) => {
    const userId = req.user;
         let inventory = await Inventory.find({ inventoryId : req.params.inventoryId }).populate('user');
         return sendResponse(res, 200, "Inventory Data Fetched Successfully", { inventory });
  };


//GET Inventory Details
export const getAllInventoryDetails = async (req, res) => {
    const userId = req.user;
         let allInventoriesData = await Inventory.find({}).populate('user')
         return sendResponse(res, 200, "All Inventories Fetched Successfully", { allInventoriesData });
  };


  export const updateArrayPropertyImages = async (req, res, next) => {
    try {
      console.log("UPDATING OWNER IMAGES");
      let inventory = await Inventory.findOne({ _id:req.params.inventoryId }).lean()

      if(!inventory){
        return sendResponse(res, 400, "Inventory Does Not Exist");
      }
      let data = {
        mainImage: [],
        entranceImage: [],
        kitchenImage: [],
        livingImage:[],
        bedroomImage:[]
        //serviceAgreementUpload: undefined,
      }


      console.log('MAIN IMAGE',req.files.mainImage);
    if(req.files.mainImage){
      console.log('here');
      for(let i=0;i<req.files.mainImage.length;i++){

        const options = {
          method: 'PUT',
          url: `https://storage.bunnycdn.com/housejoy/owner/inventory/main/${inventory._id}-${req.files.mainImage[i].originalname}`,
          headers: {
          'AccessKey': process.env.BUNNYCDN_API_KEY,
          'content-type': 'multipart/form-data',
        },
        data:  fs.readFileSync(req.files.mainImage[i].path), 
      };
          const mainImages= await axios(options, function (error, response, body) {
                  if (error) throw new Error(error);
                  console.log(body);
                });   
          if(mainImages.status === 201){
            data.mainImage[i] = `https://housejoy.b-cdn.net/owner/inventory/main/${inventory._id}-${req.files.mainImage[i].originalname}`
      }
      await Inventory.updateOne({ _id: inventory._id }, {
        $set: data
      })
    }
  }


    if(req.files.entranceImage){
      for(let i=0;i<req.files.entranceImage.length;i++){
        const options = {
          method: 'PUT',
          url: `https://storage.bunnycdn.com/housejoy/owner/inventory/entrance/${inventory._id}-${req.files.entranceImage[i].originalname}`,
          headers: {
          'AccessKey': 'af1a5c9e-c720-4f55-b177cd11060e-86b0-47be',
          'content-type': 'multipart/form-data',
        },
        data:  fs.readFileSync(req.files.entranceImage[i].path), 
      };
          const entranceImages= await axios(options, function (error, response, body) {
                  if (error) throw new Error(error);
                  console.log(body);
                });   
          if(entranceImages.status === 201){
            data.entranceImage[i] = `https://housejoy.b-cdn.net/owner/inventory/entrance/${inventory._id}-${req.files.entranceImage[i].originalname}`
            
          }
          await Inventory.updateOne({ _id: inventory._id }, {
            $set: data
          })
        }
      }


      if(req.files.livingImage){
        for(let i=0;i<req.files.livingImage.length;i++){
          const options = {
            method: 'PUT',
            url: `https://storage.bunnycdn.com/housejoy/owner/inventory/living/${inventory._id}-${req.files.livingImage[i].originalname}`,
            headers: {
            'AccessKey':  process.env.BUNNYCDN_API_KEY,
            'content-type': 'multipart/form-data',
          },
          data:  fs.readFileSync(req.files.livingImage[i].path), 
        };
            const livingImages= await axios(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    console.log(body);
                  });   
            if(livingImages.status === 201){
              data.livingImage[i] = `https://housejoy.b-cdn.net/owner/inventory/living/${inventory._id}-${req.files.livingImage[i].originalname}`
            }
          await Inventory.updateOne({ _id: inventory._id },{
            $set: data
          })
        }
      }
      
        if(req.files.bedroomImage){
          for(let i=0;i<req.files.bedroomImage.length;i++){
            const options = {
              method: 'PUT',
              url: `https://storage.bunnycdn.com/housejoy/owner/inventory/bedroom/${inventory._id}-${req.files.bedroomImage[i].originalname}`,
              headers: {
              'AccessKey':  process.env.BUNNYCDN_API_KEY,
              'content-type': 'multipart/form-data',
            },
            data:  fs.readFileSync(req.files.bedroomImage[i].path), 
          };
              const bedroomImages= await axios(options, function (error, response, body) {
                      if (error) throw new Error(error);
                      console.log(body);
                    });   
              if(bedroomImages.status === 201){
                data.bedroomImage[i] = `https://housejoy.b-cdn.net/owner/inventory/bedroom/${inventory._id}-${req.files.bedroomImage[i].originalname}`
            }
            await Inventory.updateOne({ _id: inventory._id },{
              $set: data
            })
      }
   }
            
          if(req.files.kitchenImage){
            for(let i=0;i<req.files.kitchenImage.length;i++){
              const options = {
                method: 'PUT',
                url: `https://storage.bunnycdn.com/housejoy/owner/inventory/kitchen/${inventory._id}-${req.files.kitchenImage[i].originalname}`,
                headers: {
                'AccessKey':  process.env.BUNNYCDN_API_KEY,
                'content-type': 'multipart/form-data',
              },
              data:  fs.readFileSync(req.files.kitchenImage[i].path), 
            };
          
                const kitchenImages= await axios(options, function (error, response, body) {
                        if (error) throw new Error(error);
                        console.log(body);
                      });   
                if(kitchenImages.status === 201){
                  data.kitchenImage[i] = `https://housejoy.b-cdn.net/owner/inventory/kitchen/${inventory._id}-${req.files.kitchenImage[i].originalname}`
              }
                   
              await Inventory.updateOne({ _id: inventory._id }, {
                $set: data
              })
        } 
    }
      res.json({
        result: 'success'
      })
    } catch (err) {
      next(err)
    }
  }