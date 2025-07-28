const mongoose = require("mongoose");

const ResumeModel = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    thumbnaillink: { type: String },
    profileInfo: {
        profilePreviewUrl: String,
        fullName: String,
        designation: String,
        summary: String,
    },
    contactInfo: {
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        github: String,
    },
    workExperience: [{
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String
    }],
    education: [{
        degree: String,
        institue: String,
        startDate: String,
        endDate: String
    }],
    skills: [{
        name: String,
        progress: Number,
    }],
    projects: [{
        title: String,
        description: String,
        github: String,
        liveDemo: String,
    }],
    certifications: [{
        title: String,
        issuer: String,
        year: String,
    }],
    languages: [{
        name: String,
        progress: Number
    }],

    interests: [String],
    template: {
        theme: { type: String },
        colorPalette: { type: String }
    }


}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

module.exports = mongoose.model("Resume", ResumeModel);
