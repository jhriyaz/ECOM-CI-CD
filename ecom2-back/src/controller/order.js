const Order = require("../models/order");
const Product = require("../models/product");
const Address = require("../models/address");
const Campaign = require("../models/campaign");
const Notification = require("../models/notification");
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const moment = require('moment')
var paypal = require('paypal-rest-sdk');
const { sendEmail } = require('../common-middleware/sendEmail')
const adapter = new FileSync('db.json')
const { otp } = require('../../secretDb.json')
const { payment } = require('../../db.json');
const { isValidObjectId } = require("mongoose");

let otpsettings = otp.settings


paypal.configure({

  'mode': payment.paypal.isSandbox ? "sandbox" : "live", //sandbox or live
  'client_id': payment.paypal.clientId,
  'client_secret': payment.paypal.clientSecret
});







function generateInvoice(n) {
  var add = 1,
    max = 12 - add;

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically 
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
}


//-------------------------------------------------------------------------------------------------------------------

//this functions will compare the selected varions and product availabe variotions 
const arraysCompare = (a1, a2) => {
  if (a1.length !== a2.length) return false;
  const objectIteration = (object) => {
    const result = [];
    const objectReduce = (obj) => {
      for (let i in obj) {
        if (typeof obj[i] !== 'object') {
          result.push(`${i}${obj[i]}`);
        } else {
          objectReduce(obj[i]);
        }
      }
    };
    objectReduce(object);
    return result;
  };
  const reduceArray1 = a1.map(item => {
    if (typeof item !== 'object') return item;
    return objectIteration(item).join('');
  });
  const reduceArray2 = a2.map(item => {
    if (typeof item !== 'object') return item;
    return objectIteration(item).join('');
  });
  const compare = reduceArray1.map(item => reduceArray2.includes(item));
  if (compare.length === 1 && compare.includes(true)) {
    return true
  }
  return compare.reduce((acc, item) => acc + Number(item)) === a1.length;
};


//checking variable product stock
const checkStockForVariations = async (attributes, variations, product, prod) => {
  let attrArray = []
  Object.keys(attributes).map(key => {
    attrArray.push({ [key]: attributes[key] })
  })

  return Promise.all(variations.map(obj => {

    let array = []
    Object.keys(obj).map(key => {
      if (key === 'discount' || key === 'discountType' || key === 'image' || key === 'isDefault' || key === 'price' || key === 'stock' || key === 'varname') return
      array.push({ [key]: obj[key] })
    })

    if (arraysCompare(array, attrArray)) {
      if (parseInt(obj.stock) >= parseInt(product.purchasedQty)) {
        let newStock = parseInt(prod.stock) - product.purchasedQty
        let variationsarray = [...prod.variations]
        let index = variationsarray.findIndex(v => v.varname === obj.varname)
        variationsarray[index] = { ...variationsarray[index], stock: parseInt(obj.stock) - product.purchasedQty }
        let sales = prod.sales + product.purchasedQty
        return { message: "In stock", success: true, _id: prod._id }

      } else {
        return { message: "stock out", success: false, _id: prod._id }
      }
    }
  }))
}


//this function will check if the items has stock or not

const checkStock = async (products) => {

  return Promise.all(products.map(async (product) => {

    let prod = await Product.findOne({ slug: product.productSlug })
      .exec()
    //console.log(product);
    if (prod == null) {
      return { message: "product unavailable", success: false, _id: product.productId }
    }

    let opt = {
      _id: product.campaign,
      isActive: true,
      startAt: { "$lte": moment(Date.now()) },
      endAt: { "$gte": moment(Date.now()) }
    }

    //console.log(opt);
    if (product.campaign != null) {
      let camp = await Campaign.findOne(opt).exec()
      if (!camp) {
        return { message: "Campaign finished", success: false, _id: prod._id }
      }
    }



    let attributes = product.variations
    let variations = prod.variations
    let info

    if (attributes.length === 0 || variations.length === 0) {
      if (parseInt(prod.stock) >= parseInt(product.purchasedQty)) {

        return { message: "In stock", success: true, _id: prod._id }
      }
      else {
        return { message: "stock out", success: false, _id: prod._id }
      }

    } else {
      let checkForVariableProducts = await checkStockForVariations(attributes, variations, product, prod)
      info = checkForVariableProducts
    }

    return info

  }))


}



