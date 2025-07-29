import { NodeMailerAttachmentTypes } from "@/types/nodemailer.types";
import nodemailer from "nodemailer";



export const sendMail = async (
  to: string,
  subject: string,
  html: string,
  attachments: NodeMailerAttachmentTypes[] = []
): Promise<string | false> => {
  console.log("NodeMailerService@sendMailNodemailer");

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let mailOptions: nodemailer.SendMailOptions = {
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    };

    if (attachments.length) {
      mailOptions.attachments = attachments;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Message ID: ", info.messageId);

    return info.messageId;
  } catch (ex: any) {
    console.log("Mail Status:", ex.message);
    return false;
  }
};
