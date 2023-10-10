const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const err = Error('Token is empty!');
        err.statusCode = 422;
        throw err;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jsonwebtoken.verify(token, 'somekeysecretaddedhereforsecurity');
    } catch (error) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const err = Error('Token Expired or not authorised!');
        err.statusCode = 500;
        throw err;
    }

    req.userId = decodedToken.userId;
    next();
}