//this function will update the stock after completing the order
const updateStock = async (products) => {


  products.map(async (product) => {

    let prod = await Product.findOne({ slug: product.productSlug })
      .exec()

    let attributes = product.variations
    let variations = prod.variations
    let info

    if (attributes.length === 0 || variations.length === 0) {
      if (parseInt(prod.stock) >= parseInt(product.purchasedQty)) {
        let newStock = parseInt(prod.stock) - product.purchasedQty
        let sales = prod.sales + product.purchasedQty
        Product.findByIdAndUpdate(prod._id, { $set: { stock: newStock, sales } }, { new: true })
          .then(updated => {
            // console.log(updated);
            return { message: "stock out", success: false }
          })

        return { message: "In stock", success: true, _id: prod._id }
      }
      else {
        return { message: "stock out", success: false, _id: prod._id }

      }

    } else {
      let attrArray = []
      Object.keys(attributes).map(key => {
        attrArray.push({ [key]: attributes[key] })
      })

      variations.map(obj => {

        let array = []
        Object.keys(obj).map(key => {
          if (key === 'discount' || key === 'discountType' || key === 'image' || key === 'isDefault' || key === 'price' || key === 'stock' || key === 'varname') return
          array.push({ [key]: obj[key] })
        })

        if (arraysCompare(array, attrArray)) {
          if (parseInt(obj.stock) >= parseInt(product.purchasedQty)) {
            let newStock = parseInt(prod.stock) - product.purchasedQty
            let variationsarray = [...prod.variations]
            let index = variationsarray.findIndex(v => v.varname === obj.varname)
            variationsarray[index] = { ...variationsarray[index], stock: parseInt(obj.stock) - product.purchasedQty }
            let sales = prod.sales + product.purchasedQty
            Product.findByIdAndUpdate(
              prod._id,
              { $set: { variations: variationsarray, stock: newStock, sales } },
              { new: true }
            )
              .then(updated => {
                return
              })

          } else {
            return
          }
        }
      })
    }

    return

  })


}




exports.addOrder = async (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.summary = 'Create order'
  const { addressId, totalAmount, paidAmount, items, paymentStatus, paymentMethod, orderStatus, tax, shipping, transactionId } = req.body;

  if (!isValidObjectId(addressId)) {
    return res.status(400).json({ error: 'Give a valid addressId' })
  }

  if ((!addressId) || (!totalAmount && typeof totalAmount !== number)) {
    return res.status(400).json({ error: "Send addressId and totalAmount" })
  }

  if (!items || typeof items !== 'object') {
    return res.status(400).json({ error: "Send valid items fields with productId, payablePrice, purchasedQty" })
  }

  if (!paymentMethod) {
    if (paymentMethod !== "cod" || paymentMethod !== "paypal" || paymentMethod !== "cashApp" || paymentMethod !== "zelle") {
      return res.status(400).json({ error: "Accepted payment method is cod,paypal,cashApp and zelle" })
    }
  }

  let isOrderStatus = ["pending", "processing", "packed", "shipped", "delivered", "cancelled"].includes(orderStatus)

  let isPaymentMethod = ["cod", "paypal", "venmo", "cashApp", "zelle"].includes(paymentMethod)

  let isPaymentStatus = ["unpaid", "paid", "refundRequested", "refunded","cod","partial"].includes(paymentStatus)

  if (typeof totalAmount !== 'number') {
    return res.status(400).json({ error: 'totalAmount should be number' })
  }

  if (typeof tax !== 'number') {
    return res.status(400).json({ error: 'tax should be number' })
  }

  if (typeof shipping !== 'number') {
    return res.status(400).json({ error: 'shipping should be number' })
  }

  if (!isOrderStatus) {
    return res.status(400).json({ error: 'orderStatus must contain one value from this "pending","processing" ,"packed", "shipped", "delivered","cancelled" ' })
  }

  if (!isPaymentMethod) {
    return res.status(400).json({ error: 'paymentMethod must contain one value from this "cod", "paypal","venmo","cashApp","zelle" ' })
  }

  if (!isPaymentStatus) {
    return res.status(400).json({ error: 'paymentStatus must contain one value from this "unpaid", "paid", "refundRequested", "refunded","cod","partial" ' })
  }

  let orderData = {
    invoice: "TS-" + generateInvoice(9),
    user: req.user._id,
    addressId,
    totalAmount,
    items,
    paymentStatus: "unpaid",
    orderStatus: orderStatus || "pending",
    orderHistories: [{ type: "pending", note: "Your order placed successfully" }],
    tax: tax || 0,
    shipping: shipping || 0,
    transactionId,
    paymentMethod

  }
  if (paymentMethod === 'cod') {
    orderData.paymentMethod = 'cod'
    orderData.paymentStatus = 'cod'
    orderData.orderStatus = 'pending'
  }
  if (paymentMethod === 'venmo' || paymentMethod === 'cashApp' || paymentMethod === 'zelle') {
    orderData.orderHistories = [...orderData.orderHistories, { type: "pending", note: `${transactionId} is submitted for payment method ${paymentMethod}. Please wait for confirmation` }]
  }


  let _order = new Order(orderData)

  //check if the selected item have stock or nor
  let result;
  if (orderData?.items.length > 0) {
    result = await checkStock(orderData?.items)
  }

  //get flat array for returned promises get filter for valid promises
  let check = result.flat().filter(item => item !== undefined)
  //   console.log(check);
  // return

  //if any of the products are stock out this block will be imediately returned
  if (check.filter(c => c.success === false).length > 0) {
    res.status(404).json({ error: "Some of your products are stock out" })
    // console.log('if block');
  } else {
    // console.log('else block');
    _order.save()
      .then(async (order) => {
        res.status(201).json({ success: true, order })
        await Notification.insertNotification(req.user._id, "order", order.invoice, "Thanks for placing your order.Our customer care manager will contact you shortly")
        if (otpsettings.order) {
          await sendEmail(req.user.email, "Order", "Thanks for placing your order.Our customer care manager will contact you shortly")
        }
        updateStock(orderData.items)
      })
      .catch(err => {
        console.log(err);
        return res.status(400).json({ error: "Something went wrong" })
      })
  }

};


