const express = require("express");
const router = express.Router();
const auth = require("../auth");
const workoutController = require("../controllers/workout");

router.use(auth.verify);

router.post("/addWorkout", workoutController.addWorkout);
router.get("/getMyWorkouts", workoutController.getMyWorkouts);
router.patch("/updateWorkout", workoutController.updateWorkout);
router.delete("/deleteWorkout", workoutController.deleteWorkout);
router.patch("/completeWorkoutStatus", workoutController.completeWorkoutStatus);

module.exports = router;