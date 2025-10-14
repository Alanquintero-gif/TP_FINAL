import transporter from "../config/mailer.config.js"
import UserRepository from "../repositories/user.repository.js"
import { ServerError } from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import ENVIRONMENT from "../config/environment.config.js"
import { randomBytes, createHash } from "node:crypto";


const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

function buildResetUrl(token) {
  return `${ENVIRONMENT.FRONT_RESET_PASSWORD_URL}?token=${token}`;
}


class AuthService {
    static async register(username, password, email) {

        

        const user_found = await UserRepository.getByEmail(email)
        if (user_found) {
            throw new ServerError(400, 'Email ya en uso')
        }

        const password_hashed = await bcrypt.hash(password, 12)

        const user_created = await UserRepository.createUser(username, email, password_hashed)
        const verification_token = jwt.sign(
            {
                email: email,
                user_id: user_created._id
            },
            ENVIRONMENT.JWT_SECRET_KEY
        )
        await transporter.sendMail({
            from: 'ahptpgh@gmail.com',
            to: email,
            subject: 'Verificacion de correo electronico',
            html: `
            <h1>Hola!</h1>
            <p>Este es un mail de verificacion</p>
            <a href='${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-email/${verification_token}'>Verificar email</a>`
            
        })
    }

    static async verifyEmail(verification_token){
        try{
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY)

            await UserRepository.updateById(
                payload.user_id, 
                {
                    verified_email: true
                }
            )

            return 

        }
        catch(error){
            if(error instanceof jwt.JsonWebTokenError){
                throw new  ServerError(400, 'Token invalido')
            }
            throw error
        }
    }

    static async login(email, password){


        const user = await UserRepository.getByEmail(email)
        if(!user){
            throw new ServerError(404, 'Email no registrado')
        }
        if(user.verified_email === false){
            throw new ServerError(401, 'Email no verificado')
        }
        const is_same_password = await bcrypt.compare(password, user.password)
        if(!is_same_password){
            throw new ServerError(401, 'Contraseña incorrecta')
        }
        const authorization_token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            }
        )

        return {
            authorization_token
        }

    }

    static async forgotPassword(email) {
    if (!email) return;

    const user = await UserRepository.getByEmail(email);
    if (!user) return;

    const rawToken = randomBytes(TOKEN_BYTES).toString("hex");
    const hashedToken = createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await UserRepository.setResetToken(user._id, hashedToken, expiresAt);

    const resetUrl = buildResetUrl(rawToken);
    await transporter.sendMail({
      from: "ahptpgh@gmail.com",
      to: user.email,
      subject: "Cambio de contraseña",
      html: `
        <p>Hola ${user.name || ""},</p>
        <p>Para cambiar tu contraseña, selecciona el link de abajo:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Este link expira en una hora. Si no querés modificar tu contraseña, podés ignorar este mail.</p>
      `,
    });
  }

  static async validateResetToken(token) {
    if (!token) return false;
    const hashed = createHash("sha256").update(token).digest("hex");
    const user = await UserRepository.findByValidResetToken(hashed);
    return !!user;
  }

  static async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      const err = new Error("Token and password are required");
      err.status = 400;
      throw err;
    }

    const hashed = createHash("sha256").update(token).digest("hex");
    const user = await UserRepository.findByValidResetToken(hashed);
    if (!user) {
      const err = new Error("Invalid or expired token");
      err.status = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await UserRepository.updatePasswordAndClearToken(user._id, passwordHash);
  }
}

export default AuthService