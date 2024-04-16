import express from "express";
import {
  getAllIncomings, createIncoming, updateIncomingFile, getAllPendings
} from "../controllers/incomingController.js";
import {incomingFile} from "../utils/mullter.js";

// router initialize

const router = express.Router();

// route set

router.route("/").get(getAllIncomings).post(incomingFile, createIncoming);
router.route("/pending").get(getAllPendings)
router
.route("/:id")
.patch(updateIncomingFile)

  // .get(getSingleUser)
  // .put(updateUser)
  // .delete(deleteUser);

// export userRoute

export default router;
