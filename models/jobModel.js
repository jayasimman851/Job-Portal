const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String,
    location: String,
    description: String,
    company: String,
    postedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
