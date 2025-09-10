const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'A descrição da receita é obrigatória.'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'O valor da receita é obrigatório.'],
  },
  category: {
    type: String,
    required: [true, 'A categoria da receita é obrigatória.'],
  },
  date: {
    type: Date,
    required: [true, 'A data da receita é obrigatória.'],
  },
  yearMonth: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Revenue', RevenueSchema);
