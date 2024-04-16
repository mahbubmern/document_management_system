import express from "express";
import {
  getAllOutgoing, createOutgoing, updateOutgoingFile, getAllPendings
} from "../controllers/outgoingController.js";
import {incomingFile} from "../utils/mullter.js";

// router initialize

const router = express.Router();

// route set

router.route("/").get(getAllOutgoing).post(incomingFile, createOutgoing);
router.route("/pending").get(getAllPendings)
router
.route("/:id")
.patch(updateOutgoingFile)

  // .get(getSingleUser)
  // .put(updateUser)
  // .delete(deleteUser);

// export userRoute

export default router;
