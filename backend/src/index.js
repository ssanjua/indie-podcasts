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
app.use(express.json())
const corsConfig = {
    credentials: true,
    origin: true,
};

app.use(cors(corsConfig))
// app.use(morgan('tiny'));
// app.disable('x-powered-by');
// app.use(function (request, response, next) {
//     response.header("Access-Control-Allow-Origin", "*");
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

const port = process.env.PORT || 3000

app.use(express.json())
// app.enable('trust proxy'); // optional, not needed for secure cookies
// app.use(express.session({
//     secret : '123456',
//     key : 'sid',
//     proxy : true, // add this when behind a reverse proxy, if you need secure cookies
//     cookie : {
//         secure : true,
//         maxAge: 5184000000 // 2 months
//     }
// }));

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

