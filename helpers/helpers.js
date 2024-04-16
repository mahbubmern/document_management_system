import bcrypt from "bcrypt";

//Email check function

export const isValidEmail = (email) => {
  // Regular expression for a valid email address
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Check if the provided email matches the pattern
  return emailPattern.test(email);
};

//Phone no check function

export const isValidPhoneNumber = (phoneNumber) => {
  // Regular expression for a valid phone number
  const phonePattern = /^(?:\+8801|01)\d{9}$/;

  // Check if the provided phone number matches the pattern
  return phonePattern.test(phoneNumber);
};

// Get PublicID from Secure URL for File delete from Cloudinary

export const getPublicID = (url) => {
  return url.split("/").pop().toString();
};

// create OTP

export const generateOTP = () => {
  // Generate a random 5-digit number
  const otp = Math.floor(10000 + Math.random() * 90000);
  return otp;
};

// token encode

export const tokenEncode = (string) => {
  const replaceString = string.replace(/\./g, "mahbub");
  return replaceString;
};
// token decode

export const tokenDecode = (string) => {
  const replaceString = string.replace(/mahbub/g, ".");
  return replaceString;
};

// validate atleast 8 character one must upppercase, lowercase, number & special character

export const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

  return passwordRegex.test(password);
};

