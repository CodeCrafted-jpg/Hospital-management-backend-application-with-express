import { Router } from "express";
import { upload } from "../middlewires/multer.middlewire.js";
import { verifyJWT } from "../middlewires/auth.middlewire.js";
import { register_doctor,getDoctorByName,getAllDoctors} from "../controller/doctor.controller.js";


const router = Router()
router.route("/register-doctorProfile").post(upload.single('doctor_photo'),register_doctor)
router.route("/getDoctorByName/:name").post(verifyJWT,getDoctorByName)
router.route("/getAllDoctor").get(verifyJWT,getAllDoctors)

export default router