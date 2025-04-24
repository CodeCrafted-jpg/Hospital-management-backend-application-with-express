import { ApiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/apiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { Pataint }from "../models/pataint.model.js"

const generateAccessAndRefereshTokens = async(pataintId) =>{
    try {
        const pataint = await Pataint.findById(pataintId)
        const accessToken = pataint.generateAccessToken()
        const refreshToken = pataint.generateRefreshToken()

        pataint.refreshToken = refreshToken
        await pataint.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerPataintAccount = asyncHandler(async (req, res) => {
    const { fullName, address, age, gender, bloodgroup, email, password } = req.body;
    
    if ([fullName, address, age, gender, bloodgroup, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
  
    const existedUser = await Pataint.findOne({
      $or: [{ email }],
    });
  
    if (existedUser) {
      throw new ApiError(402, "Email already Exixts");
    }
  
    const photoLocalPath = req.file?.path;
    console.log("Photo Local Path:", photoLocalPath);  // Check if file path is correct
  
    if (!photoLocalPath) {
      throw new ApiError(402, "Photo is required");
    }
  
    const photo = await uploadOnCloudinary(photoLocalPath);
  
    if (!photo) {
      throw new ApiError(402, "Failed to upload photo");
    }
  
    const pataint = await Pataint.create({
      fullName,
      photo: photo.url,
      email,
      password,
      address,
      age,
      gender,
      bloodgroup,
    });
  
    const createdPataint = await Pataint.findById(pataint._id).select("-password -refreshToken");
  
    if (!createdPataint) {
      throw new ApiError(402, "Pataint Account creation Failed");
    }
  
    return res.status(200).json(new ApiResponse(202, createdPataint,"Account created successfully"));
});
  

const loginPataintAccount=asyncHandler(async (req,res)=>{
    const {fullName,email,password}=req.body
    
    if(!(fullName,email,password)){
        throw new ApiError("fullname,email,password is required")
    }
    const pataint = await Pataint.findOne({
        $or: [{fullName}, {email}]
    })

    if (!pataint) {
        throw new ApiError(404, "Pataint  does not exist")
    }
    
   const isPasswordValid = await pataint.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid account credentials")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(pataint._id)
    const loggedInAccount= await Pataint.findById(pataint._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
   
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                pataint: loggedInAccount, accessToken, refreshToken
            },
            "Account logged In Successfully"
        )
    )

})


const logoutPataintAccount = asyncHandler(async(req, res) => {
  await Pataint.findByIdAndUpdate(
      req.pataint._id,
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "Pataint logged Out"))
})


const changeCurrentPassword = asyncHandler(async(req, res) => {
  const {oldPassword, newPassword} = req.body

  

  const pataint = await Pataint.findById(req.pataint?._id)
  const isPasswordCorrect = await pataint.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password")
  }

  pataint.password = newPassword
  await pataint.save({validateBeforeSave: false})
  console.log(pataint.password)
  return res
  .status(200)
  .json(new ApiResponse(200, "Password changed successfully"))
})



const ChangePataintPhoto = asyncHandler(async(req, res) => {
  const photoLocalPath = req.file?.path

  if (!photoLocalPath) {
      throw new ApiError(400, "photo file is missing")
  }

  //TODO: delete old image - assignment

  const photo = await uploadOnCloudinary(photoLocalPath)

  if (!photo.url) {
      throw new ApiError(400, "Error while uploading on photo")
      
  }

  const pataint = await Pataint.findByIdAndUpdate(
      req.pataint?._id,
      {
          $set:{
              photo:photo.url
          }
      },
      {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(
      new ApiResponse(200, pataint, "Photo image updated successfully")
  )
})







export {registerPataintAccount,
    loginPataintAccount,
    logoutPataintAccount,
    changeCurrentPassword,
    ChangePataintPhoto

}