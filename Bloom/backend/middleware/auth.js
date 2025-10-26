const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOne({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Autenticación requerida.' });
  }
};

module.exports = auth;