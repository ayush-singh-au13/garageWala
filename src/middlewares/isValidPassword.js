const userModel = require('./../models/user.model');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
  try {
    const user = await userModel.findOne({email:req.body.email}).lean();

    if(_.isEmpty(user)) {
        return res.json({message:'User does not exist, please register !!!'})

    }
    req.user = {...user};
    const validPassword = bcrypt.compareSync(req.body.password,user.password)
    if(!validPassword) {
        return res.json({message:'/Invalid/ /Password/ !!'})
    }
    next();
  }catch(err){
    return res.status(500).json({status: 500, message: httpStatus['500_NAME']});
  }
}