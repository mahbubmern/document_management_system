import express from "express";
import {
  updateUserPersonal
} from "../controllers/userPersonalController.js";


// router initialize

const router = express.Router();

// route set


router
  .route("/:id")
  .patch(updateUserPersonal)


// export userRoute

export default router;
