import mongoose, { Schema, model, models } from 'mongoose';

const ContentSchema = new Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const ContentModel = models.Content || model('Content', ContentSchema);
export default ContentModel;
