import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({
        message: 'Auth Token not found'
      });
    }

    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = await User.findById(decoded.id);
    next();

  } catch (_error) {
return res.status(500).json({
        message: 'Invalid Token'
      });
  }
};

export default isAuth;