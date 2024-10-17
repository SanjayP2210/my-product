import moment from 'moment-timezone';
import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        // required: true,
        // unique: true
    },
    createdAt: {
        type: Date,
        default : moment().tz('Asia/Kolkata').format()
    },
    createdBy: {
        type: Schema.Types.ObjectId
    },
    modifiedBy: {
        type: Schema.Types.ObjectId
    },
    modifiedAt: {
        type: Date,
        default : moment().tz('Asia/Kolkata').format()
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

export default model('Category', CategorySchema);
