import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    try {
        // 1. The Updated Transporter (Now pointing to Mailtrap)
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, // sandbox.smtp.mailtrap.io
            port: process.env.EMAIL_PORT, // 2525
            auth: {
                user: process.env.EMAIL_USERNAME, // Your Mailtrap User
                pass: process.env.EMAIL_PASSWORD, // Your Mailtrap Password
            },
        });

        // 2. Define the email details
        const mailOptions = {
            from: '"AI Job Portal" <noreply@aijobportal.com>', // You can make this whatever you want for testing!
            to: options.email, 
            subject: options.subject, 
            text: options.message, 
        };

        // 3. Send it!
        const info = await transporter.sendMail(mailOptions);
        console.log(`✉️ Success! Email captured by Mailtrap for: ${options.email}`);
        
        return info;
    } catch (error) {
        console.error("❌ Email Sending Failed:", error.message);
        throw new Error("Could not send email. Please check your Mailtrap configuration.");
    }
};