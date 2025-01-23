import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'
import cors from "@elysiajs/cors";
import { logger } from "@chneau/elysia-logger";
import Database from "./databases/mongodb";
const PORT = process.env.PORT || 3000

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: "Thai Vo API Documentation",
        version: "1.0.0",
        description: "A simple API for managing tasks",
      }
    },
    version: "1.0.0"
  }))
  .onError(({ code, error, set }) => {
    console.error('[Global Error Handler]', error)
    set.status = 500
    return {
      status: set.status,
      message: error?.message || 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }
  })
  .use(cors({methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]}))
  .use(logger())
  .listen(PORT, () => {
    new Database(process.env.MONGODB_URI!).connect().then(() => {
      console.log('🟢 Database connected')
    });
  })

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
