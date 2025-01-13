const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true ,
    },
    image: {
        type: String, 
        required: true,
    },
});

const teamSchema = new mongoose.Schema({
    teamId: {
        type: Number, 
        required: true,
        unique: true, 
    },
    track: {
        type: String, 
        enum: ["Novice", "Expert"], 
        required: true,
    },
    users: {
        type: [userSchema], // Array of users
        required: true,
    },
    type: {
        type: String, // "solo" or "team"
        required: true,
    },
    transactionId: {
        type: String, // Unique identifier for payment
        required: true,
    },
    paymentScreenshot: {
        type: String, // Base64-encoded image of the screenshot
        required: true,
    },
    
});

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
});

const attendanceSchema = new mongoose.Schema({
    teamId: { type: Number, required: true, unique: true },
    isPresented: { type: Boolean, default: false },
});


const User = mongoose.model("User", userSchema);
const Team = mongoose.model("Team", teamSchema);
const Counter = mongoose.model("Counter", counterSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = { User, Team , Counter , Attendance};
