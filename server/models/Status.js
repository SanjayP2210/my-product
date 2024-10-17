import moment from 'moment-timezone';
import { Schema, model } from 'mongoose';

const Status = Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
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

export default new model('Status', Status);