const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const registerValidator = require('../validators/registerValidator')
const loginValidator = require('../validators/loginValidator')
const validator = require('validator');
const { OAuth2Client } = require("google-auth-library");
const { sendEmail } = require('../common-middleware/sendEmail');
const { sendDynamicEmail, sendSendgridEmail } = require("../common-middleware/SendSendGridEmail");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generateJwtToken = (_id, role, email) => {
  return jwt.sign({ _id, role, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};


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




//----------------------------------------------------------------------------------------------------------------------------------
exports.signup = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'User signup'
  const { email, name, password } = req.body
  const register = registerValidator(name, email, password)

  if (!register.isError) {
    return res.status(404).json(error)
  }



  User.findOne({ email }).exec(async (error, user) => {

    //if user exists and opt is verified return
    if (user && user.otp.isVerified) {
      return res.status(400).json({ message: "User already registered" })
    }

    let otpCode = generateOTP()
    const otp_token = jwt.sign({ otp: otpCode, email }, process.env.OTP_SECRET, {
      expiresIn: '5m',
    });
    let otp = {
      token: otp_token,
      isVerified: false
    }



    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      name,
      email,
      hash_password,
      otp
    });

    let text = `Your verification code is ${otpCode} will expire within 5 minutes`



    sendSendgridEmail(email, 'Ecom verification', text)
      .then(data => {
        //if user exists and opt is not verified, send otp again and return return
        if (!data.success) return
        if (user && !user.otp.isVerified) {
          user.updateOne({ $set: { otp } })
            .then(updated => {
              res.status(200).json({ isOtpSend: true, email: user.email })
            })
            .catch(err => {
              return res.status(400).json({ error: 'Something went wrong' })
            })
        } else {
          _user.save((error, user) => {
            if (error) { return res.status(400).json({ message: "Something went wrong" }) }

            if (user) {
              res.status(200).json({ isOtpSend: true, email: user.email })
              // const token = generateJwtToken(user._id, user.role);
              // const { _id, name, mobile, role } = user;
              // return res.status(201).json({
              //   token: `Bearer ${token}`,
              //   user: { _id, name, mobile, role },
              // });
            }
          });
        }
      })
      .catch(err => {
        return res.status(400).json({ message: 'SMTP server error' })
      })

  });
};

//------------------------------------------------------------------------------------------------------------------

exports.verifyOTP = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Verify OTP'
  let { otp, email } = req.body

  if (!otp) {
    return res.status(400).json({ error: "OTP is required" })
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        jwt.verify(user.otp.token, process.env.OTP_SECRET, function (err, decoded) {
          if (err) {
            return res.status(401).json({ message: "OTP expired" });
          }

          let updatedInfo = {

            token: "",
            isVerified: true

          }


          if (decoded.otp === otp) {
            User.findByIdAndUpdate(user._id, { $set: { otp: updatedInfo } }, { new: true })
              .select("-hash_password")
              .then((updatedUser) => {
                const token = generateJwtToken(updatedUser._id, updatedUser.role, updatedUser.email)

                return res.status(200).json({ success: true, token: `Bearer ${token}` });
              });

          } else {
            return res.status(401).json({ message: "Invalid OTP" });
          }


        });
      }
    })

}


//------------------------------------------------------------------------------------------------------------------

exports.resendOTP = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Resend OTP'
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: "email is required" })
  }

  let otpCode = generateOTP()
  const otp_token = jwt.sign({ otp: otpCode, email }, process.env.OTP_SECRET, {
    expiresIn: "5m",
  });

  let updatedInfo = {

    token: otp_token,
    isVerified: false

  }
  let text = `Your reset verification code is ${otpCode} will expire within 5 minutes`

  sendSendgridEmail(email, 'Ecom verification', text)
    .then(data => {
      if (!data.success) return
      User.findOneAndUpdate({ email }, { $set: { otp: updatedInfo } }, { new: true })
        .then(userUpdated => {
          res.status(200).json({
            isOtpSend: true,
          })
        })
        .catch(err => {
          return res.status(400).json({ error: 'SMTP server error' })
        })
    })
    .catch(err => {
      return res.status(400).json({ message: 'Something went wrong' })
    })

}



