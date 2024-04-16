import asyncHandler from "express-async-handler";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";

/**
 * @description : update user Pass
 * @method : PUT/PATCH
 * @access : public
 * @route : '/api/v1/userpass'
 */
export const updateUserPass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "All Fields Are required",
    });
  }
  // check user exists
  const ExistsUSer = await Users.findOne({ _id: id });

  if (!ExistsUSer) {
    return res.status(400).json({
      message: "User Not Exists",
    });
  }

  //password check
  const checkPassword = await bcrypt.compare(oldPassword, ExistsUSer.password);
  if (!checkPassword) {
    return res.status(400).json({ message: "Wrong password" });
  }

  if (newPassword != confirmPassword) {
    return res.status(400).json({ message: "Password Not Match" });
  }
  //Hash Password
  const hashPassword = await bcrypt.hash(newPassword, 10);

  const changePassword = await Users.findOneAndUpdate(
    { _id: ExistsUSer._id },
    { $set: { password: hashPassword } },
    { new: true }
  ).select("-password");

  res
    .status(200)
    .json({ userCred: changePassword, message: "Password Update Successful" });
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
