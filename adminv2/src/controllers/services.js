import Service from "../../../shared/models/service.js";
import { sendResponse } from "../../../shared/utils/helper.js";


export const getServices = async (req, res) => {
    const services  = await Service.find({})
        if(services) sendResponse(res, 200, "Services Fetched SucccessFully", {services});
};