const User = require("../../models//user");



exports.getCustomers = async (req, res) => {
  const users = await User.find({})
    .exec();
  res.status(200).json({ users });
}

;
exports.updateCustomer = async (req, res) => {
  let id = req.params.userid
  let {isActive, role} = req.body
  const user = await User.findByIdAndUpdate(id,{$set:{isActive, role}},{new:true})
    .exec();
  res.status(200).json({ user });
};
