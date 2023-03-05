const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  currentBalance: {
    type: Number,
    min: 0,
    default: 0
  },
  totalIncome: {
    type: Number,
    min: 0,
    default: 0
  },
  totalExpenses: {
    type: Number,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  income: [{
    amount: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      required: true
    }
  }],
  expense: [{
    amount: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      required: true
    }
  }]
}, {
  versionKey: '1.0'
  });

// get total income
trackSchema.virtual('incomeTotal').get(function() {
  return this.income.reduce((total, income) => total + income.amount, 0);
});

// get total expenses
trackSchema.virtual('expenseTotal').get(function() {
  return this.expense.reduce((total, expense) => total + expense.amount, 0);
});

module.exports = mongoose.model('Track', trackSchema);
