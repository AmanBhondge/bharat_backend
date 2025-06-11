import Contact from "../models/contact.model.js"; 

export const createContact = async (req, res) => {
    try {
        const { name, email, phone, message, reason } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name and phone are required fields",
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