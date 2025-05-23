import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynchandler.js"
import jwt from "jsonwebtoken"
import { Pataint } from "../models/pataint.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const pataint = await Pataint.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!pataint) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.pataint = pataint;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})