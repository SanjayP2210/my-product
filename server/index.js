import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import userRouter from './router/userRouter.js';
import authRouter from './router/authRouter.js';
import productRouter from './router/productRoutes.js';
import categoryRouter from './router/categoryRoutes.js';
import tagRouter from './router/tagRouter.js';
import statusRouter from './router/statusRouter.js';
import variantRouter from './router/variantRouter.js';
import GenderRouter from './router/genderRouter.js';
import ReviewRouter from './router/reviewRouter.js';
import cartRouter from './router/cartRouter.js';
import orderRouter from './router/orderRouter.js';
import addressRouter from './router/addressRouter.js';
import paymentRouter from './router/paymentRouter.js';
import errorMiddleware from './middleware/error.js';
import connectDatabase from './config/db.js';

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "server/config/config.env" });
}

app.use(express.static(path.join(__dirname, "../Client/dist")));
// app.use('/', express.static(path.join(__dirname, 'public/images')));
app.use(cookieParser());
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const corsOptions = {
    origin: true, // Replace with your frontend's origin
    credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit if necessary
// app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/tag', tagRouter);
app.use('/api/status', statusRouter);
app.use('/api/variant', variantRouter);
app.use('/api/gender', GenderRouter);
app.use('/api/review', ReviewRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/address', addressRouter);
app.use('/api/payment', paymentRouter);
app.use(errorMiddleware);

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`server is working on ${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});
