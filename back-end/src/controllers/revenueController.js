const Revenue = require("../models/Revenue");

exports.createRevenue = async (req, res) => {
  try {
    const { date, ...rest } = req.body;
    const revenueDate = new Date(date);

    const yearMonth = `${revenueDate.getFullYear()}-${(
      revenueDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;

    const newRevenue = new Revenue({
      ...rest,
      date: revenueDate,
      userId: req.user._id,
      yearMonth,
    });

    const savedRevenue = await newRevenue.save();
    res.status(201).json(savedRevenue);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Erro de validação.",
        details: error.message,
      });
    }
    res
      .status(500)
      .json({ error: "Erro ao criar a receita.", details: error.message });
  }
};

exports.getAllRevenues = async (req, res) => {
  try {
    const revenues = await Revenue.find({ userId: req.user._id });
    res.status(200).json(revenues);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar as receitas.", details: error.message });
  }
};

exports.getRevenueById = async (req, res) => {
  try {
    const revenue = await Revenue.findById({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!revenue) {
      return res.status(404).json({ error: "Receita não encontrada." });
    }
    res.status(200).json(revenue);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar a receita.", details: error.message });
  }
};

exports.updateRevenue = async (req, res) => {
  try {
    const { date, ...rest } = req.body;
    const revenueDate = new Date(date);
    const yearMonth = `${revenueDate.getFullYear()}-${(
      revenueDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;

    const updatedRevenue = await Revenue.findOneAndReplace(
      { _id: req.params.id, userId: req.user._id },
      { ...rest, date: revenueDate, userId: req.user._id, yearMonth },
      { new: true, runValidators: true }
    );
    if (!updatedRevenue) {
      return res
        .status(404)
        .json({ error: "Receita não encontrada para atualização." });
    }
    res.status(200).json(updatedRevenue);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Erro de validação.",
        details: error.message,
      });
    } else if (error.name === "CastError") {
      return res.status(404).json({ error: "Receita não encontrada para atualização." });
    }
    res
      .status(500)
      .json({ error: "Erro ao atualizar a receita.", details: error.message });
  }
};

exports.deleteRevenue = async (req, res) => {
  try {
    const deletedRevenue = await Revenue.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deletedRevenue) {
      return res
        .status(404)
        .json({ error: "Receita não encontrada para exclusão." });
    }
    res.status(200).json({ message: "Receita excluída com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar a receita.", details: error.message });
  }
};

exports.patchRevenue = async (req, res) => {
  try {
    const updates = req.body;

    const updatedRevenue = await Revenue.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedRevenue) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }

    res.status(200).json(updatedRevenue);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar a despesa.", details: error.message });
  }
};
