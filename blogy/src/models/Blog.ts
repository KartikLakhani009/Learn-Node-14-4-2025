
import mongoose, { Document, Schema } from 'mongoose';

export interface BlogDocument extends Document {
  createdBy: mongoose.Types.ObjectId;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  coverImage?: string;
}

const BlogSchema = new Schema<BlogDocument>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    body:{
      type: String,
      required: true,
      trim: true
    },
    coverImage: {
      type: String,
      trim: true
    },
  },
  {
    timestamps: true
  }
);

export const Blog = mongoose.model<BlogDocument>('Blog', BlogSchema);