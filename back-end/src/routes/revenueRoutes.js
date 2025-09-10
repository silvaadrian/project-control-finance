const express = require("express");
const {
  createRevenue,
  getAllRevenues,
  getRevenueById,
  updateRevenue,
  deleteRevenue,
  patchRevenue,
} = require("../controllers/revenueController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 *   tags:
 *     name: Receitas
 *     description: Gerenciamento de receitas
 */

/**
 * @swagger
 *   /revenues:
 *     post:
 *       summary: Cria uma nova receita
 *       tags: [Receitas]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Salário
 *                 amount:
 *                   type: number
 *                   example: 3500.00
 *                 category:
 *                   type: string
 *                   example: Salário
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-05-30"
 *                 type:
 *                   type: string
 *                   enum: [fixed, variable]
 *                   example: fixed
 *       responses:
 *         201:
 *           description: Receita criada com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1a"
 *                   description:
 *                     type: string
 *                     example: Salário
 *                   amount:
 *                     type: number
 *                     example: 3500.00
 *                   category:
 *                     type: string
 *                     example: Salário
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-05-30T00:00:00.000Z"
 *                   yearMonth:
 *                     type: string
 *                     example: "2024-05"
 *                   type:
 *                     type: string
 *                     example: fixed
 *                   userId:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1b"
 *         400:
 *           description: Erro de validação.
 *         401:
 *           description: Não autorizado, token faltando ou inválido.
 *         500:
 *           description: Erro interno do servidor.
 */
router.post("/revenues", protect, createRevenue);

/**
 * @swagger
 *   /revenues:
 *     get:
 *       summary: Obtém todas as receitas do usuário autenticado
 *       tags: [Receitas]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Lista de receitas obtida com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f9b1d8d001c8e4a1a"
 *                     description:
 *                       type: string
 *                       example: "Salário"
 *                     amount:
 *                       type: number
 *                       example: 3500.00
 *                     category:
 *                       type: string
 *                       example: "Salário"
 *                     date:
 *                       type: string
 *                       example: "2024-05-30T00:00:00.000Z"
 *                     type:
 *                       type: string
 *                       example: "fixed"
 *                     userId:
 *                       type: string
 *                       example: "60c72b2f9b1d8d001c8e4a1b"
 *         401:
 *           description: Não autorizado, token faltando ou inválido.
 *         500:
 *           description: Erro interno do servidor.
 */
router.get("/revenues", protect, getAllRevenues);

/**
 * @swagger
 *   /revenues/{id}:
 *     get:
 *       summary: Obtém uma receita pelo ID
 *       tags: [Receitas]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: ID da receita
 *       responses:
 *         200:
 *           description: Receita encontrada com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1a"
 *                   description:
 *                     type: string
 *                     example: "Salário"
 *                   amount:
 *                     type: number
 *                     example: 3500.00
 *                   category:
 *                     type: string
 *                     example: "Salário"
 *                   date:
 *                     type: string
 *                     example: "2024-05-30T00:00:00.000Z"
 *                   type:
 *                     type: string
 *                     example: "fixed"
 *                   userId:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1b"
 *         401:
 *           description: Não autorizado, token faltando ou inválido.
 *         404:
 *           description: Receita não encontrada.
 *         500:
 *           description: Erro interno do servidor.
 */
router.get("/revenues/:id", protect, getRevenueById);

/**
 * @swagger
 *   /revenues/{id}:
 *     put:
 *       summary: Atualiza uma receita (substituindo o objeto completo)
 *       tags: [Receitas]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: ID da receita a ser atualizada
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Salário de Julho
 *                 amount:
 *                   type: number
 *                   example: 3800.00
 *                 category:
 *                   type: string
 *                   example: Salário
 *                 date:
 *                   type: string
 *                   example: "2024-07-30"
 *                 type:
 *                   type: string
 *                   example: fixed
 *       responses:
 *         200:
 *           description: Receita atualizada com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1a"
 *                   description:
 *                     type: string
 *                     example: Salário de Julho
 *                   amount:
 *                     type: number
 *                     example: 3800.00
 *                   category:
 *                     type: string
 *                     example: Salário
 *                   date:
 *                     type: string
 *                     example: "2024-07-30T00:00:00.000Z"
 *                   yearMonth:
 *                     type: string
 *                     example: "2024-07"
 *                   type:
 *                     type: string
 *                     example: fixed
 *                   userId:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1b"
 *         400:
 *           description: Erro de validação.
 *         401:
 *           description: Não autorizado, token faltando ou inválido.
 *         404:
 *           description: Receita não encontrada.
 *         500:
 *           description: Erro interno do servidor.
 */
router.put("/revenues/:id", protect, updateRevenue);

/**
 * @swagger
 *   /revenues/{id}:
 *     patch:
 *       summary: Atualiza parcialmente uma receita
 *       tags: [Receitas]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: ID da receita a ser atualizada
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Bônus de fim de ano
 *                 amount:
 *                   type: number
 *                   example: 500.00
 *       responses:
 *         200:
 *           description: Receita atualizada com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1a"
 *                   description:
 *                     type: string
 *                     example: Bônus de fim de ano
 *                   amount:
 *                     type: number
 *                     example: 500.00
 *                   category:
 *                     type: string
 *                     example: Salário
 *                   date:
 *                     type: string
 *                     example: "2024-12-25T00:00:00.000Z"
 *                   type:
 *                     type: string
 *                     example: fixed
 *                   userId:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1b"
 *         401:
 *           description: Não autorizado, token faltando ou inválido.
 *         404:
 *           description: Receita não encontrada.
 *         500:
 *           description: Erro interno do servidor.
 */
router.patch("/revenues/:id", protect, patchRevenue);

/**
 * @swagger
 *   /revenues/{id}:
 *     delete:
 *       summary: Exclui uma receita
 *       tags: [Receitas]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: ID da receita a ser excluída
 *       responses:
 *         200:
 *           description: Receita excluída com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Receita excluída com sucesso."
 *         401:
 *           description: Não autorizado, token faltando ou inválido.
 *         404:
 *           description: Receita não encontrada para exclusão.
 *         500:
 *           description: Erro interno do servidor.
 */
router.delete("/revenues/:id", protect, deleteRevenue);

module.exports = router;
