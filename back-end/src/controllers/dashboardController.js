const Expense = require("../models/Expense");
const Revenue = require("../models/Revenue");

exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const { month, year } = req.query;
    let yearMonthFilter;

    if (month && year) {
      yearMonthFilter = `${year}-${month.toString().padStart(2, "0")}`;
    } else {
      const now = new Date();
      yearMonthFilter = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    }

    const totalRevenues = await Revenue.aggregate([
      { $match: { userId, yearMonth: yearMonthFilter } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpenses = await Expense.aggregate([
      { $match: { userId, yearMonth: yearMonthFilter } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expensesByCategory = await Expense.aggregate([
      { $match: { userId, yearMonth: yearMonthFilter } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const revenues = totalRevenues.length > 0 ? totalRevenues[0].total : 0;
    const expenses = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    const balance = revenues - expenses;

    res.status(200).json({
      revenues,
      expenses,
      balance,
      expensesByCategory,
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao gerar o resumo mensal.",
      details: error.message,
    });
  }
};

exports.getAnnualSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;
    if (!year) {
      return res
        .status(400)
        .json({ error: 'O parâmetro "year" é obrigatório.' });
    }
    const yearStr = year.toString();

    const totalRevenues = await Revenue.aggregate([
      { $match: { userId, yearMonth: { $regex: `^${yearStr}-` } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpenses = await Expense.aggregate([
      { $match: { userId, yearMonth: { $regex: `^${yearStr}-` } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const revenues = totalRevenues.length > 0 ? totalRevenues[0].total : 0;
    const expenses = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    const balance = revenues - expenses;
    res.status(200).json({
      year: yearStr,
      revenues,
      expenses,
      balance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao gerar o resumo anual.", details: error.message });
  }
};
