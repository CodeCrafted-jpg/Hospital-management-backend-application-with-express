import { Router } from "express";
import { registerPataintAccount,
    loginPataintAccount,logoutPataintAccount,changeCurrentPassword,ChangePataintPhoto
 } from "../controller/pataint.controller.js";
import { upload } from "../middlewires/multer.middlewire.js";
import { verifyJWT } from "../middlewires/auth.middlewire.js";

const router = Router()
router.route("/register").post(
upload.single('photo'),registerPataintAccount)




router.route("/login").post(loginPataintAccount)
router.route("/logout").post(verifyJWT,logoutPataintAccount)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/change-photo").post(verifyJWT,upload.single('photo'),ChangePataintPhoto)



 export default router