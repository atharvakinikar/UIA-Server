require("dotenv").config();
const { createToken, validateToken } = require("../middlewares/jwt");
const User = require("../models/user.model");
const Report = require("../models/report.model");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/sendMail");
const {
  HttpApiResponse,
  HandleError,
  HttpErrorResponse,
} = require("../utils/utils");

// Login route
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).lean();

    if (!user) return res.send(HttpErrorResponse("User not found"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const token = await createToken(user);
      var user_details = { ...user, token: token, otp: otp };
      // console.log(user_details);

      const user_email = email;
      const subject = "Otp for login on Swasthya Buddy";
      const template = `Your OTP for logging in to Swasthya Buddy is : ${otp}. Please do not share this OTP with anyone.`;
      mailSender(res, user_email, subject, template);
      return res.send(HttpApiResponse(user_details));
    }
    return res.send(HttpErrorResponse("Invalid Password"));
  } catch (err) {
    await HandleError("Auth", "login", err);
    return res.send(HttpErrorResponse(err));
  }
}

async function register(req, res) {
  const { email, password, name, user_type, doctor_id } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.send(HttpErrorResponse("User already exists"));
    console.log(doctor_id);
    //process.env.Salt
    const hashedPassword = await bcrypt.hash(password, 10);
    if (doctor_id != null) {
      var newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        doctor_id: doctor_id,
        user_type: user_type,
      });
    } else {
      var newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        user_type: user_type,
      });
    }

    return res.send(HttpApiResponse("Registration successful!"));
  } catch (error) {
    await HandleError("Auth", "register", error);
    return res.send(HttpErrorResponse(error.message));
  }
}
//
async function getProfile(req, res) {
  const { email } = req.body;
  try {
    // Find user without sending password and version key (__v)
    // console.log("[Auth] Get by user-id: " + req.user.id);
    const user = await User.findOne({ email: email }).lean();
    // console.log(user);
    if (user) {
      return res.send(HttpApiResponse(user.name));
    } else {
      return res.send(HttpErrorResponse("No user exists with such id"));
    }
  } catch (err) {
    HandleError("Auth", "getProfile", err);
    return res.send(HttpErrorResponse(err.message));
  }
}

async function getPatients(req, res) {
  const { email } = req.body;
  try {
    const patients = await Report.find({ ref_doctor_email: email }).lean();
    if (patients) {
      const emails = {};
      const user = patients.map(patient => {
        emails[patient.patient_email] = patient.patient_name;
      });
      return res.send(HttpApiResponse(emails));
      // console.log(emails);
    } else {
      return res.send(HttpErrorResponse("No patients found!"));
    }
  } catch (error) {
    return res.send(HttpErrorResponse(error.message));
  }
}

module.exports = { login, register, getProfile, getPatients };
