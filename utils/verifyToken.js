const jwt = require('jsonwebtoken')


const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json(err.message)

        req.user = user
        next()
    })
}


const verifyTokenAndAuthorization = async (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

const verifyTokenAndAdmin = async (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

module.exports = { authenticateToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }
