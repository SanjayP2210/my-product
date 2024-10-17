import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from 'fs';

const getAll = (Model, controllerName) => async (req, res) => {
    try {
        const type = req.params.type;
        let list = [];
        if (type !== 'master') {
            list = await Model.find({ isActive: true }, { name: 1, icon: 1 });
        } else {
          list= await Model.find({});
        }
        console.log('Model', Model)
        res.status(200).send({ [controllerName?.toLowerCase()]: list });
    } catch (error) {
        console.log(`eror while fetching list`);
        res.status(500).send(error);
    }
}

const getOne = (Model, controllerName) => async (req, res, next) => {
    try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
            return res.status(404).send();
        }
        res.status(200).send({ [controllerName]: doc });
    } catch (error) {
        res.status(500).send(error);
    }
}

const postRequest = (Model, controllerName) => async (req, res, next) => {
    console.log('controllerName', controllerName)
    const model = new Model(req.body);
    model.createdAt = Date.now();
    model.createdBy = req?.user?._id?.toString();
    model.modifiedAt = Date.now();
    model.modifiedBy = req?.user?._id?.toString();
    const response = await model.save(req.body);

    try {
        res.json({
            message: `${controllerName} added successfully`, [controllerName]: response
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const patchRequest = (Model, controllerName) => async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = Object.keys(Model.schema.paths);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
            return res.status(404).send();
        }
        doc.createdBy = req?.user?._id?.toString();
        doc.modifiedBy = req?.user?._id?.toString();
        updates.forEach((update) => doc[update] = req.body[update]);
        await doc.save();
        res.send(doc);
    } catch (error) {
        res.status(400).send(error);
    }
}

const putRequest = (Model, controllerName) => async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = Object.keys(Model.schema.paths);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
            return res.status(404).send();
        }

        updates.forEach((update) => doc[update] = req.body[update]);
        await doc.save();
        res.send(doc);
    } catch (error) {
        res.status(400).send(error);
    }
}

const deleteRequest = (Model, controllerName) => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return res.status(404).send();
        }
        res.send(doc);
    } catch (error) {
        res.status(500).send(error);
    }
}

const uploadImage = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: "users",
        // width: 150,
        // crop: 'scale',
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, {
            options,
            transformation: [
                { width: 1000, crop: "scale" },
                { quality: "auto" },
                { fetch_format: "auto" }
            ]
        });
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
};

const deleteImage = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
};


const handleImageUpload = async (req, res, image, public_id) => {
    try {
        if (!image.startsWith("https://res.cloudinary.com")) {
            if (public_id != null && public_id !== 'null') {
                await deleteImage(public_id);
            }

            const result = await uploadImage(image);
            if (result) {
                return {
                    public_id: result?.public_id,
                    url: result?.secure_url,
                };
            } else {
                return req?.file?.filename || image[0];
            }
        }
    } catch (error) {
        console.log("err while upload image in update user", error);
    }
}

const uploadImages = async (req, res, filesList,folderName = 'user') => {
    try {
        const files = filesList || req.files;
        if (!files || Object.keys(files)?.length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const uploadPromises = Object.keys(files).map(newFile => {
            return new Promise((resolve, reject) => {
                const file = files[newFile];
                const tempFilePath = path.join(__dirname, 'uploads', file?.name);
                file.mv(tempFilePath, async (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    const options = {
                        use_filename: true,
                        unique_filename: false,
                        overwrite: true,
                        folder: "users",
                        // width: 150,
                        // crop: 'scale',
                    };
                    const result = cloudinary.uploader.upload(tempFilePath, {
                        folder: folderName,
                        options,
                        transformation: [
                            { width: 1000, crop: "scale" },
                            { quality: "auto" },
                            { fetch_format: "auto" }
                        ]
                    },
                        (error, result) => {
                            if (error) {
                                reject(error);
                                fs.unlinkSync(tempFilePath);
                            }
                            else {
                                if (result) {
                                    resolve({
                                        public_id: result?.public_id,
                                        url: result?.secure_url,
                                    })
                                }
                                fs.unlinkSync(tempFilePath);
                            }
                        }
                    );
                })
            });
        });
        const results = await Promise.all(uploadPromises);
        if (filesList) {
            return results;
        } else {
            res.send({ message: 'Images uploaded successfully', images: results });
        }

    } catch (error) {
        res.status(400).json({ message: 'Error while uploadImages', error: error, isError: true });
    }
}

const deleteImages = async (req, res, next) => { 
    try {
        const public_id = req.params.public_id;
        if (public_id != null && public_id !== 'null') {
            const response = await deleteImage(public_id);
            res.send({ message: 'Image deleted successfully', result: response });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error while deleting Image', error: error, isError: true });
    }
}

export {
    postRequest,
    getAll,
    getOne,
    putRequest,
    patchRequest,
    deleteRequest,
    uploadImage,
    deleteImage,
    handleImageUpload,
    uploadImages,
    deleteImages,
}