import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'
import cors from "@elysiajs/cors";
import { logger } from "@chneau/elysia-logger";
import Database from "./databases/mongodb";
import { helmet } from 'elysia-helmet';
import HandleError from "./errors";
import dotenv from 'dotenv';
dotenv.config();


const PORT = process.env.PORT || 3000

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in the environment');
}


const app = new Elysia()
  .onError(({code ,error, set }) => {
    // console.error('[Global Error Handler]', error)
    set.status = 500
    console.log("[Global Error Handler]",code);
    
    if (code === 'NOT_FOUND') {
      return;
    }
    //  save to logs file
    const ErrorLogsMessage = new HandleError({
      message: 'Internal Server Error',
      type: 'global - error',
      description:  'Internal Server Error',
    })
    ErrorLogsMessage.saveLogs();
    return {
      status: set.status,
      message: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error : error
    }
  })
  .use(cors({methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]}))
  .use(logger())
  .use(helmet())
  .get('/', () => {
    return { message: 'Welcome to Thai Vo API!' }
  })
  .listen(PORT, () => {
    new Database(process.env.MONGODB_URI!).connect().then(() => {
      console.log('🟢 Database connected')
    });
  })

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
