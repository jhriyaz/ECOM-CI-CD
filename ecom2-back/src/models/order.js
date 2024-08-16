const mongoose = require("mongoose");
// A
const orderSchema = new mongoose.Schema(
  {
    invoice:{
      type:String,
      index:true,
      require:true,
      unique:true,
      trim:true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount:{
      type: Number,
      default:0
    },
    tax:{
      type: Number,
      default: 0,
    },
    shipping:{
      type: Number,
      default: 0,
    },
    transactionId:{type:String,default:""},

    items: [
      {
        productId:{type: mongoose.Schema.Types.ObjectId,ref:"Product",require:true},
        thumbnail: {
          type: String,
          default: "",
        },
        productSlug: {
          type: String,
          default: "",
        },
        productName: {
          type: String,
          default: "",
        },
        payablePrice: {
          type: Number,
          required: true,
        },
        purchasedQty: {
          type: Number,
          required: true,
        },
        campaign:{type: mongoose.Schema.Types.ObjectId,ref:"Campaign"},
        variations: [],
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refundRequested", "refunded","cod","partial"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "paypal","venmo","cashApp","zelle"],
    },
    orderStatus:{
      type: String,
      enum: ["pending","processing" ,"packed", "shipped", "delivered","cancelled"],
      default: "pending",
    },
    orderHistories: [
      {
        type: {
          type: String,
          default: "pending",
        },
        date: {
          type: Date,
          default: Date.now
        },
        note: {
          type: String,
          default:"",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
