import asyncHandler from "express-async-handler";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isValidEmail, isValidPhoneNumber } from "../helpers/helpers.js";

// create Token Verify Middleware
const tokenVerify = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(400).json({ message: "Unauthorised" });
  }

  jwt.verify(
    accessToken,
    process.env.JWT_LOGIN_SECRET,
    asyncHandler(async (error, decode) => {
      if (error) {
        return res.status(400).json({ message: "Invalid Token" });
      }
      const  me = await Users.findOne({ index: decode.index }).select("-password");

      
     
      req.me = me;
      next();
    })
  );
};

export default tokenVerify;

