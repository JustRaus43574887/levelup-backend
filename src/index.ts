import { ApolloServer } from "apollo-server-express";
import express from "express";
import dotenv from "dotenv-safe";
import path from "path";
import fs from "fs";
import apolloServerConfig from "./utils/apolloServerConfig";
import Mongoose from "mongoose";
import { graphqlUploadExpress } from "graphql-upload";
import cors from "cors";

fs.mkdir(
  path.join("public/uploads/tests/images"),
  { recursive: true },
  (err) => {
    if (err) throw new Error(err.message);
  }
);

fs.mkdir(
  path.join("public/uploads/tests/audio"),
  { recursive: true },
  (err) => {
    if (err) throw new Error(err.message);
  }
);

const dotenvPath =
  process.env.NODE_ENV === "development" ? ".env" : ".env.production";
dotenv.config({ path: dotenvPath });

export const {
  IS_DEVELOP,
  JWT_SECRET,
  MONGO_STRING,
  ADMIN_LOGIN,
  ADMIN_PASS,
  CLIENT_DOMAIN,
} = process.env as {
  [key: string]: string;
};

const port = process.env.PORT;

async function startServer() {
  try {
    const server = new ApolloServer(apolloServerConfig);
    await server.start();
    await Mongoose.connect(MONGO_STRING);

    const app = express();

    app.use(graphqlUploadExpress());
    app.use(cors());
    app.use(
      "/public",
      express.static(path.resolve("public"), {
        setHeaders: function setHeaders(res) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET");
          res.header("Access-Control-Allow-Headers", "Content-Type");
        },
      })
    );

    server.applyMiddleware({ app });

    await new Promise<void>((resolve) => app.listen({ port }, resolve));
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  } catch (e) {
    console.error(e);
  }
}

startServer();
