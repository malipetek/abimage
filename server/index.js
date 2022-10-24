// @ts-check
import { resolve } from "path";
import https from "https";
import websocket from "ws";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import "dotenv/config";
import fs from "fs";
import embeddedApp from "./sub-apps/embedded-app.js";
import publicApp from "./sub-apps/public-app.js";
import vhost from "vhost";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

let root = process.cwd();
let isProd = process.env.NODE_ENV === "production";
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  // console.log('request received', req.path);
  next();
});

app.use(
  "/app/",
  (req, res, next) => {
    // console.log('emb app');
    next();
  },
  embeddedApp
);

app.use(
  "/",
  (req, res, next) => {
    // console.log('public app', req.path);
    next();
  },
  publicApp
);

const httpsServer = https.createServer(app);
const wss = new websocket.Server({ server: httpsServer });
httpsServer.listen(PORT, () => console.log("Listening"));
