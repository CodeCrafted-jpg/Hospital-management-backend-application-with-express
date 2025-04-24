import { Router } from "express";
import { verifyJWT } from "../middlewires/auth.middlewire.js";
import { createMedicalRecord,
    getRecordByPataintName
 } from "../controller/medicalRecoerds.controller.js";


const router = Router()
router.route("/cteateRecord").post(verifyJWT,createMedicalRecord)
router.route("/getRecordBy/:name").get(verifyJWT,getRecordByPataintName)

export default router