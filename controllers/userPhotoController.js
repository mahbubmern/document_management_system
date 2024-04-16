import asyncHandler from "express-async-handler";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import { fileUploadToCloud } from "../utils/cloudinary.js";

/**
 * @description : update user Pass
 * @method : PUT/PATCH
 * @access : public
 * @route : '/api/v1/userpass'
 */
export const updateUserPhoto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // check user exists
  const ExistsUSer = await Users.findOne({ _id: id });

  if (!ExistsUSer) {
    return res.status(400).json({
      message: "User Not Exists",
    });
  }

  //  check file exist



   let photoFile = null;
   if (req.file) {
     const data = await fileUploadToCloud(req.file.path);
     photoFile = data.secure_url;
   }

  const changePhoto = await Users.findOneAndUpdate(
    { _id: ExistsUSer._id },
    { $set: { photo: photoFile } },
    { new: true }
  ).select("-password");

  res
    .status(200)
    .json({ userPhoto: changePhoto, message: "Photo Update Successful" });
});
