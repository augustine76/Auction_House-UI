
  
// Create Token and saving in cookie

const sendToken = (publicKey, res) => {
  const token = user.getJWTToken()

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  res.status(200).cookie("token", token, options).json({
    success: true,
    publicKey,
    token,
  })
}

export default sendToken