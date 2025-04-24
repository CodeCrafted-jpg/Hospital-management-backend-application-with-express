import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";

const healthCheck=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json (new ApiResponse(202,"App is running in good condition"))
})
export  {healthCheck}