//-------------------------------------------------------------------------------------------------------------------------------

exports.checkCartProducts = async (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.summary = 'Check cart products'
  let { items } = req.body
  // console.log(items);
  //check if the selected item have stock or nor
  if (!items) {
    return res.status(400).json({ error: "Nothing to check" })
  }
  let result = await checkStock(items)

  //get flat array for returned promises get filter for valid promises

  try {
    let check = result.flat().filter(item => item !== undefined)
    //console.log(check);
    return res.status(200).json({ check })
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" })
  }
}


//-------------------------------------------------------------------------------------------------------------------------------
exports.getOrders = (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.summary = 'Get my orders'
  Order.find({ user: req.user._id })
    .sort("-createdAt")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};




//-------------------------------------------------------------------------------------------------------------------------------------
exports.payment = async (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.summary = 'Make payment'
  let { items, totalAmount } = req.body
  // console.log(items);
  //check if the selected item have stock or nor
  let result = await checkStock(items)
  let check = result.flat().filter(item => item !== undefined)

  if (check.filter(c => c.success === false).length > 0) {
    console.log(result)
    res.status(404).json({ error: "Some of your products are stock out" })
  } else {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
        "item_list": {
          "items": []
        },
        "amount": {
          "currency": "USD",
          "total": totalAmount
        },
      }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {

        //console.log(payment);
        res.json(
          {
            id: payment.id
          });
      }
    });
  }



}


//-------------------------------------------------------------------------------------------------------------------------------

exports.paymentSuccess = async (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.summary = 'Paypal hook'
  const { paymentID, payerID, items, totalAmount, addressId, shipping, tax } = req.body
  const create_payment_json = {
    payer_id: payerID,
    "transactions": [{
      "item_list": {
        "items": []
      },
      "amount": {
        "currency": "USD",
        "total": totalAmount
      },
      "description": "Hat for the best team ever"
    }]
  };
  paypal.payment.execute(paymentID, create_payment_json, (error, response) => {
    if (error) {
      return res.status(404).json({ error: "Something went wrong" })
    }

    if (response.failed_transactions.length === 0) {
      let orderData = {
        invoice: "TS-" + generateInvoice(9),
        user: req.user._id,
        addressId,
        totalAmount,
        paidAmount: totalAmount,
        items,
        paymentStatus: "paid",
        orderStatus: "processing",
        orderHistories: [{ type: "pending", note: "Your order placed successfully" }, { type: "processing", note: `${totalAmount} $ paid successfully by Paypal` }],
        tax: tax || 0,
        shipping: shipping || 0,
        transactionId: response.id,
        paymentMethod: "paypal"
      }
      let _order = new Order(orderData)
      _order.save()
        .then(async order => {
          res.status(201).json({ success: true })
          await Notification.insertNotification(req.user._id, "order", order.invoice, "Thanks for placing your order.Our customer care manager will contact you shortly")
          await Notification.insertNotification(req.user._id, "order", order.invoice, `${totalAmount} $ paid successfully by Paypal`)

          if (otpsettings.order) {
            await sendEmail(req.user.email, "Order", "Thanks for placing your order.Our customer care manager will contact you shortly")
          }
          if (otpsettings.payment) {
            await sendEmail(req.user.email, "Payment", `${totalAmount} $ paid successfully by Paypal`)
          }

          updateStock(orderData.items)
        })

    }
  })

}

