const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: 'C:/Users/amang/CODE/chat-app-using-react/backend/config.env' });
console.log(process.env.host,process.env.user,process.env.password,process.env.DATABASE,process.env.port);

async function connect() {
    try {
        const con = await mysql.createConnection({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.DATABASE,
            port: process.env.port,
            auth: "mysql_native_password"
        });

        con.connect();

        console.log("Connected to database");
        return con;
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw error; // Re-throw the error for handling at a higher level
    }
}
console.log(process.env.host,process.env.user,process.env.password,process.env.DATABASE,process.env.port);

module.exports = connect;
