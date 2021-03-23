const https = require('https');

module.exports = {
    verify(req, res, next){
        if(typeof req.headers['Authorization'] !== undefined){
            var options = {
                hostname: 'dev-r-w2z1tj.us.auth0.com',
                port: 443,
                path: '/userinfo',
                method: 'GET',
                headers: {
                    'Authorization': req.headers['authorization']
                }
            }
    
            https.get(options , (innerRes) => {
                let data = "";
                innerRes.on('data', d => {
                    data += d;
                });
            
                innerRes.on('end', () => {
                    req.user = JSON.parse(data);
                    next();
                });
            })
            .on('error', error => {
                res.send(error);
            })
            .end();
        }
        else{
            res.json({'message': 'Unauthorised'});
        }
    }
}