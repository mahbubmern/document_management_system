import asyncHandler from "express-async-handler";
import Incomings from "../models/incomingModel.js";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import { fileDeleteFromCloud, fileUploadToCloud } from "../utils/cloudinary.js";
import {
  getPublicID,
  isValidEmail,
  isValidPhoneNumber,
} from "../helpers/helpers.js";

/**
 * @description : get all Incoming Letter
 * @method : GET
 * @access : public
 * @route : '/api/v1/incoming'
 */
export const getNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await Users.findOne().where("_id").equals(id).populate("notification").populate('task');
  const userNotification = user.notification;

  //check Incoming Letter
  if (userNotification.length === 0) {
    return res.status(404).json({ message: "No Task Found" });
  }
  res.status(200).json({ userNotification: user});
});

// /**
//  * @description : create Incoming Letter
//  * @method : POST
//  * @access : public
//  * @route : '/api/v1/incoming'
//  */
// export const sendTask = asyncHandler(async (req, res) => {
//   const { assigned, deadLine, priority, status, instruction, progress, _id } =
//     req.body;

//   const nameSplit = assigned.split("-");

//   // Check if required fields are provided
//   if (!assigned || !deadLine || !priority) {
//     return res.status(400).json({
//       message: "Some Fields are Required",
//     });
//   }

//   // Store shared data in recipient's data
//   const fileSendToUser = await Users.findOneAndUpdate(
//     { index: nameSplit[0] },
//     {
//       $push: { task: _id },
//       $addToSet: { notification: _id }, // Push _id into notification keys
//     },
//     { new: true }
//   ).populate("task");

//   if (!fileSendToUser) {
//     return res.status(500).json({ message: "Failed to send File" });
//   }

//   res
//     .status(200)
//     .json({ userTask: fileSendToUser, message: "Task Found Successful" });
// });
// // /**
// //  * @description : update incoming File
// //  * @method : PUT/PATCH
// //  * @access : public
// //  * @route : '/api/v1/incoming'
// //  */
// export const updateTask = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { status, progress } = req.body;

//   // Check if required fields are provided
//   if (!status || !progress) {
//     return res.status(400).json({
//       message: "Some Fields are Required",
//     });
//   }

//   // // Check if the file exists
//   const existingFile = await Incomings.findById(id);
//   if (!existingFile) {
//     return res.status(400).json({
//       message: "File Not Exists",
//     });
//   }

//   // Update the file
//   const updatedFile = await Incomings.findByIdAndUpdate(
//     id,
//     { $set: { status: status, progress: progress } },
//     { new: true }
//   );
//   if (!updatedFile) {
//     return res.status(500).json({ message: "Failed to update Task File" });
//   }

//   res.status(200).json({
//     userTask: updatedFile,
//     message: "Update Successful",
//   });
// });
