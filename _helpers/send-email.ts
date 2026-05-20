import nodemailer from 'nodemailer';
import config from '../config.json';

export default async function sendEmail({ to, subject, html, from }: any) {

    console.log("📧 sendEmail CALLED");
    console.log("TO:", to);
    console.log("SUBJECT:", subject);

    // 1. Cleanly resolve the values (checks Env first, then config.json, then hardcoded defaults)
    const emailFromAddress = process.env.EMAIL_FROM || config.emailFrom;
    const host = process.env.SMTP_HOST || config.smtpOptions?.host || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || Number(config.smtpOptions?.port) || 465;
    
    // Fixes the secure toggle so port 2525 / 587 doesn't accidentally get forced into SSL mode
    let isSecure = port === 465; 
    if (process.env.SMTP_SECURE !== undefined) {
        isSecure = process.env.SMTP_SECURE === 'true';
    } else if (config.smtpOptions?.secure !== undefined) {
        isSecure = config.smtpOptions.secure;
    }

    const smtpOptions = {
        host,
        port,
        secure: isSecure,
        auth: {
            user: process.env.SMTP_USER || config.smtpOptions?.auth?.user,
            pass: process.env.SMTP_PASSWORD || config.smtpOptions?.auth?.pass
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
        
    } catch (error) {
        // 🚨 CRITICAL FIX: This prevents your Render server from crashing out with a 500 error!
        console.error("❌ EMAIL SERVICE ERROR:", error);
        console.log("🔄 Process sustained. Allowing frontend navigation to continue...");
    }
}