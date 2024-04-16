import asyncHandler from "express-async-handler";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateOTP,
  getPublicID,
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  tokenDecode,
} from "../helpers/helpers.js";
import { AccountVerifyMail } from "../mails/mail.js";
import { sendSMS } from "../mails/sendSMS.js";

//===========================================================

/**
 * @description : register user
 * @method : POST
 * @access : public
 * @route : '/api/v1/auth/register'
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { index, name, email, password } = req.body;

  //check all fields

  if (!index || !name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check valid Email

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid Email" });
  }

  // check password Requirements

  if (!isValidPassword(password)) {
    return res.status(400).json({ message: "Meet Password Requirement" });
  }

  const checkExistingUser = await Users.findOne({
    $or: [{ email: email }, { index: index }],
  });

  if (checkExistingUser) {
    return res.status(400).json({
      message:
        checkExistingUser.email == email
          ? "Email Already Exists"
          : "Index User Already Exists",
    });
  }

  // create OTP
  const otp = generateOTP();

  //======================================================================
  // code this line up is optimized by Chatgpt of above code

  //Hash Password
  const hashPassword = await bcrypt.hash(password, 10);

  const createdUser = await Users.create({
    index,
    name,
    email,
    password: hashPassword,
    accessToken: otp,
  });

  if (createdUser) {
    //send activationToken to cookie
    const activationToken = jwt.sign({ index }, process.env.JWT_SECRET, {
      expiresIn: "15min",
    });

    res.cookie("activationToken", activationToken);

    await AccountVerifyMail(email, { otp: otp, link: "" });
  }

  res
    .status(201)
    .json({ user: createdUser, message: "User registration Successful" });
});

//===========================================================

/**
 * @description : register user Activation
 * @method : POST
 * @access : public
 * @route : '/api/v1/auth/account-activate-by-otp/:token'
 */

// export const accountActivationByOTP = asyncHandler(async (req, res) => {
//   const { token } = req.params;
//   const { otp } = req.body;

//   const activationToken = tokenDecode(token);

//   //token verify
//   const tokenVerify = jwt.verify(activationToken, process.env.JWT_SECRET);

//   if (!tokenVerify) {
//     return res.status(400).json({ message: "Invalid Token" });
//   }

//   const currentTimeinMilisecond = Date.now();
//   const currentTimeinSecond = currentTimeinMilisecond / 1000;

//   if (currentTimeinSecond > tokenVerify.exp) {
//     return res
//       .status(400)
//       .json({ message: "Time Expired.Please Click to resend Activation Link" });
//   }

//   const activeuser = await Users.findOne({ index: tokenVerify.index });

//   if (!activeuser) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   //check OTP

//   if (otp != activeuser.accessToken) {
//     return res.status(400).json({ message: "Wrong OTP" });
//   }

//   const updateResult = await Users.findOneAndUpdate(
//     { _id: activeuser._id },
//     { $set: { isActivate: true, accessToken: null } },
//     { new: true }
//   );

//   if (!updateResult) {
//     return res.status(500).json({ message: "Failed to update user" });
//   }

//   //   //above code is optimize the line below code
//   //   //==============================================

//   //   // update accessToken
//   //   // activeuser.isActivate = true;
//   //   // activeuser.accessToken = null;
//   //   // activeuser.save();

//   //   //==============================================
//   //   //above code is optimize the line up code

//   res.clearCookie("activationToken");

//   res
//     .status(200)
//     .json({ user: registerUser, message: "Account Activation Successful" });
// });

export const accountActivationByOTP = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { otp } = req.body;

  const activationToken = tokenDecode(token);

  // Token verify
  let tokenVerify;
  try {
    tokenVerify = jwt.verify(activationToken, process.env.JWT_SECRET);
  } catch (error) {
    // Handle JWT expiration
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({
        message: "Time Expired. Please Click to resend Activation Link",
      });
    }
    return res.status(400).json({ message: "Invalid Token" });
  }

  const currentTimeinMilisecond = Date.now();
  const currentTimeinSecond = currentTimeinMilisecond / 1000;

  if (currentTimeinSecond > tokenVerify.exp) {
    return res.status(400).json({
      message: "Time Expired. Please Click to resend Activation Link",
    });
  }

  const activeuser = await Users.findOne({ index: tokenVerify.index });

  if (!activeuser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check OTP
  if (otp != activeuser.accessToken) {
    return res.status(400).json({ message: "Wrong OTP" });
  }

  const updateResult = await Users.findOneAndUpdate(
    { _id: activeuser._id },
    { $set: { isActivate: true, accessToken: null } },
    { new: true }
  );

  if (!updateResult) {
    return res.status(500).json({ message: "Failed to update user" });
  }

  // Clear activation token cookie
  res.clearCookie("activationToken");

  res
    .status(200)
    .json({ user: registerUser, message: "Account Activation Successful" });
});

