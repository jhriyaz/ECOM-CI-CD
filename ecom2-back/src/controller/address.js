const Address = require("../models/address");
const addressValidator = require("../validators/addressValidator")
const mongoose = require('mongoose')

exports.addAddress = (req, res) => {
  // #swagger.tags = ['Address']
  // #swagger.summary = 'Add Address'
  const { name, mobileNumber, state, city, zip, address } = req.body;
  const addressVali = addressValidator(name, mobileNumber, state, city, zip, address)

  const namePattern = /^[A-Za-z\s]+$/;
  const mobileNumberPattern = /^\d+$/;
  const zipCodePattern = /^\d{5}(-\d{4})?$/;
  const statePattern = /^[A-Za-z\s]+$/;
  const cityPattern = /^[A-Za-z\s]+$/;


  if (!addressVali.isError) {
    return res.status(404).json(error)
  }

  if (!namePattern.test(name)) {
    return res.status(400).json({ error: "Invalid name format" });
  }

  if (!statePattern.test(state)) {
    return res.status(400).json({ error: "Invalid state abbreviation format" });
  }

  if (!mobileNumberPattern.test(mobileNumber) || mobileNumber.length < 9 || mobileNumber.length > 15) {
    return res.status(400).json({ error: "Invalid mobile number format or length" });
  }

  if (!zipCodePattern.test(zip)) {
    return res.status(400).json({ error: "Invalid zip code format" });
  }

  if (!cityPattern.test(city)) {
    return res.status(400).json({ error: "Invalid city format" });
  }

  let _address = new Address({
    name,
    mobileNumber,
    state,
    city,
    zip,
    address,
    user: req.user._id
  })

  _address.save()
    .then(address => {
      res.status(201).json({ success: true, address })
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: "something went wrong" })
    })

};

exports.getAddress = (req, res) => {
  // #swagger.tags = ['Address']
  // #swagger.summary = 'Get Address'
  Address.find({ user: req.user._id })
    .exec((error, addresses) => {
      if (error) return res.status(400).json({ error });
      if (addresses) {
        res.status(200).json({ addresses });
      }
    });
};


exports.updateAddress = (req, res) => {
  // #swagger.tags = ['Address']
  // #swagger.summary = 'Update Address'
  const { name, mobileNumber, state, city, zip, address } = req.body;
  const addressId = req.params.addressid
  if (!mongoose.isValidObjectId(addressId)) {
    return res.status(400).json({ error: "invalid address id" })
  }

  const namePattern = /^[A-Za-z\s]+$/;
  const mobileNumberPattern = /^\d+$/;
  const zipCodePattern = /^\d{5}(-\d{4})?$/;
  const statePattern = /^[A-Za-z\s]+$/;
  const cityPattern = /^[A-Za-z\s]+$/;

  const addressVali = addressValidator(name, mobileNumber, state, city, zip, address)

  if (!addressVali.isError) {
    return res.status(404).json(error)
  }

  if (!namePattern.test(name)) {
    return res.status(400).json({ error: "Invalid name format" });
  }

  if (!statePattern.test(state)) {
    return res.status(400).json({ error: "Invalid state abbreviation format" });
  }

  if (!mobileNumberPattern.test(mobileNumber) || mobileNumber.length < 9 || mobileNumber.length > 15) {
    return res.status(400).json({ error: "Invalid mobile number format or length" });
  }

  if (!zipCodePattern.test(zip)) {
    return res.status(400).json({ error: "Invalid zip code format" });
  }

  if (!cityPattern.test(city)) {
    return res.status(400).json({ error: "Invalid city format" });
  }

  let newaddress = {
    name,
    mobileNumber,
    state,
    city,
    zip,
    address,
  }

  Address.findByIdAndUpdate(addressId, { $set: newaddress }, { new: true })
    .then(address => {
      res.status(200).json({ success: true, address })
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: "something went wrong" })
    })
}


exports.deleteAddress = (req, res) => {
  // #swagger.tags = ['Address']
  // #swagger.summary = 'Delete Address'
  const addressId = req.params.addressid

  if (!mongoose.isValidObjectId(addressId)) {
    return res.status(400).json({ error: "invalid address id" })
  }

  Address.findByIdAndDelete(addressId)
    .then(address => {
      res.status(200).json({ success: true })
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: "something went wrong" })
    })
}
