import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ msg: 'No token, access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
        }
        next();
    };
};

export default { auth, authorizeRole };
