import { sendMail } from "../middleware/sendMail.js";
import { sendToken } from "../middleware/sendToken.js";
import userModel from "../models/userModel.js";
import crypto from 'crypto';
import { uploadImage } from "./commonController.js";
import { fileURLToPath } from "url";
import path, { dirname } from 'path';
import ejs from 'ejs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const registerUser = async (req, res, next) => {
    try {
        const dataJson = req.body;
        const image = JSON.parse(dataJson?.image);
        const isFound = await userModel.findOne({ email: dataJson.email });
        console.log("isFound", isFound);
        if (isFound) {
            return res.status(401).json({ message: "user is already registered" });
        }
        const data = await userModel.create({ ...dataJson, image : image?.[0]});
        console.log("data", data);
        sendToken(data, res, 201, "user registered successfully");
    } catch (error) {
        if (error.name === "ValidationError") {
            let errors = { message: {} };

            Object.keys(error.errors).forEach((key) => {
                errors.message[key] = error.errors[key].message;
            });

            errors.status = 404;
            return next(errors);
        }
        res.status(500).send("Something went wrong");
        return next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log("req.body", req.body);
        if (email && password) {
            const userExist = await userModel.findOne({ email: email });
            console.log("userExist user", userExist);
            if (!userExist) {
                return res.status(401).json({ message: "email does not exist" });
            }
            const user = await userExist.comparePassword(password);
            console.log("compare user", user);
            if (user) {
                sendToken(userExist, res, 200, "Login Successfully");
                // res.status(200).json({
                //     message: "Login Successfully",
                //     user: userExist,
                //     userID: userExist._id.toString(),
                //     token: await userExist.generateToken(),
                // });
            } else {
                const error = new Error("Invalid email or password");
                error.status = 404;
                return next(error);
            }
        } else {
            return res
                .status(401)
                .json({ message: "email and password is required" });
        }
    } catch (err) {
        console.log("err while login", err);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        res.cookie('token', undefined, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: "Logout Successfully",
        });
    } catch (err) {
        console.log("err while login", err);
    }
};

const forgetPassword = async (req, res, next) => {
    try {

        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({ message: "email does not exist" });
        }
        const resetToken = await user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.get("origin")}/auth/reset-password/${resetToken}`;
        const message = `your reset password token is \n\n${resetUrl} \n\n. Please check it`;

        const templatePath = path.join(__dirname, '../templates', 'email', 'forgot-password.ejs');
        const year = new Date().getFullYear();

        const html = await ejs.renderFile(templatePath, { user, resetUrl, year });

        try {
            const response = await sendMail({
                message,
                email: user.email,
                subject: 'Forget Password Link',
                html: html,
            });
            if (response?.isError) {
                const error = response?.error;
                user.resetPasswordToken = null;
                user.resetPasswordExpire = null;

                await user.save({ validateBeforeSave: false });

                res.status(400).json({ message: 'Error while reset password', error: error, isError: true });
            }
            if (response && response?.messageId) {
                console.log('Message sent: %s', response?.messageId);
                console.log('Preview URL: %s', response?.preview);
                res.status(200).send({ message: `Mail sent successfully to ${response.messageId}`, resetUrl: resetUrl, response });
            }

        } catch (error) {
            user.resetPasswordToken = null;
            user.resetPasswordExpire = null;
            await user.save({ validateBeforeSave: false });
            res.status(400).json({ message: 'Error while forget password', error: error, isError: true });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error while forget password', error: error, isError: true });
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { token, password, confirmPassword, JWTToken } = req.body;

        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await userModel.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

        if (!user) {
            return res.status(401).json({ message: "Reset Password Token is Invalid or Expired. Please Forget Password again", isError: true });
        }

        if (password !== confirmPassword) {
            return res.status(401).json({ message: "Password does not matched", isError: true });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        sendToken(user, res, 200, "Password has been updated successfully");
    } catch (error) {
        res.status(400).json({ message: 'Error while reset password', error: error, isError: true });
    }
}


export {
    registerUser,
    loginUser,
    logoutUser,
    forgetPassword,
    resetPassword,
};