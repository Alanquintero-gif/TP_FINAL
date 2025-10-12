import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'ahptpgh@gmail.com'
            ,
            pass: ENVIRONMENT.GMAIL_PASSWORD
        }
    }
)

try {
  const ok = await transporter.verify();
  console.log("[MAILER] SMTP listo:", ok);
} catch (err) {
  console.error("[MAILER] ERROR SMTP:", err);
}

export default transporter