import asyncHandler from "express-async-handler";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import { isValidPhoneNumber } from "../helpers/helpers.js";

/**
 * @description : update user Personal Data
 * @method : PUT/PATCH
 * @access : public
 * @route : '/api/v1/userpersonal'
 */
export const updateUserPersonal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { division, department, phone, designation} = req.body;

  if (!division || !department || !designation) {
    return res.status(400).json({
      message: "All Fields are required",
    });
  }
  // check user exists
  const ExistsUSer = await Users.findOne({ _id: id });

  if (!ExistsUSer) {
    return res.status(400).json({
      message: "User Not Exists",
    });
  }
  //check valid Phone
  if (!isValidPhoneNumber(phone)) {
    return res.status(400).json({ message: "Invalid Phone No" });
  }


   const changePersonalDetails = await Users.findOneAndUpdate(
    { _id: ExistsUSer._id },
    { $set: { division:division, department:department, phone: phone, designation:designation } },
    { new: true }
  ).select('-password');


  res.status(200).json({ userPersonal: changePersonalDetails, message: "Information Update Successful" });
});

/**
 * @description : delete user
 * @method : DELETE
 * @access : public
 * @route : '/api/v1/user'
 */

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedUser = await Users.findByIdAndDelete(id);

  await fileDeleteFromCloud(getPublicID(deletedUser.photo));

  res
    .status(200)
    .json({ user: deletedUser, message: "User delete Successful" });
});
