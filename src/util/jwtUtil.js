import jwt from 'jsonwebtoken';

const JWT_TOKEN_SECRET = 'khangdeptraithucsu';

export const generateToken = (payload, options) => new Promise((resolve, reject) => {
  jwt.sign(payload, JWT_TOKEN_SECRET, options || { noTimestamp: true }, (err, token) => {
    if (err) {
      reject(err);
    } else {
      resolve(token);
    }
  });
});

export const verifyToken = token => new Promise((resolve, reject) => {
  jwt.verify(token, JWT_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
});
