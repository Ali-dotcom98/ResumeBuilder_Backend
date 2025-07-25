const express = require("express");
const User = require("../Models/UserModel")
const Resume = require("../Models/ResumeModel")
const fs = require("fs")
const path = require("path")

const router = express.Router();
const { GenerateToken, VerifyToken, Protect } = require("../Middleware/Token");


router.post("/CreateR", async (req, res) => {
    try {
        console.log("User ID from token:", req.user._id);
        const { title } = req.body;
        const DefaultData = {
            profileInfo: {
                profilePreviewUrl: "",
                fullName: "",
                designation: "",
                summary: "",
            },
            constactInfo: {
                email: "",
                phone: "",
                location: "",
                linkedin: "",
                github: "",
            },
            workExperinence: {
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                description: ""
            },
            education: {
                degree: "",
                institue: "",
                startDate: "",
                endDate: ""
            },
            skills: [{
                name: "",
                progress: 0
            }],
            project: [{
                title: "",
                description: "",
                github: "",
                liveDemo: ""
            }],
            certification: [{
                title: "",
                issuer: "",
                year: ""
            }],
            language: [{
                name: "",
                progress: 0
            }],
            interest: [""],
            template:
            {
                colorPlates: [""]
            }
        }
        const newResume = await Resume.create({
            userID: req.user._id,
            title,
            ...DefaultData
        })
        res.status(201).json(newResume);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})


router.get("/GetR", async (req, res) => {
    try {
        console.log("User ID from token:", req.user._id);

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const data = await Resume.find({ userID: req.user._id }).sort({ updatedAt: -1 });
        if (data) {
            return res.json(data);
        }
        res.json({ Message: "Issue in Query" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get("/GetR/:id", async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id })
        if (!resume)
            return res.status(404).send({ Message: "Resume Not exist" })
        return res.json(resume);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

router.put("/UpdateR/:id", async (req, res) => {
    try {
        const resume = await Resume.findById({ _id: req.params.id })
        if (!resume)
            return res.status(401).send({ Message: "Resume Not exist" })

        Object.assign(resume, req.body);

        const savedResume = await resume.save();
        res.send(savedResume)
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})
router.put("/:id/upload-image", (req, res) => {
    try {
        upload.fields([{ name: 'thumbnail' }, { name: 'profileImage' }])(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "File upload failed", error: err.message });
            }

            const resumeId = req.params.id;
            const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });

            if (!resume) {
                return res.status(404).json({ message: "Resume not found or unauthorized" });
            }

            const uploadsFolder = path.join(__dirname, '..', 'uploads');
            const baseUrl = `${req.protocol}://${req.get("host")}`;

            const newThumbnail = req.files.thumbnail?.[0];
            const newProfileImage = req.files.profileImage?.[0];
            if (newThumbnail) {
                if (resume.thumbnaillink) {
                    const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnaillink));
                    if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
                }
                resume.thumbnaillink = `${baseUrl}/uploads/${newThumbnail.filename}`;
            }

            // If new profile image uploaded, delete old one
            // if (newProfileImage && resume.profileInfo?.profilePreviewUrl) { // Original commented line
            if (newProfileImage) {
                if (resume.profileInfo?.profilePreviewUrl) {
                    const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
                    if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
                }
                resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
            }

            await resume.save();
            res.status(200).json({
                Message: "Images uploaded Successfully",
                thumbnaillink: resume.thumbnaillink,
                profilePreviewUrl: resume.profilePreviewUrl
            })
        });
    } catch (error) {
        console.error("Error in uploadResumeImages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.delete("/DeleteR/:id", async (req, res) => {
    try {
        const resume = await Resume.findById({ _id: req.params.id })
        if (!resume) {
            return res.status(404).json({ message: "Resume not found or unauthorized" });
        }

        // Delete thumbnaillink and profilePreviewUrl images from uploads folder
        const uploadsFolder = path.join(__dirname, '..', 'uploads');
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        if (resume.thumbnaillink) {
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnaillink));
            if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }

        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
            if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }

        const Deleted = await Resume.findOneAndDelete({
            _id: req.params.id,
            userID: req.user._id,
        })
        if (Deleted)
            return res.json({ Message: 'Resume Deleted SuccessFully' })

    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})


module.exports = router