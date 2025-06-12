import { config } from "dotenv";
import process from "process";

config();

export const { PORT, MONGODB_URI, NODE_ENV,EMAIL_PASS, EMAIL_USER, RECEIVER_EMAIL } = process.env;