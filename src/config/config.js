import { config } from "dotenv";
import process from "process";

config();

export const { PORT, MONGODB_URI, NODE_ENV } = process.env;