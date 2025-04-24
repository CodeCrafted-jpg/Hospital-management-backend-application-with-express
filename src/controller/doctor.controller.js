import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Doctor } from "../models/doctor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllDoctors=asyncHandler(async(req,res)=>{
  try {
    const doctor=await Doctor.find()
    if(!doctor){
      throw new ApiError(404,"no doctor found")
    }
    return res.status(200)
    .json(new ApiResponse(201,doctor,"All doctors fetched"))
  } catch (error) {
    throw new ApiError(500,"Server Issue!")
  }
})




const register_doctor= asyncHandler(async(req, res)=>{
    const{name,salary,qualification,experienceInYears}=req.body
    if ([name, salary, qualification, experienceInYears,].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
      }
       try {
         const existedUser = await Doctor.findOne({
             $or: [{ name }],
           });
         
           if (existedUser) {
             throw new ApiError(402, "name already Exixts");
           }
           const photoPath= req.file?.path;
           if(!photoPath){
             throw new ApiError(402,"Photo is reuired")
           }
           console.log("Photo Local Path:", photoPath);
           const uploadPhoto=await uploadOnCloudinary(photoPath)
           if(!uploadPhoto){
             throw new ApiError("Falied to upload photo")
           }
         const newDoctor=await Doctor.create({
             name,
             salary,
             qualification,
             experienceInYears,
             doctor_photo:uploadPhoto.url
         })
         const doctor=await Doctor.findById(newDoctor._id)
 
         return res.status(200)
         .json(new ApiResponse(202,doctor,"Doctor proflile added successfully"))
 
       } catch (error) {
        throw new ApiError(500,error,"Server issue!")
       }
})





const getDoctorByName=asyncHandler(async(req,res)=>{
  const {name}=req.params
  if(!name){
    throw new ApiError(402,"Name is required")
  }
 try {
   const doctor=await Doctor.find({name:name})
   if(!doctor){
     throw new ApiError(404,"Doctor not found")
   }
   return res.status(200)
   .json(new ApiResponse(202,doctor,"Doctor profile found"))
 } catch (error) {
  throw new ApiError(500,error,"Server Issue!")
 }
})










export {
    register_doctor,
    getDoctorByName,
    getAllDoctors
}