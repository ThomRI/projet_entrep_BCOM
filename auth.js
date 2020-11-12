const jwt = require('jsonwebtoken');

function checkToken(req, res) {
    token = req.headers['authorization'];
    if(!token) {
        res.status(401).send({auth: false, message: "No token provided"});
        if(debug) console.log("\tAccess denied : no token provided.");
        return false;
    }

    return jwt.verify(token, process.env.API_KEY, function(err, decoded) {
        if(err) {
            res.status(401).send({auth: false, message: "Failed to authenticate access token"});
            if(debug) console.log("\tAccess denied : failed to authenticate token.");
            return false;
        }

        return true;
    });
}

module.exports = {
    checkToken: checkToken
};