const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client("714415920029-kfb0a99k7pjj2b3e98gmt21bipa0voth.apps.googleusercontent.com");
const User = require("../models/User");

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: "714415920029-kfb0a99k7pjj2b3e98gmt21bipa0voth.apps.googleusercontent.com"
  });
  let tokenEmail, payload
  try {
     payload = ticket.getPayload();
     tokenEmail = payload["email"];
    if(!tokenEmail) throw new Error('muse be  logged in')
  } catch (error) {
    console.log(error, "error")
  }

 let user = await User.findOne({ email: tokenEmail });
 console.log(user, "before")
  if (user !== null) return user;

  const { email, name, picture } = payload;
  console.log(user, "user", payload)

  user = await User.create({ email, name, picture });

  return user;
}

module.exports = verify;
