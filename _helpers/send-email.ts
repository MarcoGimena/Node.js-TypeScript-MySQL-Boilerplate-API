import nodemailer from 'nodemailer';
import config from '../config.json';

export default async function sendEmail({ to, subject, html, from = config.emailFrom }: any) {

    console.log("📧 sendEmail CALLED");
    console.log("TO:", to);
    console.log("SUBJECT:", subject);

    const transporter = nodemailer.createTransport(config.smtpOptions);

    const info = await transporter.sendMail({ from, to, subject, html });

    console.log("✅ EMAIL SENT");
    console.log("Message ID:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}