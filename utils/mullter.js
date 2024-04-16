import multer from "multer";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// create multer

const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
  //     cb(null, join(__dirname, '../../Files/Incoming'));
  //   } else {
  //     cb(new Error("Only Image files are allowed!"), false);
  //   }
  // },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

export const userPhoto = multer({ storage }).single("photo");
export const incomingFile = multer({ storage }).single("file");
