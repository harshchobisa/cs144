var createError = require('http-errors');
var commonmark = require('commonmark');
var express = require('express');
const { getPost } = require('../models/api');
let api = require('../models/api');
var router = express.Router();

/* GET users listing. */
router.get('/:username', (req, res, next) => {
  if (req.query.start == null)
  {
    start = 1;
  }
  else
  {
    start = parseInt(req.query.start);
  }
  api.getAllPosts(start, req.params.username, (err, docs) => {
    if (docs.length == 0)
    {
      res.status(404);
      res.send('Unable to find specified username or postid');
      return;
    }
    else
    { 
      // console.log(docs)
      next = false;
      if (docs.length > 5){
        next = true;
      }
      docs = docs.slice(0, 5);
      for (i = 0; i < docs.length; i++)
      {
        docs[i].title = parse(docs[i].title)
        docs[i].body = parse(docs[i].body)
      }      
      res.render('fivePosts', {posts: docs, username: req.params.username, postid: start, next: next})
    }
  });
});

router.get('/:username/:postid', (req, res, next) => {
  api.getPost(req.params.postid, req.params.username, (err, docs) => {
    if (docs.length == 0 )
    {
      res.status(404);
      res.send('Unable to find specified username or postid');
      return;
    }
    else
    { 
      title = parse(docs[0].title);
      body = parse(docs[0].body);
      res.render('onePost', { title: title, body: body, username: req.params.username, postid: req.params.postid})
    }
  });
});

module.exports = router;

function parse(toParse)
{
  var reader = new commonmark.Parser();
  var writer = new commonmark.HtmlRenderer();
  var parsed = reader.parse(toParse); // parsed is a 'Node' tree
  // transform parsed if you like...
  var result = writer.render(parsed); // result is a String
  return result
}
