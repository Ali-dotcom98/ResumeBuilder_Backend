const mongoose = require("mongoose")

const ConnnectDb = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ResumeBuilder')
        console.log("MongoDb is Connected");

    } catch (error) {
        console.log(error);

    }
}

module.exports = { ConnnectDb }