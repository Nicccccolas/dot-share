import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { router } from "./routes";

const app = express();
const PORT = process.env.PORT || 3001;

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

if (process.env.NODE_ENV === "production") {
  app.use(cors(corsOptions));
  /* Set security HTTP headers */
  /* For error ERR_BLOCKED_BY_RESPONSE.NotSameOrigin 200
      https://stackoverflow.com/questions/70752770/helmet-express-err-blocked-by-response-notsameorigin-200
   */
  app.use(helmet({ crossOriginResourcePolicy: false }));
} else {
  app.use(cors());
}

// Accept Json & form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.use(router);

// State of API
app.get("/", ({ res }) => {
  res?.send({
    api: "API Dot Share",
    state: "Up and Running",
    version: "1.0.0",
  });
});

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
