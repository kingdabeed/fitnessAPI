const express = require("express");
const router = express.Router();
const auth = require("../auth");
const workoutController = require("../controllers/workout");

router.use(auth.verify);

router.post("/", workoutController.addWorkout);
router.get("/", workoutController.getWorkouts);
router.put("/:id", workoutController.updateWorkout);
router.delete("/:id", workoutController.deleteWorkout);

module.exports = router;