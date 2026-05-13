import mongoose from "mongoose";
import dns from "node:dns";
import { DB_NAME } from "../constants.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const buildMongoUri = (mongoUri) => {
  const trimmedUri = mongoUri.trim();
  const queryStart = trimmedUri.indexOf("?");
  const uriWithoutQuery =
    queryStart === -1 ? trimmedUri : trimmedUri.slice(0, queryStart);
  const query = queryStart === -1 ? "" : trimmedUri.slice(queryStart);
  const hostStart = uriWithoutQuery.indexOf("://") + 3;
  const pathStart = uriWithoutQuery.indexOf("/", hostStart);

  if (pathStart !== -1 && uriWithoutQuery.slice(pathStart + 1)) {
    return trimmedUri;
  }

  const uriHostPart =
    pathStart === -1 ? uriWithoutQuery : uriWithoutQuery.slice(0, pathStart);

  return `${uriHostPart}/${DB_NAME}${query}`;
};

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing from the .env file");
    }

    const connectionInstance = await mongoose.connect(buildMongoUri(mongoUri), {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `\n MongoDB connected !! DB Host: ${connectionInstance.connection.host} \n`
    );
  } catch (error) {
    console.log("Error connecting to database", error.message);

    if (error.name === "MongooseServerSelectionError") {
      console.log(
        "Atlas hint: add your current IP address in MongoDB Atlas > Network Access, then try again."
      );
    }

    if (error.code === "ETIMEOUT" && error.syscall === "querySrv") {
      console.log(
        "DNS hint: your network could not resolve the Atlas SRV record. Try another network/DNS, or use Atlas' standard connection string."
      );
    }

    if (error.code === "ETIMEOUT" && error.syscall === "queryTxt") {
      console.log(
        "DNS hint: your network could not resolve the Atlas TXT record. Use Atlas' standard mongodb:// connection string if this keeps happening."
      );
    }

    process.exit(1);
  }
};
