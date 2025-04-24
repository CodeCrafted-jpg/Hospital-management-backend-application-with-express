import { MedicalRecords } from "../models/medicalRecords.model.js";
import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { Pataint } from "../models/pataint.model.js";

const createMedicalRecord=asyncHandler(async(req,res)=>{
const{examinedAt,diagnosedWith}=req.body
if(!(examinedAt,diagnosedWith)){
    throw new ApiError(402,"All Fields are required")
}
try {
    const newRecords=await MedicalRecords.create({
        pataintId:req.pataint._id,
        examinedAt,
        diagnosedWith
    })
    const record=await MedicalRecords.findById(newRecords._id)
    if(!record){
        throw new ApiError(404,"Medical Record not found")
    }
    return res.status(200)
    .json(new ApiResponse(202,record,"Medical Record created successfully"))
    
} catch (error) {
    throw new ApiError(500,"Server Issue!")
}
})



const getRecordByPataintName=asyncHandler(async(req,res)=>{
const {name}=req.params
if(!name){
    throw new ApiError(402,"Name is required")
}
const pataint= await Pataint.findOne({fullName:name})
if(!pataint){
 throw new ApiError(404,"pataint not found")
}
const pataintId=({pataintId:pataint._id})
console.log(pataintId);


const record=await MedicalRecords.find(pataintId)
if(!record){
    throw new ApiError(404,"No records found")
}

return res.status(200)
.json(new ApiResponse(202,record,"Pataint's medical records fetched"))

})







export {
    createMedicalRecord,
    getRecordByPataintName
}