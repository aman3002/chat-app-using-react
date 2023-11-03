const connect = require("./connection");

async function create() {
    try {
        const connet = await connect();
        const add = `SHOW TABLES`;

        return new Promise((resolve, reject) => {
            connet.query(add, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const z = result.map(row => row['Tables_in_chat']);
                    resolve(z.length > 0 ? z : false);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

 let send = async () => {
    try {
        const result = await create();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

send();
module.exports = create;
