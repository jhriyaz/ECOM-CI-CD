const Category = require("../../models/category");
const Brand = require("../../models/brand");
const User = require('../../models/user')
const Product = require('../../models/product')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')


const adapter = new FileSync('db.json')
const db = low(adapter)


const adapterSecret = new FileSync('secretDb.json')
const secretDb = low(adapterSecret)


exports.paymentMethod = (req, res) => {
  const { paypal, cod ,venmo,cashApp,zelle} = req.body

  if (paypal) {
    db.set("payment.paypal", paypal)
      .write()
  }
  if (cod) {
    db.set("payment.cod", cod)
      .write()
  }
  if (venmo) {
    db.set("payment.venmo", venmo)
      .write()
  }
  if (cashApp) {
    db.set("payment.cashApp", cashApp)
      .write()
  }
  if (zelle) {
    db.set("payment.zelle", zelle)
      .write()
  }
  

  res.status(200).json({ success: true })

}


exports.getPaymentMethods = async (req, res) => {
  let value = await db.get("payment").value()
  res.status(200).json({ methods: value })

}


exports.getActivePaymentMethod = async (req, res) => {
  let value = await db.get("payment").value()
  //console.log(value);
  let result = []
  Object.keys(value).map((key, index) => {
    //console.log(key);
    if (value[key].isActive == true) {
      if(key === 'paypal'){
        result.push({ name: key, isActive: true,isSandbox:value[key].isSandbox  })
      }else[
        result.push({ name: key,...value[key] })
      ]
      
    }
  })

  res.status(200).json({ success: true, methods: result })
}


exports.saveSliders = async (req, res) => {
  const { sliders } = req.body

  if (sliders) {
    db.set("sliders", sliders)
      .write()
  }

  res.status(200).json({ success: true })
}


exports.getSliders = async (req, res) => {
  let value = await db.get("sliders").value()
  res.status(200).json({ sliders: value })
}


exports.saveAnalytics = async (req, res) => {
  const { ga, pixel } = req.body
  console.log(pixel);
  if (ga) {
    secretDb.set("analytics.ga", ga)
      .write()
  }
  if (pixel) {
    secretDb.set("analytics.pixel", pixel)
      .write()
  }

  res.status(200).json({ success: true })
}

exports.getAnalytics = async (req, res) => {
  let value = await secretDb.get("analytics").value()
  res.status(200).json({ analytics: value })

}

exports.getTotal = async (req, res) => {
  try {
    const products = await Product.countDocuments()
    const users = await User.countDocuments()
    const categories = await Category.countDocuments()
    const brands = await Brand.countDocuments()
    res.status(200).json({ products, users, categories, brands })
  } catch (error) {
    res.status(400).json({ error: "something went wrong" })
  }


}

exports.updateSMTP = async (req, res) => {
  const { smtp, settings } = req.body
  if (smtp) {
    secretDb.set("otp.clients.smtp", smtp)
      .write()
  }

  if (settings) {
    secretDb.set("otp.settings", settings)
      .write()
  }
  res.status(200).json({ success: true })
}


exports.getSMTP = async (req, res) => {
  let value = await secretDb.get("otp").value()
  res.status(200).json({ smtp: value })
}


exports.updateStorage = async (req, res) => {
  const { cloudinary } = req.body
  if (cloudinary) {
    secretDb.set("storage.cloudinary", cloudinary)
      .write()
  }
  res.status(200).json({ success: true })
}


exports.getStorage = async (req, res) => {
  let value = await secretDb.get("storage").value()
  res.status(200).json({ storage: value })

}

exports.updateLiveChat=async(req,res)=>{
  const { crisp } = req.body
  if (crisp) {
    secretDb.set("liveChat.crisp", crisp)
      .write()
  }
  res.status(200).json({ success: true })
}

exports.getLiveChat = async (req, res) => {
  let value = await secretDb.get("liveChat").value()
  res.status(200).json({ liveChat: value })

}


exports.initialData=async(req,res)=>{
  let analytics = await secretDb.get("analytics").value()
  let liveChat = await secretDb.get("liveChat").value()
  res.status(200).json({analytics,liveChat})
}