import express from "express";
import { updateUserPhoto } from "../controllers/userPhotoController.js";
import { userPhoto } from "../utils/mullter.js";

// router initialize

const router = express.Router();

// route set

router.route("/:id").patch(userPhoto, updateUserPhoto);

// export userRoute

export default router;
