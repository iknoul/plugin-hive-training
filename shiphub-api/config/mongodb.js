import mongoose from "mongoose";
import { config } from "./config.js";
import { logger } from "../libs/logger.js";

export async function connectDatabase() {
    
    const uri = config.mongodbUri;

    await mongoose.connect(uri)

    logger.info('mongoDB connected')

    
}
