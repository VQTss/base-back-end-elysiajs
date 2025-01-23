import fs from 'fs';
import { IResponseData } from '../global/entities';


class HandleError extends Error {
    public error: Partial<IResponseData<any>>;
    constructor(err: Partial<IResponseData<any>>) {
        super(err.message);
        this.error = err;

        const errorFilePath = this.stack!.split(")")[0];

        this.error.description = `${this.error.description ?? this.message
            }-Reference:${process.env.NODE_ENV ? errorFilePath ?? this.stack : ""}`;

        this.error.stack = process.env.NODE_ENV ? undefined : this.stack;
        Error.captureStackTrace(this, this.constructor);
    }

    public saveLogs() {
        const logsDir = "logs";
        let exists = false;
        try {
            exists = fs.existsSync(logsDir);
            if (!exists) {
                fs.mkdirSync(logsDir);
            }
        } catch (error) {
            console.error(error);
        }

        const date = new Date(Date.now());
        const data = {
            date,
            ...this.error,
        };
        fs.writeFile(
            `logs/${date.toJSON().split("T")[0]
            }-Time-${date.getSeconds()}sec+${date.getMinutes()}min+${date.getHours()}hrs.log`,
            JSON.stringify(data),
            "utf-8",
            () => { }
        );
    }
}

export default HandleError;