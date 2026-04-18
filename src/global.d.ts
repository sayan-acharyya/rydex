import { Connection } from "mongoose";

declare global {
    // eslint-disable-next-line no-var
    var mongooseConn: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    };
}