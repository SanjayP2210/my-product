import moment from 'moment-timezone';
import { Schema, model } from 'mongoose';

const Gender = Schema({
    name: { type: String, required: true,unique: true },
    isActive: { type: Boolean, required: true, default: true },
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
    }
});

export default new model('Gender', Gender);