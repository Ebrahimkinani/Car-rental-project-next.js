import mongoose, { Schema, HydratedDocument } from 'mongoose';

// Interface for expense data
export interface IExpense {
  date: Date;
  category: 'Fuel' | 'Maintenance' | 'Salaries' | 'Rent' | 'Utilities' | 'Insurance' | 'Other';
  vendor: string;
  description: string;
  method: 'Card' | 'Cash' | 'Money Transfer' | 'Wallet';
  status: 'Pending' | 'Posted' | 'Refunded';
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Type alias for hydrated documents
export type ExpenseDocument = HydratedDocument<IExpense>;

const ExpenseSchema = new Schema<IExpense>({
  date: {
    type: Date,
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['Fuel', 'Maintenance', 'Salaries', 'Rent', 'Utilities', 'Insurance', 'Other'],
    required: true,
    index: true
  },
  vendor: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['Card', 'Cash', 'Money Transfer', 'Wallet'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Posted', 'Refunded'],
    default: 'Pending',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'expenses'
});

// Compound indexes for efficient queries
ExpenseSchema.index({ date: 1, category: 1 });
ExpenseSchema.index({ status: 1, date: 1 });
ExpenseSchema.index({ vendor: 1, date: 1 });
ExpenseSchema.index({ method: 1, date: 1 });

export const Expense = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
