// routes/categoryRoutes.js

import Category from '../models/Category.js';

// Create a new category
const addCategory = async (req, res) => {
    try {
        const category = JSON.parse(req.body.category);
        const response = await Category.insertMany(category);
        if (response) {
            res.status(201).json({
                message: "Category saved successfully",
                category: category,
            });
        }
    } catch (err) {
        console.log('error addCategory', err);
        res.status(400).json({ message: err.message,isError: true });
    }
}

// Get all categorys
const getCategorys = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json({
            categories
        });
    } catch (err) {
        console.log("err in getCategory", err);
        res.status(500).json({ message: err.message ,isError:true});
    }
}

// Get a single category
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send();
        }
        res.json({ categoryData: category });
    } catch (err) {
        console.log("err in getCategoryById", err);
    }
}

// Update a category
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!category) {
            return res.status(404).send();
        }
        res.json({ message: 'Category Updated Successfully', category: updatedCategory });
    } catch (err) {
        console.log('error updateCategory', error);
        res.status(400).json({ message: err.message,isError: true });
    }
}

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.deleteOne({ _id: id });
        res.json({ message: 'Deleted Category', category });
    } catch (err) {
        console.log('error delete Category', err);
        res.status(400).json({ message: err.message, isError: true });
    }
}

export {
    deleteCategory,
    addCategory,
    updateCategory,
    getCategoryById,
    getCategorys,
}