//--------------------------------------------------------------------------------------------------------------------------------
exports.signin = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'user signin'
  const { email, password } = req.body
  const login = loginValidator(email, password)

  if (!login.isError) {
    return res.status(404).json(error)
  }

  User.findOne({ email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user && user.otp.isVerified) {

      if (!user.isActive) {
        return res.status(400).json({ message: "You are temporarily banned" });
      }

      const isPassword = await user.authenticate(req.body.password);
      if (isPassword) {

        const token = generateJwtToken(user._id, user.role, user.email);
        res.status(200).json({
          token: `Bearer ${token}`,
        });
      } else {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  });
};

//----------------------------------------------------------------------------------------------------------------------------------

exports.googleAuth = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Google auth'
  if (!req.body.tokenId) {
    return res.status(400).json({ error: "Token is not sent" })
  }
  client
    .verifyIdToken({
      idToken: req.body.tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .then(response => {
      let email = response.payload.email
      User.findOne({ email })
        .then(user => {
          if (user) {
            if (!user.isActive) {
              return res.status(400).json({ message: "You are temporarily banned" });
            }
            const token = generateJwtToken(user._id, user.role, user.email);
            res.status(200).json({
              token: `Bearer ${token}`,
              requiredPassword: false
            });
          } else {
            res.status(200).json({ tokenId: req.body.tokenId, requiredPassword: true })
          }
        })
    })
}


//-------------------------------------------------------------------------------------------------------------------------------
exports.setPassAndCreateUser = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Confirm token and set password'
  const { tokenId, password, confirmPassword } = req.body
  if (!tokenId) {
    return res.status(400).json({ message: "Token is is not send" })
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be six character long" })
  }
  if (!confirmPassword) {
    return res.status(400).json({ message: "Confirm password is required" })
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Confirm password didn't matched" })
  }

  client
    .verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .then(async response => {
      let otp = {
        token: "",
        isVerified: true
      }
      const hash_password = await bcrypt.hash(password, 10);
      const _user = new User({
        name: response.payload.name,
        email: response.payload.email,
        profilePicture: response.payload.picture,
        hash_password: hash_password,
        otp: otp
      })

      _user.save()
        .then(newuser => {
          const token = generateJwtToken(newuser._id, newuser.role, newuser.email);
          res.status(200).json({
            token: `Bearer ${token}`,
          });
        })
    })
    .catch(err => {
      console.error("Token Verification Error:", err);
      return res.status(400).json({ error: "Invalid credentials" })
    })

}
//-------------------------------------------------------------------------------------------------------------------------------
exports.verify = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Verify user'
  // #swagger.description = 'set bearer token in header'

  if (req.headers) {
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {

      if (err) {
        //console.log(err);
        return res.status(401).json({ error: "token expired or invalid" });
      }

      //if (user.approval.isApproved === false) return res.status(400).json({ error:"Your account is not approved yet" });
      User.findById(user._id)
        .select("-hash_password")
        .then((user) => {
          if (!user.isActive) {
            return res.status(400).json({ error: "You are temporarily banned" });
          }
          return res.status(200).json({ success: true, user });
        });
    });
  } else {
    return res.status(401).json({ error: "Authorization required" });
  }
};

//---------------------------------------------------------------------------------------------------------------------------------
exports.updateProfile = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Update profile'
  const { mobile, name, contactNumber, gender, birthDate } = req.body

  let data = {

  }
  if (contactNumber) {
    data.contactNumber = contactNumber
  }
  if (gender) {
    data.gender = gender
  }
  if (birthDate) {
    data.birthDate = birthDate
  }
  if (mobile) {
    data.mobile = mobile
  }
  if (name) {
    data.name = name
  }

  if (!mobile && !name && !contactNumber && !gender && !birthDate) {
    return res.status(400).json({ error: "Noting to update" })
  }

  User.findByIdAndUpdate(req.user._id, { $set: data }, { new: true })
    .select("-hash_password")
    .then(user => {
      res.status(200).json({ success: true, user })
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: "Something went wrong" })
    })

}

