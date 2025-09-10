const express = require("express");

const {
  createExpense,
  getAllExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  patchExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Despesas
 *   description: Gerenciamento de despesas
 */

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Cria uma nova despesa
 *     tags: [Despesas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Aluguel
 *               amount:
 *                 type: number
 *                 example: 1200.00
 *               category:
 *                 type: string
 *                 example: Moradia
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-05-25"
 *               type:
 *                 type: string
 *                 enum: [fixed, variable]
 *                 example: fixed
 *     responses:
 *       201:
 *         description: Despesa criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1d8d001c8e4a1a"
 *                 description:
 *                   type: string
 *                   example: Aluguel
 *                 amount:
 *                   type: number
 *                   example: 1200.00
 *                 category:
 *                   type: string
 *                   example: Moradia
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-05-25T00:00:00.000Z"
 *                 yearMonth:
 *                   type: string
 *                   example: "2024-05"
 *                 type:
 *                   type: string
 *                   example: fixed
 *                 userId:
 *                   type: string
 *                   example: "60c72b2f9b1d8d001c8e4a1b"
 *       400:
 *         description: Erro de validação.
 *       401:
 *         description: Não autorizado, token faltando ou inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post("/expenses", protect, createExpense);

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Obtém todas as despesas do usuário autenticado
 *     tags: [Despesas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de despesas obtida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1a"
 *                   description:
 *                     type: string
 *                     example: "Conta de luz"
 *                   amount:
 *                     type: number
 *                     example: 150.75
 *                   category:
 *                     type: string
 *                     example: "Moradia"
 *                   date:
 *                     type: string
 *                     example: "2024-05-30T00:00:00.000Z"
 *                   type:
 *                     type: string
 *                     example: "variable"
 *                   userId:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1b"
 *       401:
 *         description: Não autorizado, token faltando ou inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/expenses", protect, getAllExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     summary: Obtém uma despesa pelo ID
 *     tags: [Despesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da despesa
 *     responses:
 *       200:
 *         description: Despesa encontrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1d8d001c8e4a1a"
 *                 description:
 *                   type: string
 *                   example: "Conta de luz"
 *                 amount:
 *                   type: number
 *                   example: 150.75
 *                 category:
 *                   type: string
 *                   example: "Moradia"
 *                 date:
 *                   type: string
 *                   example: "2024-05-30T00:00:00.000Z"
 *                 type:
 *                   type: string
 *                   example: "variable"
 *                 userId:
 *                   type: string
 *                   example: "60c72b2f9b1d8d001c8e4a1b"
 *       401:
 *         description: Não autorizado, token faltando ou inválido.
 *       404:
 *         description: Despesa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/expenses/:id", protect, getExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Atualiza uma despesa (substituindo o objeto completo)
 *     tags: [Despesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da despesa a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Nova descrição
 *               amount:
 *                 type: number
 *                 example: 250.00
 *               category:
 *                 type: string
 *                 example: Lazer
 *               date:
 *                 type: string
 *                 example: "2024-05-25"
 *               type:
 *                 type: string
 *                 example: variable
 *     responses:
 *       200:
 *         description: Despesa atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1d8d001c8e4a1a"
 *                 description:
 *                   type: string
 *                   example: Nova descrição
 *                 amount:
 *                   type: number
 *                   example: 250.00
 *                 category:
 *                   type: string
 *                   example: Lazer
 *                 date:
 *                   type: string
 *                   example: "2024-05-25T00:00:00.000Z"
 *                 type:
 *                   type: string
 *                   example: variable
 *                 userId:
 *                   type: string
 *                   example: "60c72b2f9b1d8d001c8e4a1b"
 *       401:
 *         description: Não autorizado, token faltando ou inválido.
 *       404:
 *         description: Despesa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put("/expenses/:id", protect, updateExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   patch:
 *     summary: Atualiza parcialmente uma despesa
 *     tags: [Despesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da despesa a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Nova descrição
 *               amount:
 *                 type: number
 *                 example: 250.00
 *     responses:
 *       200:
 *         description: Despesa atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1d8d001c8e4a1a"
 *                 description:
 *                   type: string
 *                   example: Nova descrição
 *                 amount:
 *                   type: number
 *                   example: 250.00
 *                 category:
 *                   type: string
 *                   example: Lazer
 *                 date:
 *                   type: string
 *                   example: "2024-05-25T00:00:00.000Z"
 *                 type:
 *                   type: string
 *                   example: variable
 *                 userId:
 *                   type: string
 *                   example: "60c72b2f9b1d8d001c8e4a1b"
 *       401:
 *         description: Não autorizado, token faltando ou inválido.
 *       404:
 *         description: Despesa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.patch("/expenses/:id", protect, patchExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Exclui uma despesa
 *     tags: [Despesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da despesa a ser excluída
 *     responses:
 *       200:
 *         description: Despesa excluída com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Despesa excluída com sucesso."
 *       401:
 *         description: Não autorizado, token faltando ou inválido.
 *       404:
 *         description: Despesa não encontrada para exclusão.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete("/expenses/:id", protect, deleteExpense);

module.exports = router;
