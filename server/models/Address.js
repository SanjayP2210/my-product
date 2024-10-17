import moment from 'moment-timezone';
import { Schema, model } from 'mongoose';

// Address Schema
const AddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  street: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  zipCode: {
    type: String
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  countryCode:{
    type: String
  },
  mobileNumber: {
    type: String,
    max: [10, '10 Characters is allowed'],
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'phone number required']
  },
  createdAt: {
    type: Date,
    default: moment().tz('Asia/Kolkata').format()
  },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref:'user',
    required: true
  },
},{timestamps : true});

export default model('Address', AddressSchema);
