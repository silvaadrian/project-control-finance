const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMonthlySummary, getAnnualSummary } = require("../controllers/dashboardController");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Gerenciamento de resumos financeiros
 */

/**
 * @swagger
 * /dashboard/summary/monthly:
 *   get:
 *     summary: Obtém o resumo de despesas e receitas do mês/ano
 *     description: Retorna a soma total das despesas e receitas para o mês e ano especificados ou para o mês atual, se nenhum for fornecido. Também retorna o balanço e as despesas por categoria.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Número do mês (1-12).
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resumo mensal obtido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 revenues:
 *                   type: number
 *                   example: 2500.50
 *                 expenses:
 *                   type: number
 *                   example: 500.25
 *                 balance:
 *                   type: number
 *                   example: 2000.25
 *                 expensesByCategory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: Alimentação
 *                       total:
 *                         type: number
 *                         example: 300.00
 *       401:
 *         description: Não autorizado, token faltando ou inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/summary/monthly", protect, getMonthlySummary);

/**
 * @swagger
 * /dashboard/summary/annual:
 *   get:
 *     summary: Obtém o resumo de despesas e receitas do ano
 *     description: Retorna a soma total das despesas e receitas para o ano especificado.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Resumo anual obtido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 year:
 *                   type: string
 *                   example: "2024"
 *                 revenues:
 *                   type: number
 *                   example: 30000.00
 *                 expenses:
 *                   type: number
 *                   example: 6000.00
 *                 balance:
 *                   type: number
 *                   example: 24000.00
 *       400:
 *         description: O parâmetro "year" é obrigatório.
 *       401:
 *         description: Não autorizado, token faltando ou inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/summary/annual", protect, getAnnualSummary);

module.exports = router;
