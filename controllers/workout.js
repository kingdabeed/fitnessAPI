const Workout = require("../models/Workout");
const mongoose = require("mongoose");

exports.addWorkout = (req, res) => {
  const { name, duration, status } = req.body;
  const userId = req.user.id;

  if (!name || !duration) {
    return res.status(400).json({ error: "Name and duration are required" });
  }

  const workout = new Workout({
    name,
    duration,
    status: status || "incomplete",
    user: userId
  });

  workout.save()
    .then(savedWorkout => {
      res.status(201).json(savedWorkout);
    })
    .catch(err => {
      res.status(500).json({ error: "Could not save workout" });
    });
};

exports.getMyWorkouts = (req, res) => {
  const userId = req.user.id;

  Workout.find({ user: userId })
    .then(workouts => {
      res.status(200).json(workouts);
    })
    .catch(err => {
      res.status(500).json({ error: "Could not fetch workouts" });
    });
};

exports.updateWorkout = (req, res) => {
  const { workoutId, name, duration, status } = req.body;
  const userId = req.user.id;

  if (!workoutId) {
    return res.status(400).json({ error: "workoutId is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(400).json({ error: "Invalid workoutId format" });
  }

  if (!name && !duration && !status) {
    return res.status(400).json({ error: "At least one field (name, duration, status) is required to update" });
  }

  Workout.findOne({ _id: workoutId, user: userId })
    .then(workout => {
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (duration) updateData.duration = duration;
      if (status) updateData.status = status;

      Workout.findByIdAndUpdate(workoutId, updateData, { new: true })
        .then(updated => {
          res.status(200).json(updated);
        })
        .catch(err => {
          res.status(500).json({ error: "Could not update workout" });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Server error" });
    });
};

exports.deleteWorkout = (req, res) => {
  const { workoutId } = req.body;
  const userId = req.user.id;

  if (!workoutId) {
    return res.status(400).json({ error: "workoutId is required in body" });
  }

  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(400).json({ error: "Invalid workoutId format" });
  }

  Workout.findOne({ _id: workoutId, user: userId })
    .then(workout => {
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }

      Workout.findByIdAndDelete(workoutId)
        .then(() => {
          res.status(200).json({ message: "Workout deleted successfully" });
        })
        .catch(err => {
          res.status(500).json({ error: "Could not delete workout" });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Server error" });
    });
};

exports.completeWorkoutStatus = (req, res) => {
  const userId = req.user.id;

  Workout.findOneAndUpdate(
    { user: userId, status: "incomplete" },
    { $set: { status: "completed" } },
    { new: true }
  )
  .then(updatedWorkout => {
    if (!updatedWorkout) {
      return res.status(404).json({ message: "No incomplete workouts found" });
    }
    res.status(200).json(updatedWorkout);
  })
  .catch(err => {
    res.status(500).json({ error: "Could not complete workout" });
  });
};