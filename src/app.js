import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import healthCheckRourter from "./routes/health.router.js"
import pataintRouter  from "./routes/pataint.route.js"
import doctorRouter from "./routes/doctor.route.js"
import medicalRecordRouter from "./routes/medicalRecord.route.js"

//route declearation
app.use("/api/v2/hleathcheck",healthCheckRourter)
app.use("/api/v2/pataint",pataintRouter)
app.use("/api/v2/doctor",doctorRouter)
app.use("/api/v2/record",medicalRecordRouter)
export { app }