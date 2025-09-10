const mongoose = require("mongoose");
const InstallmentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentDate: {
    type: Date,
  },
});
const DebtSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "A descrição da dívida é obrigatória."],
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: [true, "O valor total da dívida é obrigatório."],
    },
    category: {
      type: String,
      required: [true, "A categoria da dívida é obrigatória."],
    },
    totalInstallments: {
      type: Number,
      required: [true, "O número de parcelas é obrigatório."],
    },
    currentInstallment: {
      type: Number,
      default: 1,
    },
    installments: [InstallmentSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

DebtSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("totalAmount") || this.isModified("totalInstallments")) {
    const installmentsArray = [];
    const installmentAmount = this.totalAmount / this.totalInstallments;
    const startDate = new Date();
    for (let i = 0; i < this.totalInstallments; i++) {
      const dueDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + i,
        startDate.getDate()
      );
      installmentsArray.push({
        amount: installmentAmount,
        dueDate: dueDate,
        isPaid: false,
      });
    }
    this.installments = installmentsArray;
  }
  next();
});
module.exports = mongoose.model("Debt", DebtSchema);