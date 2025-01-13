const express = require("express");
const {Team , Attendance} = require("../models/User")
const { register, uploadMiddleware , getUserDetails  } = require("../controllers/Auth");

const router = express.Router();

router.post("/register", uploadMiddleware, register);

router.get("/teams/:teamId", getUserDetails);

router.get("/teams", async (req, res) => {
    try {
      const teams = await Team.find().exec(); 
      if (teams.length === 0) {
        return res.status(404).json({ message: 'No teams found' });
      }
      res.status(200).json(teams); 
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
});

// Route to update attendance status
router.put('/teams/:teamId/present', async (req, res) => {
  const { teamId } = req.params;
  const { isPresented } = req.body;

  try {
      const team = await Team.findOneAndUpdate(
          { teamId: teamId },
          { $set: { isPresented: isPresented } },
          { new: true } // Return the updated document
      );

      if (!team) {
          return res.status(404).json({ message: 'Team not found' });
      }

      res.status(200).json({ message: 'Attendance updated', team });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});


router.get('/attendance', async (req, res) => {
  try {
    const attendances = await Attendance.find().exec();
    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update attendance for a specific team
router.put('/attendance/:teamId', async (req, res) => {
  const { teamId } = req.params;
  const { isPresented } = req.body;

  try {
    const updatedAttendance = await Attendance.findOneAndUpdate(
      { teamId: parseInt(teamId) },
      { isPresented: isPresented },
      { upsert: true, new: true }
    );

    res.status(200).json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;
