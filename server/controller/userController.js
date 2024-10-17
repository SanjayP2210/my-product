import { sendMail } from "../middleware/sendMail.js";
import { sendToken } from "../middleware/sendToken.js";
import userModel from "../models/userModel.js";
import { handleImageUpload, uploadImages } from "./commonController.js";
import { v2 as cloudinary } from 'cloudinary';

const getUser = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;

        const matchStage = {};
        const query = {
            ...(search ? { name: { $regex: search, $options: 'i' } } : {}),
        };

        matchStage.$match = Object.keys(query).length > 0 ? { ...query } : {};
        let users = [];
        let basicQuery = [];
        if (Object.keys(query).length > 0) {
            matchStage.$match = { ...matchStage.$match, ...query };
            basicQuery = [...basicQuery, matchStage];
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortQuery = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const baseQuery = [
            ...basicQuery,
            {
                '$sort': sortQuery
            },
            {
                '$skip': skip
            },
            {
                '$limit': (parseInt(limit) * 1)
            },
            {
                $project: {
                    name: 1,
                    _id: 1,
                    createdAt: 1,
                    image: 1,
                    email: 1,
                    mobileNumber: 1,
                    isAdmin: 1,
                    themeColor: 1
                },
            }
        ]
        users = await userModel.aggregate(baseQuery);

        const count = await userModel.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        console.log("err in getUser", err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        console.log("req.params.id", req.params.id);
        const data = await userModel.findById(req.params.id, { "password": 0 }).populate("technology", "name");
        console.log("data", data);
        res.json({ userData: data });
    } catch (err) {
        console.log("err in getUserById", err);
    }
};

const addUserImage = async(req,res,next) =>{
    try {
        const image = req.files;
        if(Object.keys(image)?.length > 0){
            const newImage = await uploadImages(req, res, image,'user');
            res.json({ message: "Image uploaded successfully", images: newImage, success: true });
        }
        
    } catch (error) {
        
    }
}

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        let data = await userModel.findById(id);
        const body = req.body;
        let files = req.files;
        if (files?.newImage) {
            const imageAray = Array.isArray(files?.newImage) ? files?.newImage : [files?.newImage];
            const newImage = await uploadImages(req, res, imageAray,'user');;
            body.image = newImage[0];
        }
        body.modifiedAt = Date.now();
        body.modifiedBy = id;
        const user = await userModel.updateOne({ _id: id }, { $set: body });
        if (user && body?.email != data?.email) {
            data.email = body?.email;
            data.name = body?.name;
            sendToken(data, res, 200, "User Updated Successfully");
        } else {
            res.json({ message: "User Updated Successfully", user: body, success: true });
        }
    } catch (err) {
        console.log("err in updateUser", err);
    }
};

const updateUserTheme = async (req, res) => {
    try {
        const id = req.params.id;
        const themeColor = req.body.color;
        const update = { ['themeColor']: themeColor };
        const user = await userModel.updateOne({ _id: id }, { $set: update });
        res.json({ message: "User Theme Update Successfully", user: user });
    } catch (error) {
        console.log("err in updateUserTheme", err);
    }
}

const sendEmail = async (req, res, next) => {
    try {
        const response = await sendMail();
        if (response?.isError) {
            const error = response?.error;
            res.status(400).send({ message: 'Error in send email', error: error?.message });
        }
        if (response && response?.messageId) {
            console.log('Message sent: %s', response?.messageId);
            console.log('Preview URL: %s', response?.preview);
            res.status(200).send({ message: `Mail sent successfully to ${response.messageId}`, response });
        }
    } catch (error) {
        res.status(400).send({ message: 'Error in send email', error });
    }
}
// const userSchema = new mongoose.Schema({
//     name: String,
//     image: String,
// });

// export const UserImage = mongoose.model('userimage', userSchema);

// const uploadImage = async (req, res, next) => {
//     try {
//         const user = new UserImage({
//             name: req.body.name,
//             image: req.file.filename,
//         });
//         await user.save();
//         res.json(user);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

// const getImage = async (req, res) => {
//     try {
//         const users = await UserImage.find();
//         res.json(users);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// const deleteImage = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const users = await UserImage.deleteOne({ _id: id });
//         if (users) {
//             res.json({ message: 'image deleted successfully', users: users });
//         } else {
//             res.status(400).json({ message: error.message });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

const updatePassword = async (req, res, next) => {
    try {
        const { password, confirmPassword, oldPassword, email } = req.body;
        const user = await userModel.findOne({ email: email });
        const isPassMatch = await user.comparePassword(oldPassword);
        if (!isPassMatch) {
            return res.status(401).json({ message: "Old Password is Incorrect", isError: true });
        }

        if (password !== confirmPassword) {
            return res.status(401).json({ message: "Password does not matched", isError: true });
        }

        user.password = password;
        await user.save({ validateBeforeSave: false });

        sendToken(user, res, 200, "Password has been updated successfully");
    } catch (error) {
        res.status(400).json({ message: 'Error while reset password', error: error, isError: true });
    }
}

// Admin routes

// Get all users(admin)
const getAllUser = async (req, res, next) => {
    const users = await userModel.find();

    res.status(200).json({
        success: true,
        users,
    });
}

// Get single user (admin)
const getSingleUser = async (req, res, next) => {
    const user = await userModel.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
}

// update User Role -- Admin
const updateUserRole = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
    };

    await userModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        isError:false
    });
}

// Delete User --Admin
const deleteUser = async (req, res, next) => {
    const user = await userModel.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }

    const imageId = user.image.public_id;
    if(imageId){
       await cloudinary.uploader.destroy(imageId);
    }

    await userModel.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
}


export {
    getUser,
    getUserById,
    updateUser,
    deleteUser,
    sendEmail,
    updatePassword,
    updateUserTheme,
    updateUserRole,
    getSingleUser,
    getAllUser,
    addUserImage
    // getImage,
    // uploadImage,
    // deleteImage
};
