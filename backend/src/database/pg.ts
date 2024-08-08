import { Pool } from "pg";

console.log(process.env.POSTGRES_USER);

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT),
  idleTimeoutMillis: Number(process.env.POSTGRES_IDLE_TIMEOUT),
});

//init create table if needed
export const initTableIfNotExists = async (): Promise<boolean> => {
  let tableCreated: boolean = true;
  try {
    // Check if the table exists
    const tableExistsQuery = `
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = 'tasks'
      `;

    const { rows } = await pool.query(tableExistsQuery);
    const tableExists = rows && rows.length > 0;
    if (!tableExists) {
      // Create the table
      const createTableQuery = `
          CREATE TABLE tasks (
            id SERIAL PRIMARY KEY,
            task TEXT
          );
        `;
      await pool.query(createTableQuery);
      console.log("Table created successfully!");
      tableCreated = true;
    } else {
      console.log("Table already exists.");
    }
  } catch (err) {
    console.error("Error creating table:", err);
    tableCreated = false;
  }
  return tableCreated;
};
