const { request } = require('express');
let client = require('../db');

async function findUser(username) {
    try{
        var users = await client.db('BlogServer').collection('Users');
        req =  {username: username};
        user = await users.find(req).toArray();
        return user;
    }
    catch (e)
    {
        console.log(e);
        throw new Error("Error finding user");
    }
}



module.exports = {
    findUser
};
