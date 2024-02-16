const connect=require("./connection")
const util=require("util")
async function add_data(user,pass){
   let  connet=await connect();
    const add=` INSERT INTO passwords VALUES("${user}","${pass}")`;
    connet.query(add, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("created");
        }
    });
    connet.end()

}
async function add_message(users,user,mess,room,position){
  let  connet=await connect();
   const add=` INSERT INTO ${user} (sender,message,room,position) VALUES("${users}","${mess}","${room}","${position}")`;
   connet.query(add, (err, result) => {
       if (err) {
           console.log(err);
       } else {
           console.log("message_added");
       }
   });
   connet.end()

}
async function getUser(username) {
  try {
      const connection = await connect();
      console.log("why")
      const query = await util.promisify(connection.query).bind(connection);
      const quer = `SELECT * FROM passwords WHERE username = ?`; // Using a placeholder for the username
      const result = await query(quer, [username]); // Pass the username as an array to the query function

      if (result.length > 0) {
          const user = { username: result[0].username, password: result[0].password };
          return user;
      } else {
          return null; // Return null if no user is found
      }
      connection.end()

  } catch (error) {
      throw error;
  }
}

  async function get_data(user,room) {
    try {
      const connection = await connect();
      const query = await util.promisify(connection.query).bind(connection);
      const quer = `SELECT * FROM ${user} WHERE (room=${room} ) `;
      const result = await query(quer);

      if (result.length > 0) {
        const updatedResult = result.map(item => ({ ...item, user }));
        return updatedResult;
      } else {
          return null; // Return null if no user is found
      }
      connection.end()

    } catch (error) {
      throw error;
    }
  }
module.exports={add_data,getUser,add_message,get_data}
