const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'A descrição da despesa é obrigatória.'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'O valor da despesa é obrigatório.'],
  },
  category: {
    type: String,
    required: [true, 'A categoria da despesa é obrigatória.'],
  },
  date: {
    type: Date,
    required: [true, 'A data da despesa é obrigatória.'],
  },
  yearMonth: {
    type: String,
    required: true,
    index: true 
  },
  type: {
    type: String,
    enum: ['fixed', 'variable'],
    required: [true, 'O tipo da despesa (fixa ou variável) é obrigatório.'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);
