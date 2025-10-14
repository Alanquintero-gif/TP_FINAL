import AuthService from "../services/auth.service.js"
import { ServerError } from "../utils/customError.utils.js"

class AuthController {
    static async register(request, response) {
        try {

            const {
                username, 
                email, 
                password
            } = request.body
            console.log(request.body)
   if(!username){
                throw new ServerError(
                    400, 
                    'Debes enviar un nombre de usuario valido'
                )
            }
            else if(!email || !String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
                throw new ServerError(
                    400, 
                    'Debes enviar un email valido'
                )
            }
            else if(!password || password.length < 8){
                throw new ServerError(
                    400, 
                    'Debes enviar una contraseña valida'
                )
            }
            await AuthService.register(username, password, email) 

            response.json({
                ok: true,
                status: 200,
                message: 'Usuario registrado correctamente'

            })
        }
        catch (error) {
            console.log(error)
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }

    }
    static async login(request, response) {
        try{
            const {email, password} = request.body


            const { authorization_token } = await AuthService.login(email, password)
            return response.json({
                ok: true,
                message: 'Logueado con exito',
                status: 200,
                data: {
                    authorization_token: authorization_token
                }
            })
        }
        catch (error) {
            console.log(error)
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }
    }

    static async verifyEmail(request, response) {
        try{
            const {verification_token} = request.params
            await AuthService.verifyEmail(verification_token)

            return response.json({
                ok: true, 
                status: 200,
                message: 'Usuario validado'
            })
        } 
        catch (error) {
            console.log(error)
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }
    }
    static async forgotPassword(req, res) {
    try {
      const { email } = req.body || {};
      await AuthService.forgotPassword(email);
      return res.json({
        ok: true,
        status: 200,
        message: "If the email exists, a reset link was sent",
      });
    } catch (error) {
      console.error("[forgotPassword]", error);
      
      return res.json({
        ok: true,
        status: 200,
        message: "If the email exists, a reset link was sent",
      });
    }
  }

  static async validateResetToken(req, res) {
    try {
      const { token } = req.params;
      const valid = await AuthService.validateResetToken(token);
      if (!valid) {
        return res.status(400).json({ valid: false, message: "Invalid or expired token" });
      }
      return res.json({ valid: true });
    } catch (error) {
      console.error("[validateResetToken]", error);
      return res.status(500).json({ valid: false, message: "Server error" });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body || {};
      await AuthService.resetPassword(token, password);
      return res.json({ ok: true, status: 200, message: "Password updated successfully" });
    } catch (error) {
      console.error("[resetPassword]", error);
      return res.status(error.status || 500).json({
        ok: false,
        status: error.status || 500,
        message: error.message || "Server error",
      });
    }
  }


}



export default AuthController   