//---------------------------------------------------------------------------------------------------------------------------------

exports.getOrderByInvoice = (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.summary = 'Order by invoice'
  Order.findOne({ invoice: req.params.invoice })
    .populate('addressId')
    .then(order => {
      res.status(200).json({ success: true, order })
    })
    .catch(err => {
      console.log(err);
    })
}

//-----------------------------------------------------------------------------------------------------------------------------------

exports.getAllOrders = (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.summary = 'Get all orders'
  Order.find()
    .populate('addressId')
    .populate('user', "name")
    .sort("-createdAt")
    .then(orders => {
      res.status(200).json({ success: true, orders })
    })
    .catch(err => {
      console.log(err);
    })

}

//------------------------------------------------------------------------------------------------------------------------------------

exports.updateOrder = (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.summary = 'Update orders'
  const invoice = req.params.invoice

  const { orderStatus, paymentStatus } = req.body
  let options = {}
  let orderHistories = []

  if (orderStatus) {
    options.orderStatus = orderStatus
    orderStatus === 'processing' && orderHistories.push({ note: "Order selected for processing", type: "processing" })
    orderStatus === 'shipped' && orderHistories.push({ note: "Your order has been shipped", type: "shipped" })
    orderStatus === 'delivered' && orderHistories.push({ note: "Your order has been delivered", type: "delivered" })
    orderStatus === 'cancelled' && orderHistories.push({ note: "Your order has been cancelled", type: "cancelled" })
    orderStatus === 'pending' && orderHistories.push({ note: "Your order has been marked as pending", type: "cancelled" })
  }
  if (paymentStatus) {
    options.paymentStatus = paymentStatus
    paymentStatus === 'paid' && orderHistories.push({ note: "Order as paid by admin", type: "processing" })
    paymentStatus === 'unpaid' && orderHistories.push({ note: "Order as unpaid by admin", type: "processing" })
  }

  Order.findOneAndUpdate({ invoice }, { $set: options, $push: { orderHistories: [...orderHistories] } }, { new: true })
    .populate('addressId')
    .populate('user', "mobile")
    .then(async order => {
      res.status(200).json({ success: true, order })
      if (paymentStatus) {
        if (otpsettings.payment && paymentStatus === 'paid') {
          sendEmail(order.user.email, "Payment", "Your order marked as paid by DCEL")
        }
      }
      if (orderStatus) {
        if (orderStatus === "delivered" && otpsettings.delivery) {
          await Notification.insertNotification(order.user._id, "order", order.invoice, "Your order has been delivered successfully. If you did't received your order yet please contact us")
          sendEmail(order.user.email, "Payment", "Your order has been delivered successfully. If you did't received your order yet please contact us")
        }
        if (orderStatus === "cancelled" && otpsettings.cancel) {
          await Notification.insertNotification(order.user._id, "order", order.invoice, "Your order has been Cancelled. If you did't received refund within 7 days please contact us")
          sendEmail(order.user.email, "Payment", "Your order has been Cancelled. If you did't received refund within 7 days please contact us")
        }
      }
    })
    .catch(err => {
      console.log(err);
    })
}

//---------------------------------------------------------------------------------------------------------------------------------------
exports.requestRefund = (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.summary = 'Request for refund'
  let { invoice, type } = req.body
  if (!invoice) {
    return res.status(400).json({ error: "Invoice not found" })
  }
  let orderHistories = { note: "User requested for refund", type }
  Order.findOneAndUpdate({ invoice, user: req.user._id }, { $set: { paymentStatus: "refundRequested" }, $push: { orderHistories } }, { new: true })
    .populate('addressId')
    .then(order => {
      res.status(200).json({ success: true, order })
    })
    .catch(err => {
      return res.status(400).json({ error: "Invoice not found" })
    })
}
