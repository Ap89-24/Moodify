const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const redis = require("../config/cache");



const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await userModel.findOne({
            $or: [
                {email},
                {username}
            ]
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "Username or email already exists",
            });
        };

        const hash = await bcrypt.hash(password , 10);

        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        const token = jwt.sign({
            id: user._id,
            username: user.username
        } ,
        process.env.JWT_SECRET ,
        {
            expiresIn: "2d",
        });

        res.cookie("token" , token);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering user" + error.message,
        });
    }
};


const loginUser = async (req, res) => {
     try {
        const { email, username ,  password } = req.body;

        const user = await userModel.findOne({
            $or: [
                {email},
                {username}
            ]
        }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        };

        const isPassValid = await bcrypt.compare(password , user.password);

        if (!isPassValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        };

        const token = jwt.sign({
            id: user._id,
            username: user.username
        } , 
        process.env.JWT_SECRET ,
        {
            expiresIn: "2d",
        }
    );

    res.cookie("token" , token);
    
    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
    
     } catch (error) {
            res.status(500).json({
            success: false,
            message: "Error logging in user" + error.message,
        });
     };

};


const getMe = async (req, res) => {
    const user = await userModel.findById(req.user.id);

    return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
};

const logoutUser = async (req, res) => {
    const token = req.cookies.token;

    res.clearCookie("token");

    await redis.set(token , Date.now().toString() , "EX" , 60 * 60);

    return res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
};