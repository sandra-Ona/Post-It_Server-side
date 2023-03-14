const Stories = require('../model/createStory')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const getStories = async (req, res) => {
    try {
        const stories = await Stories.find({createdBy: req.user.userId})
        res.status(200).json({ noOfStory: stories.length, stories})
    } catch (error) {
        console.log(error)
        res.json({ error })
    }
}

const getStory = async (req, res) => {
    const {user: {userId}, params: {storyId},} = req
    try {
        const story = await Stories.findOne({createdBy: userId, _id: storyId})
        if(!story) {
            return res.status(404).json({success: false, message:`story with the ${storyId} not found`})
        }
        res.status(201).json({ success: true, story})
    } catch (error) {
        console.log(error)
        res.json({ error })
    }
}

const createStory = async (req, res) => {
    // title,description, tag, 
    const { title, description , tag } = req.body
    req.body.createdBy = req.user.userId
    if (!title || !description || !tag) {
        return res.status(400).json({ success: false, message: 'Please provide necassary information'})
    }
    try {
        const result= await cloudinary.uploader.upload(req.files.image.tempFilePath, {
            use_filename:true,
            folder: 'StoryImages'
        })
        fs.unlinkSync(req.files.image.tempFilePath)
        req.body.image = result.secure_url
    
        const story = await Stories.create({...req.body})
        res.status(201).json({ success: true, story})
    } catch (error) {
        console.log(error)
        res.json({ error })
    }
}

const updateStory = async (req, res) => {
    const {user: {userId}, params: {storyId},} = req

    try {
        const story = await Stories.findOneAndUpdate({ createdBy: userId, _id: storyId}, req.body, {
            new: true,
            runValidators: true,
        })
            
        res.status(200).json({ success: true, story})
    } catch (error) {
        console.log(error)
        res.json({ error })
    }
}

const deleteStory = async (req, res) => {
    const {user: {userId}, params: {storyId},} = req
    try {
        const story = await Stories.findOneAndDelete({createdBy: userId, _id: storyId})
        res.status(200).json({ success: true, message: 'Story deleted successfully', story})
    } catch (error) {
        console.log(error)
        res.json({ error })
    }
    
}


const getallstories = async (req, res) => {
    try {
        const stories = await Stories.find({})
        res.status(200).json({ noOfStory: stories.length, stories})
    } catch (error) {
        console.log(error)
        res.json({ error })
    }
}

const getSingleStory = async (req, res) => {
    const { params: {storyId},} = req
    console.log(storyId);
    try {
        const story = await Stories.findById({ _id: storyId})
        if(!story) {
            return res.status(404).json({success: false, message:`story with the ${storyId} not found`})
        }
        res.status(201).json({ success: true, story})
    } catch (error) {
        console.log(error)
        res.json({ error })
    }
}

module.exports = { getStories, getStory, createStory, deleteStory, updateStory, getallstories, getSingleStory}