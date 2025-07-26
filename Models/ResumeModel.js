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
    constactInfo: {
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        github: String,
    },
    workExperinence: [{
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
    project: [{
        title: String,
        description: String,
        github: String,
        liveDemo: String,
    }],
    certification: [{
        title: String,
        issuer: String,
        year: String,
    }],
    language: [{
        name: String,
        progress: Number
    }],

    interest: [String],
    template: {
        theme: { type: String },
        colorPalette: { type: String }
    }


}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

module.exports = mongoose.model("Resume", ResumeModel);
