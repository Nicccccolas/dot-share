import nodemailer from "nodemailer";
import config from "@/config/config";
import logger from "@/config/logger";

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configurated the SMTP options in .env",
      ),
    );
}

export class MailService {
  constructor() {}

  async sendEmail(to: string, subject: string, text: string) {
    console.log("DATA: ", {
      to,
      subject,
      text,
    });
    const message = { from: config.email.from, to, subject, text };
    await transport.sendMail(message);
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const subject = "Reset password";

    const resetPasswordUrl = `http://localhost:3000/api/v1/auth/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    await this.sendEmail(to, subject, text);
  }
}

export default { transport };
