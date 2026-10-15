import mongoose, { Schema, Document } from 'mongoose';
import { ITask } from './task.types.js';

export type TaskDocument = Document<unknown, object, ITask> & ITask;

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = (ret['_id'] as { toString: () => string }).toString();
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
  }
);

// Compound indexes for optimal query performance
taskSchema.index({ user: 1, status: 1, createdAt: -1 });
taskSchema.index({ user: 1, dueDate: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);
