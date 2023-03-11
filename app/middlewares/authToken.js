const jwt = require('jsonwebtoken');

function authToken(req, res, next) {
  const auth = req.get('Authorization');

  // format: Bearer Token (get the token from the auth header)
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(400).json({ error: 'Missing Token' });

  // verify the token gotten
  jwt.verify(token, process.env.API_SECRET, (err, field) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    // set request var and move to next middleware
    req.email = field.email;
    req.token = token;
    next();
  });
}
module.exports = authToken;
