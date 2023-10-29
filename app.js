require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");
const authenticate = require("./middlewares/authenticate");
const xss = require("xss");
const cors = require("cors");
const helmet = require("helmet");
const ratelimit = require("express-rate-limit");
const uploadRouter = require("./routes/upload");
const authRouter = require("./routes/auth");
const prodRouter = require("./routes/products");
const revRouter = require("./routes/reviews");
const orderRouter = require("./routes/order");
const wishRouter = require("./routes/wishlist");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const isAdmin = require("./middlewares/adminmiddleware");
const cookieParser = require("cookie-parser");

const app = express();
app.set("trust proxy", 1);
app.use(
  ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
const html = xss('<script>alert("xss");</script>');
app.set("view engine", "ejs");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", prodRouter);
app.use("/api/v1/reviews", revRouter);
app.use("/api/v1/order", authenticate, orderRouter);
app.use("/api/v1/wishlist", authenticate, wishRouter);
app.use("/api/v1/admin", authenticate, isAdmin, adminRouter);
app.use("/api/v1/user", authenticate, userRouter);
app.use("/upload", uploadRouter);
app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`app listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
