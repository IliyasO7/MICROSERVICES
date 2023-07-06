import Admin from "../../../shared/models/admin.js";
import User from "../../../shared/models/user.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../../shared/utils/token.js";
import { generateOtp, sendResponse } from "../../../shared/utils/helper.js";

export const createSuperAdmin = async (req, res) => {

    const username = req.body.username;
    const role = req.body.role;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;

            let encryptedPassword = await bcrypt.hash(password, 10)
            let adminExists = await Admin.findOne({ email: email });

            if(adminExists){
                return sendResponse(res, 400, "Admin Already Exists");
            }

            const totalAdmins = await Admin.find({role:'HJ-SUPER-ADMIN'});
            let count = totalAdmins.length;
            console.log('total Admins',count);
            let currentAdminNo = count + 1;
           // let currentAdminNo =  1;
            const sku = `HJ-SUPER-ADMIN-${currentAdminNo}`;
           // const sku = `HJ-RENTAL-ADMIN-${currentAdminNo}`
      
            const saveUser = await Admin.create({ 
                adminId: sku,
                username: username,
                role:`HJ-SUPER-ADMIN`,
                fname:fname,
                lname:lname,
                email:email,
                password:encryptedPassword,

            })
        if(saveUser) sendResponse(res, 200, "Super Admin Created Successfully", {saveUser});
        
};

export const createOdsAdmin = async (req, res) => {

    const superAdmin = req.user;
    const username = req.body.username;
    const role = req.body.role;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;

            let encryptedPassword = await bcrypt.hash(password, 10)
            let adminExists = await Admin.findOne({ email: email });

            if(adminExists){
                return sendResponse(res, 400, "Admin Already Exists");
            }

            const totalAdmins = await Admin.find({role:'HJ-ODS-ADMIN'});
            let count = totalAdmins.length;
            console.log('total Admins',count);
            let currentAdminNo = count + 1;
           // let currentAdminNo =  1;
            const sku = `HJ-ODS-ADMIN-${currentAdminNo}`;

            const saveUser = await Admin.create({ 
                adminId: sku,
                username: username,
                role:role,
                fname:fname,
                lname:lname,
                email:email,
                password:encryptedPassword,
                createdBy:superAdmin._id,

            })
        if(saveUser) sendResponse(res, 200, "Ods Admin Created Successfully", {saveUser});
        
};


export const createRentalAdmin = async (req, res) => {

    const superAdmin = req.user;
    const username = req.body.username;
    const role = req.body.role;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;

            let encryptedPassword = await bcrypt.hash(password, 10)
            let adminExists = await Admin.findOne({ email: email });

            if(adminExists){
                return sendResponse(res, 400, "Admin Already Exists");
            }
            const totalAdmins = await Admin.find({role:'HJ-RENTAL-ADMIN'});
            let count = totalAdmins.length;
            console.log('total Admins',count);
            let currentAdminNo = count + 1;
           // let currentAdminNo =  1;
            const sku = `HJ-RENTAL-ADMIN-${currentAdminNo}`
           // const sku = `HJ-RENTAL-ADMIN-${currentAdminNo}`
            const saveUser = await Admin.create({ 
                adminId: sku,
                username: username,
                role:`HJ-RENTAL-ADMIN`,
                fname:fname,
                lname:lname,
                email:email,
                password:encryptedPassword,
                createdBy:superAdmin._id,

            })
        if(saveUser) sendResponse(res, 200, "Rental Admin Created Successfully", {saveUser});
        
};

export const loginAdmin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let adminData = await Admin.findOne({username:username})

    if(!adminData){
         return sendResponse(res, 400, "Admin Does Not Exists");
      }
     else{
        let verifyPassword = await bcrypt.compare(password, adminData.password)
        if(verifyPassword){
            const tokens = generateTokens({ userId: adminData._id });
            return sendResponse(res, 200, "Admin Login Successfully", {tokens,adminData});
        } 
     }     
};