//===========================================================

/**
 * @description : reset Password
 * @method : POST
 * @access : public
 * @route : '/api/v1/auth/reset-password/'
 */

// export const accountPasswordReset = asyncHandler(async (req, res) => {
//   const { auth, newPassword, confirmPassword } = req.body;

//   // console.log(auth, newPassword, confirmPassword );
//   if (!auth || !newPassword || !confirmPassword) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   let authEmail = null;
//   let authPhone = null;

//   if (isValidEmail(auth)) {
//     authEmail = auth;
//   } else if (isValidPhoneNumber(auth)) {
//     authPhone = auth;
//   } else {
//     return res.status(400).json({ message: "Invalid Email or Phone" });
//   }

//   if (authEmail) {
//     const matchUser = await Users.findOne({ email: authEmail });
//     if (!matchUser) {
//       return res.status(400).json({ message: "User Not Found" });
//     }
//     if (newPassword != confirmPassword) {
//       return res.status(400).json({ message: "Password MisMatch" });
//     }

//     //Hash Password
//     const hashPassword = await bcrypt.hash(confirmPassword, 10);
//     //password update
//     await Users.findOneAndUpdate(
//       { _id: matchUser._id },
//       { $set: { password: hashPassword } },
//       { new: true }
//     );

//     res
//       .status(200)
//       .json({ user: matchUser, message: "Password Update Successful" });
//   }
// });

// export const accountPasswordReset = asyncHandler(async (req, res) => {
//   const { auth, newPassword, confirmPassword } = req.body;

//   if (!auth || !newPassword || !confirmPassword) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   let authIdentifier = null;

//   if (isValidEmail(auth)) {
//     authIdentifier = { email: auth };
//   } else if (isValidPhoneNumber(auth)) {
//     authIdentifier = { phone: auth };
//   } else {
//     return res.status(400).json({ message: "Invalid Email or Phone" });
//   }

//   try {
//     const matchUser = await Users.findOne(authIdentifier);

//     if (!matchUser) {
//       return res.status(400).json({ message: "User Not Found" });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "Password Mismatch" });
//     }

//     // Hash Password and Update
//     const hashPassword = await bcrypt.hash(confirmPassword, 10);
//     const updatedUser = await Users.findOneAndUpdate(
//       authIdentifier,
//       { $set: { password: hashPassword } },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(400).json({ message: "User Not Found" });
//     }

//     res
//       .status(200)
//       .json({ user: updatedUser, message: "Password Update Successful" });
//   } catch (error) {
//     // Handle database errors or other exceptions
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

//===================================================

//===================================================

/**
 * @description : Login User
 * @method : POST
 * @access : public
 * @route : '/api/v1/auth/login'
 */

