import jwt from "jsonwebtoken"

const SECRET = process.env["JWT_SECRET"]!

export function signToken(user: any) {
  return jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: "7d" }
  )
}

