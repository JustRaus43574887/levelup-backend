import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: "leha.larionov.alex@mail.ru",
    pass: "cjB0viKNheX98F1grkjF",
  },
});

export const sendEmail = async (
  email: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: "leha.larionov.alex@mail.ru",
      to: email,
      subject,
      html,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
