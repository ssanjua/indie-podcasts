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
    return res.status(422).send({ message: "Falta el correo electrónico." });
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
      return next(createError(201, "Usuario no encontrado"));
    }
    if (user.googleSignIn) {
      return next(createError(201, "El correo electrónico ingresado está registrado con una cuenta de Google. Por favor, inicie sesión con Google."));
    }
    const validPassword = await bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) {
      return next(createError(201, "Contraseña incorrecta"));
    }

    // create jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "9999 years" });
    res.status(200).json({ token, user });

  } catch (err) {
    next(err);
  }
}

exports.googleAuthSignIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      try {
        const user = new User({ ...req.body, googleSignIn: true });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "9999 years" });
        res.status(200).json({ token, user: user });
      } catch (err) {
        next(err);
      }
    } else if (user.googleSignIn) {
      const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "9999 years" });
      res.status(200).json({ token, user });
    } else if (user.googleSignIn === false) {
      return next(createError(201, "User already exists with this email can't do google auth"));
    }
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
    subject: 'Código de Verificación de Cuenta',
    html: `
        <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h1 style="font-size: 22px; font-weight: 500; color: #fecd23; text-align: center; margin-bottom: 30px;">Verifica Tu Cuenta de IndiePodcasts</h1>
    <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #fecd23; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Código de Verificación</h2>
            <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Estimado/a ${name},</p>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Gracias por crear una cuenta en IndiePodcasts. Para activar tu cuenta, por favor ingresa el siguiente código de verificación:</p>
            <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #fecd23;">${req.app.locals.OTP}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Por favor, ingresa este código en la aplicación IndiePodcasts para activar tu cuenta.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Si no creaste una cuenta en IndiePodcasts, por favor ignora este correo electrónico.</p>
        </div>
    </div>
    <br>
    <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Saludos cordiales,<br>El equipo de IndiePodcasts</p>
</div>
        `
  };

  const resetPasswordOtp = {
    to: email,
    subject: 'Verificación de Restablecimiento de Contraseña de IndiePodcasts',
    html: `
            <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h1 style="font-size: 22px; font-weight: 500; color: #fecd23; text-align: center; margin-bottom: 30px;">Restablece Tu Contraseña de IndiePodcasts</h1>
                <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #fecd23; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                        <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Código de Verificación</h2>
                        <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Estimado/a ${name},</p>
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Para restablecer la contraseña de tu cuenta de IndiePodcasts, por favor ingresa el siguiente código de verificación:</p>
                        <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #fecd23;">${req.app.locals.OTP}</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Por favor, ingresa este código en la aplicación IndiePodcasts para restablecer tu contraseña.</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo electrónico.</p>
                    </div>
                </div>
                <br>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Saludos cordiales,<br>El equipo de IndiePodcasts</p>
            </div>
        `
  };
  if (reason === "FORGOTPASSWORD") {
    transporter.sendMail(resetPasswordOtp, (err) => {
      if (err) {
        next(err)
      } else {
        return res.status(200).send({ message: "OTP enviado" });
      }
    })
  } else {
    transporter.sendMail(verifyOtp, (err) => {
      if (err) {
        next(err)
      } else {
        return res.status(200).send({ message: "OTP enviado" });
      }
    })
  }
}

exports.verifyOTP = async (req, res, next) => {
  const { code } = req.query;
  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    res.status(200).send({ message: "OTP verificado" });
  }
  return next(createError(201, "Error al verificar el OTP"));
}

exports.createResetSession = async (req, res, next) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(200).send({ message: "Acceso concedido" });
  }

  return res.status(400).send({ message: "Sesión expirada" });
}

exports.findUserByEmail = async (req, res, next) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(200).send({
        message: "Usuario encontrado"
      });
    } else {
      return res.status(202).send({
        message: "Usuario no encontrado"
      });
    }
  } catch (err) {
    next(err);
  }
}

exports.resetPassword = async (req, res, next) => {
  if (!req.app.locals.resetSession) return res.status(440).send({ message: "Sesión expirada" });

  const { email, password } = req.body;
  try {
    await User.findOne({ email }).then(user => {
      if (user) {

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        User.updateOne({ email: email }, { $set: { password: hashedPassword } }).then(() => {

          req.app.locals.resetSession = false;
          return res.status(200).send({
            message: "Restablecimiento de contraseña exitoso"
          });

        }).catch(err => {
          next(err);
        });
      } else {
        return res.status(202).send({
          message: "Usuario no encontrado"
        });
      }
    });
  } catch (err) {
    next(err);
  }
}