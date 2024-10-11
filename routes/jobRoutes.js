const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Job = require('../models/jobModel');
const User = require('../models/userModel');

// Search for jobs
router.get('/search', async (req, res) => {
    const { title, location } = req.query;
    const jobs = await Job.find({
        title: new RegExp(title, 'i'),
        location: new RegExp(location, 'i')
    });
    res.render('jobs', { jobs });
});

// Apply for a job
router.post('/apply/:jobId', async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const userId = req.body.userId; // Get userId from the request body

        // Check if userId is valid
        // if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        //     return res.status(400).json({ message: "Invalid user ID format" });
        // }

        // Find the job by ID
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Update the user's appliedJobs array
        const userUpdateResult = await User.findByIdAndUpdate(userId, { $push: { appliedJobs: jobId } });

        // Check if user update was successful
        // if (!userUpdateResult) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        res.status(200).json({ message: 'Successfully applied for the job' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
