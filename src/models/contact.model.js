import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Phone must be 10 digits"]
    },
    message: {
        type: String,
    },
    reason: {
        type: String,
    }
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;