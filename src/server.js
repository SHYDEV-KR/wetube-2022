import express from "express";

const PORT = 4000;

const app = express();

const handleHome = (req, res) => {
    return res.send("Welcome home!");
};

app.get("/", handleHome);

const handleLogin = (req, res) => {
    return res.send("This is the Login Page!");
};

app.get("/login", handleLogin);

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);