var createError = require('http-errors');
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
let api = require('../models/api');

var router = express.Router();

router.all('/posts', async (req, res, next) => {
    cookie = req.cookies.jwt

    if (cookie == null)
    {
        res.status(401);
        res.send("user not authorized");
        return;
    }
    jwtKey = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c"
    try {
        payload = await jwt.verify(cookie, jwtKey)
    }
    catch (error)
    {
        res.status(401);
        res.send("invalid cookie");
        return;
    }

    console.log(payload.usr);
    console.log(req.query.username )

    if (payload.usr != req.query.username && payload.usr != req.body.username)
    {
        res.status(401);
        res.send("user not authorized");
        return;
    }

    next();
  
});

router.get('/posts', (req, res, next) => {
    console.log("REACHED GET");
    console.log(req.query.username)
    if (req.query.username == null || req.query.username == "") {
        res.status(400);
        res.send("bad request")
        return;
    }
    if (req.query.postid == null || req.query.postid == "") {
        api.getAllPosts(0, req.query.username, (err, posts) => {
            res.set('Content-Type', 'application/json');
            res.json(posts);
          });
    }
    else {
        api.getPost(req.query.postid, req.query.username, (err, post) => {
            if (post.length == 0 )
            {
                res.status(404);
                res.send('Unable to find specified username or postid');
                return;
            }
            else
            { 
                res.status(200);
                res.set('Content-Type', 'application/json');
                res.json(post[0]);
            }
          });
    }
});

router.delete('/posts', async (req, res, next) => {
    if (req.query.username == null || req.query.username == "" || req.query.postid == null || req.query.postid == "") {
        res.status(400);
        res.send("bad request")
        return;
    }

    try {
        deleted = await api.deletePost(req.query.postid, req.query.username);
    } catch (error) {
        console.log(error);
        res.status(404);
        return;
    }
    
    if (deleted){
        res.status(204);
        res.end();
    }
    else{
        res.status(404);
        res.send('unable to find post');
    }

  
});

router.post('/posts', async (req, res, next) => {
    
    postid = parseInt(req.body.postid);
    console.log(postid)

    if (req.body.username == null || req.body.username == "" || postid == null || postid.toString() == "NaN") {
        console.log(req.body.username, postid)
        console.log("one")

        res.status(400);
        res.send("bad request")
        return;
    }
    if (req.body.title == null || req.body.body == null) {
        console.log("two")

        res.status(400);
        res.send("bad request")
        return;
    }


    if (postid == 0){
        try {
            result = await api.insertPost(postid, req.body.username, req.body.title, req.body.body)
            if (result == null)
            {
                res.status(404);
                return;
            }
            res.status(201);
            res.set('Content-Type', 'application/json');
            delete result._id
            delete result.title
            delete result.username
            delete result.body
            res.json(result)
        } catch (error) {
            console.log(error);
        }
    }
    else{
        try {
            result = await api.updatePost(postid, req.body.username, req.body.title, req.body.body)
            if (result == null)
            {
                res.status(404);
                res.end();
                return;
            }
            res.status(200);
            res.set('Content-Type', 'application/json');
            res.json({modified: result})
        } catch (error) {
            console.log(error);
        }
    }

  
});


router.post('/', async (req, res, next) => {
  console.log(req.body.username);

});



module.exports = router;
