const blacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const redis = require("../config/cache");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            success: "false",
            message: "token not provided"
        })
    };

    const isTokenBlacklisted = await redis.get(token);

    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "token is invalid"
        })
    };

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: "false",
            message: "invalid token"
        })
    };
};


module.exports = authUser;