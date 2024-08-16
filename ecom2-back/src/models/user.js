const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    mobile:{
      type: String,
      default:""
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    contactNumber: { type: String },
    profilePicture: { type: String ,default:""},
    gender:{
      type:String,
      enum:["male","female","other"]
    },
    birthDate:{
      type:String,
     
    },
    otp:{
      token:{type:String,default:""},
      isVerified:{type:Boolean,default:false}
    },
    isActive:{
      type:Boolean,
      default:true
    },
    password_reset_token: {
      type: String,
      default:""
    },
  },
  { timestamps: true }
);


userSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};

module.exports = mongoose.model("User", userSchema);
