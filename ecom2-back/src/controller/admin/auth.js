const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const registerValidator = require('../../validators/registerValidator')
const loginValidator = require('../../validators/loginValidator')

const generateOTP = () => {

  // Declare a digits variable  
  // which stores all digits 
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

function csms_id() {

  // Declare a digits variable  
  // which stores all digits 
  var digits = '0123456789';
  let csms_id = '';
  for (let i = 0; i < 8; i++) {
    csms_id += digits[Math.floor(Math.random() * 10)];
  }
  return csms_id;
}
//----------------------------------------------------------------------------------------------------------------------------------
exports.signup = async (req, res) => {
  const { email, name, password } = req.body
  let adminCount = await User.countDocuments({ role: "super-admin" }).exec()

  if (adminCount === 1) {
    return res.status(400).json({ message: "Admin can be created once!" })
  } else {
    const register = registerValidator(name, email, password)

    if (!register.isError) {
      return res.status(404).json(error)
    }

    User.findOne({ email }).exec(async (error, user) => {
      if (user)
        return res.status(400).json({
          message: "User already registered with this number",
        });

      // let otpCode = generateOTP()
      //     const otp_token =  jwt.sign({ OTP: otpCode, mobile: mobile }, process.env.OTP_SECRET, {
      //       expiresIn: 300,
      //     });


      const hash_password = await bcrypt.hash(password, 10);
      const _user = new User({
        name,
        email,
        hash_password,
        otp: {
          token: "",
          isVerified: true
        },
        role: "super-admin"
      });

      //let text = `Your DCEL verification code is ${otpCode} will expire within 5 minutes`


      _user.save((error, user) => {
        if (error) {
          console.log(error)
          return res.status(400).json({
            message: "Something went wrong",
          });
        }
        if (user) {
          return res.status(201).json({ message: "Admin created Successfully..!" });
        }

        // if (user) {
        //   const token = generateJwtToken(user._id, user.role);
        //   const { _id, name, mobile, role } = user;
        //   return res.status(201).json({
        //     token: `Bearer ${token}`,
        //     user: { _id, name, mobile, role },
        //   });
        // }
      });
    });


  }

};

exports.signin = (req, res) => {

  const { email, password } = req.body
  const login = loginValidator(email, password)


  if (!login.isError) {
    return res.status(404).json(error)
  }


  User.findOne({ email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (!isPassword) {
        return res.status(400).json({ password: "Invalid Password" });
      } else if (user.role === "super-admin" || user.role === "admin" ) {
        const token = jwt.sign(
          { _id: user._id, role: user.role, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        //res.cookie("token", token, { expiresIn: "1d" });
        res.status(200).json({
          token: `Bearer ${token}`,
          user: user._id, role: user.role, email: user.email
        });
      } else {
        return res.status(400).json({ message: "Access denied" });

      }
    } else {
      console.log(error);
      return res.status(400).json({ message: "User not found" });
    }
  });
};


