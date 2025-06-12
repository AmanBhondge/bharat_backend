import Contact from "../models/contact.model.js"; 
import { sendMail } from "../utils/feedback.email.js";
import {RECEIVER_EMAIL} from "../config/config.js"

export const createContact = async (req, res) => {
    try {
        const { name, email, phone, message, reason } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, email and phone are required fields",
            });
        }

        if (reason && !Array.isArray(reason)) {
            return res.status(400).json({
                success: false,
                message: "Reason must be an array of strings",
            });
        }

        const newContact = new Contact({
            name,
            email,
            phone,
            message,
            reason: reason || [],
        });

        const savedContact = await newContact.save();

        // Notify admin
        await sendMail({
            to: RECEIVER_EMAIL,
            subject: "New Contact Form Submission",
            html: `
                <h3>New Contact Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message || "No message"}</p>
                <p><strong>Reason:</strong> ${reason?.join(", ") || "None"}</p>
            `,
        });

        // Send confirmation to user 
        if (email) {
            await sendMail({
                to: email,
                subject: "We received your contact request!",
                html: `
                    <p>Hi ${name},</p>
                    <p>Thank you for reaching out to us. We’ve received your message and will get back to you shortly.</p>
                    <p>Best regards,<br/>The Support Team</p>
                `,
            });
        }

        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: savedContact,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: errors,
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Contact with this email already exists",
            });
        }

        console.error("Error creating contact:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}; 