export const login = asyncHandler(async (req, res) => {
  const { index, password } = req.body;

  if (!index || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const checkIndexUser = await Users.findOne({ index });
  // const  me = await Users.findOne({ index: decode.index }).select("-password");

  if (!checkIndexUser) {
    return res.status(400).json({ message: "User Not found" });
  }
  if (!checkIndexUser.isActivate) {
    return res.status(400).json({ message: "Please Account Activate First" });
  }
  if (!checkIndexUser.status) {
    return res.status(400).json({ message: "Your Account has been Blocked" });
  }
  //password check
  const checkPassword = await bcrypt.compare(password, checkIndexUser.password);

  if (!checkPassword) {
    return res.status(400).json({ message: "Wrong password" });
  }

  const user = await Users.findOne({ index })
    .select("-password")
    .select("-email")
    .select("-index")
    .select("-isAdmin");

  //create login token

  const accessToken = jwt.sign({ index }, process.env.JWT_LOGIN_SECRET, {
    expiresIn: "365d",
  });

  //set token to cookie

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.APP_ENV == "Development" ? false : true,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  res.status(200).json({
    user: user,
    message: "Login Successful",
  });
});
//===================================================

//===================================================

//===========================================================
/**
 * @description : get User Profile
 * @method : get
 * @access : private
 * @route : '/api/v1/auth/me'
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.me) {
    return res.status(400).json({ message: "User Data Not Found" });
  }
  console.log(req.me);
  res
    .status(200)
    .json({ profile: req.me, message: "Get User Profile Successful" });
});

/**
 * @description : user forgotPassword
 * @method : POST
 * @access : public
 * @route : '/api/v1/auth/forgot-password/:token'
 */

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please Input User email" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid Email" });
  }

  //check User
  const checkUser = await Users.findOne({ email });

  if (!checkUser) {
    return res.status(400).json({ message: "User Not Found" });
  }

  //otp generate
  const otp = generateOTP();

  // otp to database

  const updateOTP = await Users.findOneAndUpdate({
    _id: checkUser.id,
    accessToken: otp,
  });

  if (!updateOTP) {
    return res.status(400).json({ message: "Update Failed" });
  }
  //send activationToken to cookie
  const activationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "15min",
  });

  res.cookie("activationToken", activationToken);

  await AccountVerifyMail(email, { otp: otp, link: "" });

  res
    .status(200)
    .json({ user: checkUser, message: "OTP Send To Registered Email" });
});

//===========================================================

/**
 * @description : forgot Password By Otp
 * @method : POST
 * @access : public
 * @route : '/api/v1/auth/forgot-password-by-otp/:token'
 */

export const forgotPasswordByOtp = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { otp, password } = req.body;

  const activationToken = tokenDecode(token);

  //token verify
  const tokenVerify = jwt.verify(activationToken, process.env.JWT_SECRET);

  if (!tokenVerify) {
    return res.status(400).json({ message: "Invalid Token" });
  }
  const activeUser = await Users.findOne({ email: tokenVerify.email });

  //check OTP

  if (otp != activeUser.accessToken) {
    return res.status(400).json({ message: "Wrong OTP" });
  }

  //passwor check
  if (!isValidPassword(password)) {
    return res.status(400).json({ message: "Meet Password Requirements" });
  }

  //hash Password
  const hashPassword = await bcrypt.hash(password, 10);

  // update accessToken

  const updateResult = await Users.findOneAndUpdate(
    { _id: activeUser._id },
    { $set: { passwprd: hashPassword, accessToken: null } },
    { new: true }
  );

  if (!updateResult) {
    return res.status(400).json({ message: "Update Failed" });
  }

  res.clearCookie("activationToken");

  res
    .status(200)
    .json({ user: registerUser, message: "Password Update Successful" });
});

//===========================================================
/**
 * @description : resend Activation Link
 * @method : POST
 * @access : public
 * @route : '/api/v1/auth/forgot-password-by-otp/:token'
 */

export const newActivationOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please Input User email" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid Email" });
  }

  //check User
  const checkUser = await Users.findOne({ email });

  if (!checkUser) {
    return res.status(400).json({ message: "User Not Found" });
  }

  //otp generate
  const otp = generateOTP();

  // otp to database

  const updateOTP = await Users.findOneAndUpdate({
    _id: checkUser._id,
    accessToken: otp,
  });

  if (!updateOTP) {
    return res.status(400).json({ message: "Update Failed" });
  }

  const index = updateOTP.index;

  //send activationToken to cookie
  const activationToken = jwt.sign({ index }, process.env.JWT_SECRET, {
    expiresIn: "15min",
  });

  res.cookie("activationToken", activationToken);

  await AccountVerifyMail(email, { otp: otp, link: "" });

  res
    .status(200)
    .json({ message: "Check Your Email for Account Activation OTP" });

  // redirect to accountActivationByOTP.....
});

//===========================================================
/**
 * @description :  User logout
 * @method : post
 * @access : private
 * @route : '/api/v1/auth/logout'
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    path: "/", // Ensure the path matches the one used when setting the cookie
    sameSite: "strict", // Ensure sameSite attribute matches the one used when setting the cookie
    secure: process.env.APP_ENV === "Development" ? false : true,
  });

  res.status(200).json({ message: "Logout Successful" });
});
