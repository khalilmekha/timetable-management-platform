import { readFile } from "node:fs/promises";
import nodemailer from "nodemailer";

import { EMAIL_PASSWORD, EMAIL_USER } from "./env";

import type SMTPTransport from "nodemailer/lib/smtp-transport";

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  } as SMTPTransport.Options);

  static async sendEmail(mailOptions: SMTPTransport.MailOptions) {
    return this.transporter.sendMail(mailOptions);
  }

  static async sendTeacherEmail(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const html = await readFile("templates/emails/teacher.html", "utf-8");

    const formattedHtml = html.format({
      firstName,
      lastName,
      email,
      password,
    });

    const mailOptions: SMTPTransport.MailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to the system",
      text: `Hello ${firstName} ${lastName},\n\nWelcome to the system! Your email is ${email} and your password is ${password}.`,
      html: formattedHtml,
    };

    return this.sendEmail(mailOptions);
  }
}
