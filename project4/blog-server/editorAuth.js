const jwt = require('jsonwebtoken');
const { use } = require('./routes');
 
function editorAuth(req, res, next) {
    var cookie = req.cookies.jwt;
    const jwt_key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
  
    if(req.method == "POST") {
        res.redirect(302, 'login?redirect=/editor/');
    }

    jwt.verify(cookie, jwt_key, function(err, decoded) { 
        if (err) {
            res.redirect(302, '../login?redirect=/editor/');
        }
        else {
            if(decoded.usr) {
                res.status(200);
                next();
            }
            else {
                res.redirect(302, '../login?redirect=/editor/');
            }
        }
    });
}
 
module.exports = editorAuth;