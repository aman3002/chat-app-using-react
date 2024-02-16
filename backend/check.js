const connect = require("./connection");

async function create() {
    try {
        const connection = await connect();
        const query = `select username from passwords`;

        return await new Promise(async(resolve, reject) => {
           await connection.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(result)
                    const tables = result.map(row => row['username']);
                    resolve(tables.length > 0 ? tables : false);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

module.exports=create



