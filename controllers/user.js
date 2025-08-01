const bcrypt = require('bcrypt');
const User = require("../models/User");
const auth = require("../auth");

module.exports.registerUser = (req, res) => {
  const { email, password } = req.body;

  if (!email.includes("@")) {
    return res.status(400).json({ error: "Email invalid" });
  } else if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const newUser = new User({
    email,
    password: bcrypt.hashSync(password, 10)
  });

  newUser.save()
    .then(() => res.status(201).json({ message: "Registered Successfully" }))
    .catch(err => res.status(500).json({ error: "Could not save user" }));
};

module.// controllers/user.js
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate and return the token
      const token = auth.createAccessToken(user);
      console.log("Generated token:", token);
      res.status(200).json({ access: token });
    })
    .catch(err => res.status(500).json({ error: "Server error" }));
};