require('dotenv').config();
const jwt = process.env.JWT_SECRET;

export const jwtConstants = {
  secret: jwt,
};
