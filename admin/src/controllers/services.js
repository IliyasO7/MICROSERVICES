import Service from "../../../shared/models/service.js";

export const getServices = async (req, res) => {

    const services  = await Service.find({})
        if(services) sendResponse(res, 200, "Services Fetched SucccessFully", {services});
        
};