exports.updateEmail = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Update email'
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: "Email is required" })
  }

  if (validator.isEmail(email) === false) {
    return res.status(400).json({ error: "Invalid email" })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.status(400).json({ error: "Email is taken ! select another" })
      }
      User.findByIdAndUpdate(req.user._id, { $set: { email } }, { new: true })
        .select("-hash_password")
        .then(user => {
          res.status(200).json({ success: true, user })
        })
        .catch(err => {
          console.log(err);
          res.status(400).json({ error: "Something went wrong" })
        })
    })
}

exports.updateImage = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Update image'
  const file = req.file
  if (!file) {
    return res.status(400).json({ error: "Plesae attach an image" })
  }

  if (file) {
    User.findByIdAndUpdate(
      req.user._id,
      { $set: { profilePicture: file.path } },
      { new: true }
    )
      .select("-hash_password")
      .then((user) => {
        return res.status(200).json({
          success: true,
          user: user,
          message: "Image updated successfully",
        });
      })
      .catch((err) => {
        res.status(400).json({ error: "Something went wrong" });
      });
  }
}


exports.changePassword = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Change password'
  const { currentPassword, newPassword, confirmPassword } = req.body
  if (!currentPassword) {
    return res.status(400).json({ error: 'please provide current password' })
  }
  if (!newPassword) {
    return res.status(400).json({ error: 'please provide new password' })
  } else if (newPassword.length < 6) {
    return res.status(400).json({ error: 'password should not be less then six letter' })
  }

  if (!confirmPassword) {
    return res.status(400).json({ error: 'please provide confirm password' })
  } else if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'confirm password did not matched' })
  }

  User.findById(req.user._id)
    .then(user => {
      bcrypt.compare(currentPassword, user.hash_password, (err, result) => {
        if (err) {
          return res.status(400).json({ error: 'something went wrong, try again' })
        }
        if (!result) {
          return res.status(400).json({ error: 'Password invalid' })
        }



        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, (err, hash) => {

            User.findByIdAndUpdate(user._id, { $set: { hash_password: hash } }, { new: true })
              .then(newuser => {
                res.status(200).json({ message: "password changed successfuly" })
              })

          })
        })


      })
    })

}




//--------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------
exports.forgotPassword = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Forgot password'
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }


  User.findOne({ email: email }).exec(async (error, user) => {

    if (!user) {
      return res.status(400).json({ error: "User not found with this Email" });
    }


    let otpCode = generateOTP()
    const otp_token = jwt.sign({ otp: otpCode, email }, process.env.EMAIL_SECRET, {
      expiresIn: '1h',
    });

    let password_reset_token = otp_token

    let templateId = "d-d4fd93762d164646be8abc8be0e75789"
    let dynamicTemplateData = {
      subject: 'Ts4u password reset',
      code: otpCode
    }

    sendDynamicEmail(email, templateId, dynamicTemplateData)
      .then(data => {

        user.updateOne({ $set: { password_reset_token } })
          .then(updated => {
            res.status(200).json({ isOtpSend: true, email })
          })
          .catch(err => {
            return res.status(400).json({ error: 'Something went wrong' })
          })
      })
      .catch(err => {
        return res.status(400).json({ error: 'Email server error' })
      })

  });
}


//-----------------------------------------------------------------------------------------------------------------------------------

exports.resetPassword = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Reset password'
  let { email, otp, password } = req.body

  if (!email || !otp || !password) {
    return res.status(400).json({ error: "Enter valid data" })
  }




  const hash_password = await bcrypt.hash(password, 10);


  User.findOne({ email })
    .then(user => {
      if (user) {
        jwt.verify(user.password_reset_token, process.env.EMAIL_SECRET, function (err, decoded) {
          if (err) {
            return res.status(401).json({ error: "OTP expired" });
          }

          if (decoded.otp === otp) {
            User.findByIdAndUpdate(user._id, { $set: { password_reset_token: "", hash_password } }, { new: true })
              .select("-hash_password")
              .then((updatedUser) => {
                return res.status(200).json({ success: true });
              });

          } else {
            return res.status(401).json({ error: "Invalid OTP" });
          }


        });
      }
    })

}









