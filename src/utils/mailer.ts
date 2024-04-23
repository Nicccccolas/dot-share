import transport from "@/config/transport";
import config from "@/config/config";

export class MailService {
  constructor() {}

  async sendEmail(to: string, subject: string, text: string) {
    const message = { from: config.email.from, to, subject, text };
    await transport.sendMail(message);
  }
}
