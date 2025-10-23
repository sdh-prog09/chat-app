const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const User = require("../models/User");




//register:
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body
    try {
            // 🔍 Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({username, email, password: hashedPassword})
        // res.status(201).json({message: "User registered successfully"})

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            username: user.username,
            userId: user._id
        })
    }
    catch (error) {
        console.error("Registration Error:", error); // 🔍 Log the actual error
        res.status(400).json({ message: "user already exist or invalid data"})
    }
})

//login:
router.post("/login", async (req, res) => {
    const { email, password } = req.body 

    try {
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: "wrong email"}) 

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ 
            token, 
            username: user.username, 
            userId: user._id });
    }
    catch (error) {
        res.status(500).json({ error: "Lgin failed" })
    }
})

module.exports = router;