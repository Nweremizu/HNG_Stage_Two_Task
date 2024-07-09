"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const org_1 = __importDefault(require("./routes/org"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    // send a html response with styling and it should be centered in the middle of the page
    res.send(`
    <html>
    <head>
    <style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    h1 {
        font-size: 3rem;
    }
    </style>
    </head>
    <body>
    <h1>Welcome to the API</h1>
    </body>
    </html>
    `);
});
app.use("/auth", auth_1.default);
app.use("/api/users", user_1.default);
app.use("/api/organisations", org_1.default);
exports.default = app;
