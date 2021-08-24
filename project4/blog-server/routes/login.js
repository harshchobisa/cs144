var createError = require('http-errors');
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const { getPost } = require('../models/login');
let login_model = require('../models/login');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('login', { redirect: req.query.redirect })
});

router.post('/', async (req, res, next) => {
  console.log(req.body.username);
  if (req.body.username == null || req.body.password == null || req.body.username == "" || req.body.password == "") {
    res.status(401);
    res.render('login', { redirect: req.body.redirect })
    return;
  }
  try {
    user = await login_model.findUser(req.body.username)
  } catch (error) {
    throw new Error("cannot find user");
  }

  if (user.length == 0)
  {
    res.status(401);
    res.render('login', { redirect: req.body.redirect })
    return;
  }

  try {
    var match = await bcrypt.compare(req.body.password, user[0].password);
  } catch (error) {
    throw new Error("error comparing password");
  }

  if (match == false)
  {
    res.status(401);
    res.render('login', { redirect: req.body.redirect })
    return;
  }

  // cookieHeader = {
  //   "alg": "HS256",
  //   "typ": "JWT"
  // };

  jwtKey = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c"
  cookie = jwt.sign({
      'usr': req.body.username 
  }, jwtKey, { expiresIn: '2h' , algorithm: 'HS256'});

  res.cookie("jwt", cookie)

  if (req.body.redirect != null && req.body.redirect != "" )
  {
    console.log(req.body.redirect);
    res.redirect(302, req.body.redirect);
    return;
  }
  else
  {
    res.status(200);
    res.send('authentication succesful');
  }
});



module.exports = router;
