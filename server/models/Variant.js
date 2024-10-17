import moment from 'moment-timezone';
import { Schema, model } from 'mongoose';

const Variant = Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    createdBy: {
         type: Schema.Types.ObjectId,
        ref:'user',
        required: true
    },
    modifiedBy: {
         type: Schema.Types.ObjectId,
        ref:'user',
        required: true
    },
    modifiedAt: {
        type: Date,
        default : moment().tz('Asia/Kolkata').format()
    }
});

export default new model('Variant', Variant);