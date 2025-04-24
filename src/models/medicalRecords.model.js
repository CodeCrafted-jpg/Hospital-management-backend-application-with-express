import mongoose, {Schema} from "mongoose";
const MedicalRecordsShema=new Schema(
    {
    
        pataintId:{
            type:Schema.Types.ObjectId,
           ref:"Pataint"
        },
        examinedAt:{
            type:Date
        },
        diagnosedWith:{
            type:String
        }
        
        
    },
    {
        timestamps:true
    }
)

export const MedicalRecords=mongoose.model("MedicalRecord",MedicalRecordsShema)






/*
patientsId objectId patients
examinedAt Date
probleam string
description string
createdAt Date
updatedAt Date
*/