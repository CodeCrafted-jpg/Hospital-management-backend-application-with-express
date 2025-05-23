import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const PataintSchema= new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
     
        address:{
          type:String,
          required: true
        },
        age:{
          type:Number,
          required: true
        },
        gender:{
          type:String,
          required:true
        },
        bloodgroup:{
            type:String
        },
      
        
        photo: {
            type: String, // cloudinary url
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
       
        checkUpHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "MedicalRecords"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

PataintSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

PataintSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
PataintSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
PataintSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Pataint=mongoose.model("Pataint",PataintSchema)