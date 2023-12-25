const vehicleTypesModel = require("./../models/vehicleType.model");
const mongoose = require('mongoose');


module.exports = async (req, res, next) =>{
    try {
        const id = req.query.id;
        const data = await vehicleTypesModel.findOne({_id:mongoose.Types.ObjectId(id)}).lean();  
        req.body.data = data;
        next();
    }catch(err) {
        return res.status(500).send({status:500, message: "INTERNAL_SERVER_ERROR"});
    }

}