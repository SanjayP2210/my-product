import moment from 'moment-timezone';
import Address from '../models/Address.js';

// Create a new address
export const addAddress = async (req, res) => {
    try {
        const address = new Address(req.body);
        address.createdBy = req?.user?._id || req?.body?.user;
        address.modifiedBy = req?.user?._id || req?.body?.user;
        await address.save();
        res.status(200).json({
            message: 'Address added to succesfully!',
            isError: false,
            address
        });
    } catch (error) {
        res.status(404).send({ message: 'error while creating new addrees', isError: true });
        console.log('error while creating new addrees', error);
    }
};

// Read all addresses
 export const getAddress =   async (req, res) => {
    try {
        const addresses = await Address.find().populate('user');
        res.json({
            isError: false,
            message: 'Address fetched successfully',
            addresses
        });
    } catch (error) {
        res.status(404).send({ message: 'error while getting cart', isError: true });
        console.log('error while getting cart', error);
    }
};

// Read a specific address by ID
export const getAddressById =async (req, res) => {
    try {
        const address = await Address.findById(req.params.id).populate('users');
        if (!address) {
            return res.status(404).send();
        }
        res.status(200).json({
            message: 'fetchec address succesfully!',
            isError: false,
            address
        });
    } catch (error) {
        res.status(404).send({ message: 'error while fetching addrees', isError: true });
        console.log('error while fetching addrees', error);
    }
};

// Update an address by ID
export const updateAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!address) {
            return res.status(404).send();
        }
        res.status(200).send(address);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete an address by ID
export const deleteAddress =async (req, res) => {
    try {
        const address = await Address.findByIdAndDelete(req.params.id);
        if (!address) {
            return res.status(404).send();
        }
        res.status(200).send(address);
    } catch (error) {
        res.status(500).send(error);
    }
};

