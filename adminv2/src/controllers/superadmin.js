import Admin from "../../../shared/models/admin.js";
import bcrypt from "bcrypt";

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
