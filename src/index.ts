import 'reflect-metadata';

import express, { Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";


import { AppDataSource } from "./infrastructure/config/dataSource.js";
import logger from "./infrastructure/logger/logger.js";
import { env } from "./infrastructure/config/config.js";
import { apiRoutes } from "./api/controllers/apiRoutes.js";
import { limiter } from "./api/middleware/rate.limiter.js";

AppDataSource.initialize()
  .then(() => {
    const app = express();
    dotenv.config();

    const PORT = env.port;

    app.use(express.json());

    app.use(limiter);
    // Setup Logger
    app.use(
      morgan("combined", {
        stream: { write: (message: string) => logger.info(message.trim()) },
      }),
    );

    app.get("/", (req: Request, res: Response) => {
      res.send("Servidor Up");
    });

    app.use("/api", apiRoutes());

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error));