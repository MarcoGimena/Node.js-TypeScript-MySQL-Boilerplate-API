import nodemailer from 'nodemailer';
import config from '../config.json';

export default async function sendEmail({ to, subject, html, from }: any) {

    console.log("📧 sendEmail CALLED");
    console.log("TO:", to);
    console.log("SUBJECT:", subject);

    // 1. Fallback scheme: Use Render environment variables if available, otherwise use config.json locally
    const emailFromAddress = process.env.EMAIL_FROM || config.emailFrom;
    
    const smtpOptions = {
        host: process.env.SMTP_HOST || config.smtpOptions.host || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || Number(config.smtpOptions.port) || 465,
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
        auth: {
            user: process.env.SMTP_USER || config.smtpOptions.auth.user,
            pass: process.env.SMTP_PASSWORD || config.smtpOptions.auth.pass
        }
    };

    try {
        const transporter = nodemailer.createTransport(smtpOptions);
        
        // 2. Attempt to send the email
        const info = await transporter.sendMail({ 
            from: from || emailFromAddress, 
            to, 
            subject, 
            html 
        });

        console.log("✅ EMAIL SENT");
        console.log("Message ID:", info.messageId);
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
        
    } catch (error) {
        // 🚨 CRITICAL FIX: This prevents your Render server from crashing out with a 500 error!
        console.error("❌ EMAIL SERVICE ERROR:", error);
        console.log("🔄 Process sustained. Allowing frontend navigation to continue...");
    }
}