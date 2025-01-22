import mongoose from "mongoose";

const MailSubscriberSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export default mongoose.models.email_subscribers ||
mongoose.model("email_subscribers", MailSubscriberSchema);
