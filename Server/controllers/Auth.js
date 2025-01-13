const multer = require("multer");
const { User, Team , Counter} = require("../models/User");
const { sendEmail } = require("./MailSender")
const { first, second, track1 , third, forth, m1 , m2 ,  fifth, sixth, seventh, eighth, ninth, tenth, eleventh, twelth, thirteenth, fourteenth, fifteenth, sixteenth, seventeenth, eighteenth, nineteenth, twentieth, twentyFirst, twentySecond } = require("../textFiles/Message");

const storage = multer.memoryStorage() ;
const upload = multer({ storage }) ;

// Middleware to handle file uploads
exports.uploadMiddleware = upload.fields([
    { name: "user1Image", maxCount: 1 },
    { name: "user2Image", maxCount: 1 },
    { name: "paymentScreenshot", maxCount: 1 },
]);

async function getNextTeamId() {
    const counter = await Counter.findOneAndUpdate(
        { name: "teamId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } 
    );
    return counter.seq;
}

exports.register = async (req, res) => {
    try {
        const { user1, user2 , transactionId , track } = req.body;
        const paymentScreenshot = req.files["paymentScreenshot"]?.[0];

        if (!user1) {
            return res.status(400).json({
                success: false,
                message: "At least one user is required to register.",
            });
        }
        if (!transactionId) {
            return res.status(400).json({
                success: false,
                message: "Transaction ID is required.",
            });
        }
        if (!paymentScreenshot) {
            return res.status(400).json({
                success: false,
                message: "Payment screenshot is required.",
            });
        }
        if (!track || !["Novice", "Expert"].includes(track)) {
            return res.status(400).json({
                success: false,
                message: "Valid track ('Novice' or 'Expert') is required.",
            });
        }

        // Parse user data and prepare users array
        const users = [];

        const user1Data = JSON.parse(user1);
        const user1Image = req.files["user1Image"]?.[0];

        if (!user1Image) {
            return res.status(400).json({
                success: false,
                message: "Image for user1 is required.",
            });
        }
        if (!user1Data.phone || isNaN(user1Data.phone)) {
            return res.status(400).json({
                success: false,
                message: "Valid phone number for user1 is required.",
            });
        }
        users.push({
            ...user1Data,
            image: user1Image.buffer.toString("base64"),
        });

        if (user2) {
            const user2Data = JSON.parse(user2);
            const user2Image = req.files["user2Image"]?.[0];

            if (!user2Image) {
                return res.status(400).json({
                    success: false,
                    message: "Image for user2 is required.",
                });
            }
            if (!user2Data.phone || isNaN(user2Data.phone)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid phone number for user2 is required.",
                });
            }
            users.push({
                ...user2Data,
                image: user2Image.buffer.toString("base64"),
            });
        }

        // Check for existing users
        for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: `User with email ${user.email} is already registered.`,
                });
            }
        }

        // Save users and create team
        const userInstances = await User.insertMany(users);

        const isSolo = users.length === 1;
        const teamId = await getNextTeamId();

        const team = await Team.create({
            teamId,
            track,
            type: isSolo ? "solo" : "team",
            users: userInstances,
            transactionId ,
            paymentScreenshot: paymentScreenshot.buffer.toString("base64"),
        });

        // Send emails to all registered users
        for (const user of users) {
            const emailText = `Dear ${user.name}, \n\n${first} \n\n${second}: ${team.teamId} \n${track1}: ${team.track} \n${third}${team.teamId}. ${forth} \n${m1}\n${m2} \n\n${fifth} \n${sixth} \n${seventh} \n${eighth} \n${ninth} \n${tenth} \n${eleventh} \n\n${twelth} \n${thirteenth} \n${fourteenth} \n${fifteenth} \n${sixteenth} \n${seventeenth} \n\n${eighteenth} \n\n${nineteenth} \n${twentieth} \n\n${twentyFirst} \n${twentySecond}`;
            await sendEmail(user.email, `Welcome to AI Nexus - Registration Confirmed`, emailText);
        }

        return res.status(200).json({
            success: true,
            message: isSolo
                ? "You have registered as a solo participant!"
                : "You have registered as a team!",
            team,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An issue occurred, please try again.",
        });
    }
};


exports.getUserDetails = async (req, res) => {
    const { teamId } = req.params;
    try {
        const team = await Team.findOne({ teamId: teamId }).exec();
        
        if (!team) {
        return res.status(404).json({ message: 'Team not found' });
        }

        res.status(200).json(team); 
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};