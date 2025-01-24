import fs from "fs";
import { IResponseData } from "../global/entities";

class HandleError extends Error {
    public error: Partial<IResponseData<any>>;

    constructor(err: Partial<IResponseData<any>>) {
        super(err.message);
        this.error = err;



        // Attempt to parse stack safely
        const errorFilePath = this.extractFilePathFromStack();

        this.error.description = `${this.error.description ?? this.message}-Reference:${
            process.env.NODE_ENV === "development" ? errorFilePath : ""
        }`;

        this.error.stack = process.env.NODE_ENV === "development" ? this.stack : undefined;
        // Capture the error stack trace
        Error.captureStackTrace(this, this.constructor);
    }

    private extractFilePathFromStack(): string | undefined {
        if (!this.stack) return undefined;

        try {
            // Extract the first file path from the stack trace
            const stackLines = this.stack.split("\n");
            const filePathLine = stackLines.find((line) => line.includes("("));
            return filePathLine ? filePathLine.trim() : undefined;
        } catch (error) {
            console.error("Error parsing stack trace:", error);
            return undefined;
        }
    }

    public saveLogs() {
        const logsDir = "logs";
        try {
            // Ensure logs directory exists
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir);
            }
        } catch (error) {
            console.error("Error creating logs directory:", error);
        }

        const date = new Date();
        const data = {
            date,
            ...this.error,
        };

        try {
            const logFileName = `logs/${date.toISOString().split("T")[0]}-Time-${date
                .getSeconds()
                .toString()
                .padStart(2, "0")}sec+${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}min+${date
                .getHours()
                .toString()
                .padStart(2, "0")}hrs.log`;

            fs.writeFileSync(logFileName, JSON.stringify(data, null, 2), "utf-8");
        } catch (error) {
            console.error("Error writing log file:", error);
        }
    }
}

export default HandleError;
