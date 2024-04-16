import express from "express";
import {
  getSingleUserData,sendTask,updateTask
} from "../controllers/taskController.js";
import {incomingFile} from "../utils/mullter.js";
import tokenVerify from "../middleware/tokenVerify.js";

// router initialize

const router = express.Router();

// route set

router.route("/").post(incomingFile, sendTask);
router
.route("/:id")
.patch(updateTask)
.get(getSingleUserData)
  // .get(getSingleUser)
  // .put(updateUser)
  // .delete(deleteUser);

// export userRoute

export default router;
