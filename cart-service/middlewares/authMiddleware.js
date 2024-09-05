const axios = require('axios');

const isUser = async (req, res, next) => {
    let token
  try {
    token = token = req.cookies.jwt

    // Send token to User Service for validation
    const response = await axios.get('http://localhost:8020/api/users/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // If the token is valid, attach the user data to the request
    req.user = response.data.user;
    next();
  } catch (error) {
    console.log(error.message);

    
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = {
    isUser,
};
