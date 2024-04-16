import express from "express";
import {
  updateUserPass
} from "../controllers/userPassController.js";


// router initialize

const router = express.Router();

// route set


router
  .route("/:id")
  .patch(updateUserPass)


// export userRoute

export default router;
