import * as nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

class MailService {
  private transporter: Mail<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail({ email, link }: { email: string; link: string }) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Активация аккаунта на Trello Marella !!!",
      text: "",
      html: `
            <div>
                <h1>Для активации перейдите по ссылке:</h1>
                <a href="${link}">${link}</a>
            </div>
          `,
    });
  }
}

export default new MailService();
