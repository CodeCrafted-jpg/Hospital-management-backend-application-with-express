import mongoose, {Schema} from "mongoose";
const doctorShema= new Schema(
  { 
     name:{
           type:String,
           required:true,
   },
   salary:{
        type:Number,
        required:true
   },
    qualification:{
         type:String,
        required:true
   },
   experienceInYears:{
    type:Number,
    required:true,
   },
   
     doctor_photo:{
        type:String,
        required:true

     }
   

  },
  {
    timestamps: true
}
)




export const Doctor=mongoose.model("Doctor",doctorShema)





/*
name:{} string
salary string
qualification string
experienceInYears number*/