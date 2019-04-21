const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.clientID);
const User = require("../models/User");

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.clientID
  });

  let tokenEmail
  try {
    const payload = ticket.getPayload();
     tokenEmail = payload["email"];
    if(!tokenEmail) throw new Error('muse be  logged in')
    
  } catch (error) {
    
  }

  user = await User.findOne({ email: tokenEmail });
  if (user) return user;
  const { email, name, picture } = payload;
  user = await User.create({ email, name, picture });

  return user;
}

module.exports = verify;
