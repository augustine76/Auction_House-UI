import {User,Nft} from "../model/schema.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({ status: false, message: "Token Expired." })
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decodedData.id)
  req.user = await Nft.findById(decodedData.id)
  next()
}

export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    // console.log(req)
    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json({
    //     status: false,
    //     message: `Role: ${req.user.role} is not allowed to access this resource.`
    //   })
    // }
    next()
  }
}