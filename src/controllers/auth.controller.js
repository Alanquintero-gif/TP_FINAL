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
  try {
    const { verification_token } = request.params;
    await AuthService.verifyEmail(verification_token);

    // ✅ HTML de éxito
    return response.status(200).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>Cuenta verificada</title>
        <style>
          body {
            background-color: #121212;
            color: #f0f0f0;
            font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
          }
          .card {
            background-color: #1e1e1e;
            border-radius: 16px;
            padding: 40px 32px;
            max-width: 360px;
            width: 90%;
            box-shadow: 0 18px 48px rgba(0,0,0,0.7);
            text-align: center;
            border: 1px solid rgba(255,255,255,0.07);
          }
          .emoji {
            font-size: 3rem;
            margin-bottom: 12px;
          }
          h1 {
            font-size: 1.4rem;
            font-weight: 600;
            color: #00e676;
            margin: 0 0 12px 0;
          }
          p {
            font-size: 0.95rem;
            line-height: 1.4rem;
            color: #bbb;
            margin: 0 0 24px 0;
          }
          .cta-btn {
            display: inline-block;
            background-color: #00e676;
            color: #121212;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            padding: 12px 20px;
            border-radius: 8px;
            transition: background-color 0.18s ease;
          }
          .cta-btn:hover {
            background-color: #00b35a;
          }
          .hint {
            margin-top: 20px;
            font-size: 0.8rem;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="emoji">✅</div>
          <h1>¡Cuenta verificada!</h1>
          <p>Tu email fue confirmado correctamente. Ya podés iniciar sesión y empezar a chatear.</p>
          <a class="cta-btn" href="https://tp-final-front-gold.vercel.app/login">Ir al inicio de sesión</a>
          <div class="hint">Podés cerrar esta pestaña si ya tenés la app abierta.</div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.log(error);

    // Definimos mensaje y código según el tipo de error
    let statusCode = 500;
    let title = "Error interno";
    let desc = "Ocurrió un problema al validar tu cuenta.";
    let emoji = "⚠️";

    if (error.status === 400 || error.status === 404) {
      statusCode = error.status;
      title = "No pudimos verificar tu cuenta";
      desc = error.message || "El enlace de verificación es inválido o expiró.";
      emoji = "❌";
    }

    // ❌ HTML de error
    return response.status(statusCode).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>Error de verificación</title>
        <style>
          body {
            background-color: #121212;
            color: #f0f0f0;
            font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
          }
          .card {
            background-color: #1e1e1e;
            border-radius: 16px;
            padding: 40px 32px;
            max-width: 360px;
            width: 90%;
            box-shadow: 0 18px 48px rgba(0,0,0,0.7);
            text-align: center;
            border: 1px solid rgba(255,255,255,0.07);
          }
          .emoji {
            font-size: 3rem;
            margin-bottom: 12px;
          }
          h1 {
            font-size: 1.3rem;
            font-weight: 600;
            color: #ff5252;
            margin: 0 0 12px 0;
          }
          p {
            font-size: 0.95rem;
            line-height: 1.4rem;
            color: #bbb;
            margin: 0 0 24px 0;
          }
          .cta-btn {
            display: inline-block;
            background-color: #00e676;
            color: #121212;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            padding: 12px 20px;
            border-radius: 8px;
            transition: background-color 0.18s ease;
          }
          .cta-btn:hover {
            background-color: #00b35a;
          }
          .hint {
            margin-top: 20px;
            font-size: 0.8rem;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="emoji">${emoji}</div>
          <h1>${title}</h1>
          <p>${desc}</p>
          <a class="cta-btn" href="https://tp-final-front-gold.vercel.app/login">Volver al inicio de sesión</a>
          <div class="hint">Si el problema sigue, pedí un nuevo correo de verificación.</div>
        </div>
      </body>
      </html>
    `);
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