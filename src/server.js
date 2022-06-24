import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.use(logger);

// 라우터 생성

// Home
const globalRouter = express.Router();
const handleHome = (req, res) => res.send("Home");
globalRouter.get("/", handleHome);

// User
const userRouter = express.Router();
const handleEditUser = (req, res) => res.send("Edit User");
userRouter.get("/edit", handleEditUser);

// Video
const videoRouter = express.Router(); // #2
const handleWatchVideo = (req, res) => res.send("Watch Video"); // #4
videoRouter.get("/watch", handleWatchVideo); // #3

// Middlewares
app.use("/", globalRouter);
app.use("/videos", videoRouter); // #1
app.use("/users", userRouter);

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);