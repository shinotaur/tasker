import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import {routeNotFound, errorHandler} from "./middlewares/errorMiddleware.js";
import {dbConnection} from "./utils/index.js";
import routes from "./routes/index.js";


dotenv.config();
dbConnection()

const app = express();

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use(express.static("public"));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use(cors({
  origin: ["http://localhost:3000", "https://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,}))

app.use("/api", routes );

app.use(routeNotFound);
app.use(errorHandler);


