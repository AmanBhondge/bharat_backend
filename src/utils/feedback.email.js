import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/config.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export const sendMail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `"Bharat Digital" <${EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
