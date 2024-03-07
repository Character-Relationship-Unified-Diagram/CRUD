import "dotenv/config.js";
import { Pool, QueryResult } from "pg";

const URI = process.env.PG_URI;
const pool = new Pool({ connectionString: URI });

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on("error", (err: { message: any; }) => {
    console.error("Unexpected error on idle client: ", err.message);
});

interface QueryFunction {
    (text: string, params: any[], callback?: (err: Error, result: QueryResult<any>) => void): Promise<any>;
}
  
const query: QueryFunction = async (text, params, callback) => {
    try {
    let result; 
        if (callback) {
            result = await pool.query(text, params, callback);
        } else {
            result = await pool.query(text, params);
        }
        return result;
    } catch (error: any) {
        console.error("Error executing query: ", error.message);
        throw error;
    }
};
  
export { query };
