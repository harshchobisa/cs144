const { request } = require('express');
let client = require('../db');

function getAllPosts(starting_num, username, callback) {
    var posts = client.db('BlogServer').collection('Posts');
    req = {$and: [{postid: {$gte: starting_num}}, {username: username}]}
    posts.find(req).toArray((err, docs) => {
        callback(err, docs);
    });
}

function getPost(postid, username, callback) {
    var posts = client.db('BlogServer').collection('Posts');
    postid = parseInt(postid);
    req = {$and: [{postid: postid}, {username: username}]}
    posts.find(req).toArray((err, docs) => {
        callback(err, docs);
    });
}

async function deletePost(postid, username) {
    var posts = client.db('BlogServer').collection('Posts');
    postid = parseInt(postid);
    req = {$and: [{postid: postid}, {username: username}]}

    try {
        result = await posts.deleteOne(req);
        if (result.deletedCount == 1)
        {
            return true;
        }
        else
        {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function insertPost(postid, username, title, body) {
    var posts = client.db('BlogServer').collection('Posts');
    var users = client.db('BlogServer').collection('Users');

    postid = parseInt(postid);
    req = {username: username};

    try {
        result = await users.find(req).toArray();
        maxid = result[0].maxid;
        postToInsert = {postid: maxid + 1, username: username,  created: Date.now() , modified: Date.now(), title: title, body: body}
        result = await posts.insertOne(postToInsert);
        
        if (result.insertedCount != 1)
        {
            return null;
        }

        filter = { username: username }
	    options = { upsert: false };
	    updateDoc = {
	      $set: {
	        maxid:
	          maxid + 1,
	      },
	    };

	    result = await users.updateOne(filter, updateDoc, options);

        return postToInsert;
        
    } catch (error) {
        console.log(error)
        return null;
    }
}

async function updatePost(postid, username, title, body) {
    var posts = client.db('BlogServer').collection('Posts');

    postid = parseInt(postid);

    try {

        filter = {$and: [{postid: postid}, {username: username}]}
	    options = { upsert: false };
        updatedTime = Date.now(),
	    updateDoc = {
	      $set: {
            modified:
                updatedTime,
            body:
                body,
            title:
                title
	      },
	    };
	    result = await posts.updateOne(filter, updateDoc, options);

        if (result.modifiedCount == 0)
        {
            return null;
        }

        return updatedTime;
        
    } catch (error) {
        console.log(error)
        return null;
    }
}

module.exports = {
    getAllPosts,
    getPost,
    deletePost,
    insertPost,
    updatePost
};
