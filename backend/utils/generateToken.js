import jwt from 'jsonwebtoken';

const generateToken = (id, email, activeRole) => {
  return jwt.sign({ id, email, activeRole }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

export default generateToken;
