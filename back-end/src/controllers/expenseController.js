const Expense = require("../models/Expense");

exports.createExpense = async (req, res) => {
  try {
    const { date, ...rest } = req.body;
    const expenseDate = new Date(date);

    const yearMonth = `${expenseDate.getFullYear()}-${(
      expenseDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;

    const newExpense = new Expense({
      ...rest,
      date: expenseDate,
      userId: req.user._id,
      yearMonth,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar a despesa.", details: error.message });
  }
};

exports.getAllExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    res.status(200).json(expenses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar as despesas.", details: error.message });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ _id: id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }
    res.status(200).json(expense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar a despesa.", details: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { date, ...rest } = req.body;
    const expenseDate = new Date(date);
    const yearMonth = `${expenseDate.getFullYear()}-${(
      expenseDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;

    const updatedExpense = await Expense.findOneAndReplace(
      { _id: req.params.id, userId: req.user._id },
      { ...rest, date: expenseDate, userId: req.user._id, yearMonth },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar a despesa.", details: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deletedExpense) {
      return res
        .status(404)
        .json({ error: "Despesa não encontrada para exclusão." });
    }
    res.status(200).json({ message: "Despesa excluída com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar a despesa.", details: error.message });
  }
};

exports.patchExpense = async (req, res) => {
  try {
    const updates = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar a despesa.", details: error.message });
  }
};
