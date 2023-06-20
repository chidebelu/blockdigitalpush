import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoute from "./routes/userRoute.js";
import referrerRoute from "./routes/referrer.js";
import planRoute from "./routes/plan.js";
import investmentRoute from "./routes/investment.js";
import sharpRoute from "./routes/sharp.js";
import payment from "./routes/payment.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/referrers", referrerRoute);
app.use("/api/plans", planRoute);
app.use("/api/investments", investmentRoute);
app.use("/api/invest", sharpRoute);
app.use("/api/payment", payment);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
//   );
// }

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// app.use(express.static(path.join(__dirname, "build")));

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started in ${process.env.NODE_ENV} mode`));
