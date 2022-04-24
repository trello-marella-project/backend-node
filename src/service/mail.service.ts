class MailService {
  static async sendActivationMail({
    email,
    link,
  }: {
    email: string;
    link: string;
  }) {
    console.log("send");
  }
}

export { MailService };
