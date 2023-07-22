import Admin from "../../../shared/models/admin.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../../shared/utils/token.js";
import { sendResponse } from "../../../shared/utils/helper.js";



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


