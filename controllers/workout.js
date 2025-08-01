const Workout = require("../models/Workout");

exports.addWorkout = (req, res) => {
  const { name, duration, status } = req.body;
  const userId = req.user.id;

  const workout = new Workout({
    name,
    duration,
    status: status || "incomplete",
    user: userId
  });

  workout.save()
    .then(workout => res.status(201).json(workout))
    .catch(err => res.status(500).json({ error: "Could not save workout" }));
};

exports.getWorkouts = (req, res) => {
  Workout.find({ user: req.user.id })
    .then(workouts => res.status(200).json(workouts))
    .catch(err => res.status(500).json({ error: "Could not fetch workouts" }));
};

exports.updateWorkout = (req, res) => {
  const { id } = req.params;
  Workout.findByIdAndUpdate(id, req.body, { new: true })
    .then(workout => {
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.status(200).json(workout);
    })
    .catch(err => {
      console.error("Update error:", err);
      res.status(500).json({ error: "Could not update workout" });
    });
};

exports.deleteWorkout = (req, res) => {
  const { id } = req.params;
  Workout.findByIdAndDelete(id)
    .then(workout => {
      if (!workout) return res.status(404).json({ message: "Workout not found" });
      res.status(200).json({ message: "Workout deleted successfully" });
    })
    .catch(err => res.status(500).json({ error: "Could not delete workout" }));
};