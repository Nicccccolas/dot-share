import express from "express";
import cors from "cors";
import passport from "passport";
import helmet from "helmet";
import config from "./config/config";
import { router } from "./routes";
import { jwtStrategy } from "./strategies/passport-jwt-strategy";

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// CORS Settings
const whitelist = ["http://localhost:8000"];
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    const originIsAllowed = origin ? whitelist.includes(origin) : false;
    if (originIsAllowed || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Denied by CORS"));
    }
  },
};

if (config.env === "production") {
  app.use(cors(corsOptions));
  /* Set security HTTP headers */
  /* For error ERR_BLOCKED_BY_RESPONSE.NotSameOrigin 200
      https://stackoverflow.com/questions/70752770/helmet-express-err-blocked-by-response-notsameorigin-200
   */
  app.use(helmet({ crossOriginResourcePolicy: false }));
} else {
  app.use(cors());
}

app.use(passport.initialize());
passport.use(jwtStrategy);

// v1 api routes
app.use("/api/v1", router);

// if (config.env === "production") {
// app.use("/v1/auth");
// }

// State of API
app.get("/", ({ res }) => {
  res?.send({
    api: "API Dot Share",
    state: "Up and Running",
    version: "1.0.0",
  });
});

export default app;
