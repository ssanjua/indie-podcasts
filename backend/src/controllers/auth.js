const mongoose = require("mongoose");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { createError } = require("../error.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const otpGenerator = require('otp-generator');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  port: 465,
  host: 'smtp.gmail.com'
});

exports.signup = async (req, res, next) => {
  const { email } = req.body
  // Check we have an email
  if (!email) {
    return res.status(422).send({ message: "Missing email." });
  }
  try {
    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(409).send({
        message: "Email is already in use."
      });
    }
    // Step 1 - Create and save the userconst salt = bcrypt.genSaltSync(10);
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hashedPassword });

    newUser.save().then((user) => {

      // create jwt token
      const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "9999 years" });
      res.status(200).json({ token, user });
    }).catch((err) => {
      next(err);
    });
  } catch (err) {
    next(err);
  }
}

exports.signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(201, "User not found"));
    }
    if (user.googleSignIn) {
      return next(createError(201, "Entered email is Signed Up with google account. Please SignIn with google."));
    }
    const validPassword = await bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) {
      return next(createError(201, "Wrong password"));
    }

    // create jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "9999 years" });
    res.status(200).json({ token, user });

  } catch (err) {
    next(err);
  }
}

exports.googleAuthSignIn = async (req, res, next) => {
  const { code } = req.body;

  try {
    // Intercambiar el código de autorización por un token de acceso
    const response = await axios.post(`https://oauth2.googleapis.com/token`, {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'https://indie-podcasts-backend.onrender.com/auth/google/callback', // Asegúrate de que coincida con la URI configurada en Google
      grant_type: 'authorization_code',
    });

    const { id_token, access_token } = response.data;

    // Obtener información del usuario
    const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);

    const { email, sub: googleId } = userInfo.data;

    // Buscar o crear el usuario en la base de datos
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, googleId, googleSignIn: true });
      await user.save();
    }

    // Crear un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '9999 years' });

    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
}

exports.logout = (req, res) => {
  res.clearCookie("access_token").json({ message: "Logged out" });
}

exports.generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true, });
  const { email } = req.query;
  const { name } = req.query;
  const { reason } = req.query;
  const verifyOtp = {
    to: email,
    subject: 'Account Verification OTP',
    html: `
        <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Verify Your IndiePodcasts Account</h1>
    <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
            <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for creating a IndiePodcasts account. To activate your account, please enter the following verification code:</p>
            <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the IndiePodcasts app to activate your account.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a IndiePodcasts account, please disregard this email.</p>
        </div>
    </div>
    <br>
    <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The IndiePodcasts Team</p>
</div>
        `
  };

  const resetPasswordOtp = {
    to: email,
    subject: 'IndiePodcasts Reset Password Verification',
    html: `
            <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Reset Your IndiePodcasts Account Password</h1>
                <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                        <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
                        <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">To reset your IndiePodcasts account password, please enter the following verification code:</p>
                        <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the IndiePodcasts app to reset your password.</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not request a password reset, please disregard this email.</p>
                    </div>
                </div>
                <br>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The IndiePodcasts Team</p>
            </div>
        `
  };
  if (reason === "FORGOTPASSWORD") {
    transporter.sendMail(resetPasswordOtp, (err) => {
      if (err) {
        next(err)
      } else {
        return res.status(200).send({ message: "OTP sent" });
      }
    })
  } else {
    transporter.sendMail(verifyOtp, (err) => {
      if (err) {
        next(err)
      } else {
        return res.status(200).send({ message: "OTP sent" });
      }
    })
  }
}

exports.verifyOTP = async (req, res, next) => {
  const { code } = req.query;
  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    res.status(200).send({ message: "OTP verified" });
  }
  return next(createError(201, "Wrong OTP"));
}

exports.createResetSession = async (req, res, next) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(200).send({ message: "Access granted" });
  }

  return res.status(400).send({ message: "Session expired" });
}

exports.findUserByEmail = async (req, res, next) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(200).send({
        message: "User found"
      });
    } else {
      return res.status(202).send({
        message: "User not found"
      });
    }
  } catch (err) {
    next(err);
  }
}

exports.resetPassword = async (req, res, next) => {
  if (!req.app.locals.resetSession) return res.status(440).send({ message: "Session expired" });

  const { email, password } = req.body;
  try {
    await User.findOne({ email }).then(user => {
      if (user) {

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        User.updateOne({ email: email }, { $set: { password: hashedPassword } }).then(() => {

          req.app.locals.resetSession = false;
          return res.status(200).send({
            message: "Password reset successful"
          });

        }).catch(err => {
          next(err);
        });
      } else {
        return res.status(202).send({
          message: "User not found"
        });
      }
    });
  } catch (err) {
    next(err);
  }
}