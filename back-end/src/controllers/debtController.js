const Debt = require("../models/Debt");

exports.createDebt = async (req, res) => {
  try {
    const newDebt = new Debt({ ...req.body, userId: req.user._id });
    const savedDebt = await newDebt.save();
    res.status(201).json(savedDebt);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Erro de validação.",
        details: error.message,
      });
    }
    res
      .status(500)
      .json({ error: "Erro ao criar a dívida.", details: error.message });
  }
};

exports.getAllDebts = async (req, res) => {
  try {
    const debts = await Debt.find({ userId: req.user._id });
    res.status(200).json(debts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar as dívidas.", details: error.message });
  }
};

exports.getDebtById = async (req, res) => {
  try {
    const debt = await Debt.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!debt) {
      return res.status(404).json({ error: "Dívida não encontrada." });
    }
    res.status(200).json(debt);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar a dívida.", details: error.message });
  }
};

exports.updateDebt = async (req, res) => {
  try {
    const debt = await Debt.findOne({ _id: req.params.id, userId: req.user._id });

    if (!debt) {
      return res.status(404).json({ error: "Dívida não encontrada para atualização." });
    }

    Object.keys(req.body).forEach(key => {
      debt[key] = req.body[key];
    });

    const updatedDebt = await debt.save();

    res.status(200).json(updatedDebt);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a dívida.", details: error.message });
  }
};

exports.deleteDebt = async (req, res) => {
  try {
    const deletedDebt = await Debt.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deletedDebt) {
      return res
        .status(404)
        .json({ error: "Dívida não encontrada para exclusão." });
    }
    res.status(200).json({ message: "Dívida excluída com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar a dívida.", details: error.message });
  }
};
