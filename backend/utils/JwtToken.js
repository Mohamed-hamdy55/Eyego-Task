// create token and saving that in cookies
const jwtToken = (user) => {
    
    // get login token unique in for each login
    const token = user.getJwtToken();
  
    // Options for cookies
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };

    return {
      token:token,
      options:options,
    }
  };
  
  module.exports = jwtToken;