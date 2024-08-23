const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./db')

dotenv.config()

//routes
const authRoutes = require('./routes/auth.js')
const podcastsRoutes = require('./routes/podcast.js')
const userRoutes = require('./routes/user.js')

const app = express()

/** Middlewares */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const corsConfig = {
    credentials: true,
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

app.use(cors(corsConfig))

const port = process.env.PORT || 3000

app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/podcasts", podcastsRoutes)
app.use("/api/user", userRoutes)

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.listen(port, () => {
    console.log(`server running in http://localhost:${port}`)
    connectDB();
})

