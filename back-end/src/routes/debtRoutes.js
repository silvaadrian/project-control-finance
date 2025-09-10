const express = require("express");
const {
  createDebt,
  getAllDebts,
  getDebtById,
  updateDebt,
  deleteDebt,
} = require("../controllers/debtController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 *   tags:
 *     - name: Dívidas
 *       description: Gerenciamento de dívidas
 */

/**
 * @swagger
 *   /debts:
 *     post:
 *       summary: Cria uma nova dívida
 *       tags: [Dívidas]
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
 *                   example: Empréstimo com a Sicreed
 *                 totalAmount:
 *                   type: number
 *                   example: 1800
 *                 category:
 *                   type: string
 *                   example: Dívidas e parcelas
 *                 totalInstallments:
 *                   type: number
 *                   example: 12
 *       responses:
 *         201:
 *           description: Dívida criada com sucesso.
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
 *                     example: "Empréstimo com a Sicreed"
 *                   totalAmount:
 *                     type: number
 *                     example: 1800
 *                   category:
 *                     type: string
 *                     example: "Dívidas e parcelas"
 *                   totalInstallments:
 *                     type: number
 *                     example: 12
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
router.post("/debts", protect, createDebt);

/**
 * @swagger
 *   /debts:
 *     get:
 *       summary: Obtém todas as dívidas do usuário autenticado
 *       tags: [Dívidas]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Lista de dívidas obtida com sucesso.
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
 *                       example: "Conta de luz"
 *                     amount:
 *                       type: number
 *                       example: 150.75
 *                     dueDate:
 *                       type: string
 *                       example: "2024-05-30"
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     userId:
 *                       type: string
 *                       example: "60c72b2f9b1d8d001c8e4a1b"
 *         401:
 *           description: Não autorizado, token faltando ou inválido.
 *         500:
 *           description: Erro interno do servidor.
 */
router.get("/debts", protect, getAllDebts);

/**
 * @swagger
 *   /debts/{id}:
 *     get:
 *       summary: Obtém uma dívida pelo ID
 *       tags: [Dívidas]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: ID da dívida
 *       responses:
 *         200:
 *           description: Dívida encontrada com sucesso.
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
 *                     example: "Conta de luz"
 *                   amount:
 *                     type: number
 *                     example: 150.75
 *                   dueDate:
 *                     type: string
 *                     example: "2024-05-30"
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   userId:
 *                     type: string
 *                     example: "60c72b2f9b1d8d001c8e4a1b"
 *         401:
 *           description: Não autorizado, token faltando ou inválido.
 *         404:
 *           description: Dívida não encontrada.
 *         500:
 *           description: Erro interno do servidor.
 */
router.get("/debts/:id", protect, getDebtById);

/**
 * @swagger
 *   /debts/{id}:
 *     put:
 *       summary: Atualiza uma dívida pelo ID
 *       tags: [Dívidas]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: ID da dívida a ser atualizada
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Candelabro
 *                 totalAmount:
 *                   type: number
 *                   example: 150.98
 *                 category:
 *                   type: string
 *                   example: Dívidas e parcelas
 *                 totalInstallments:
 *                   type: number
 *                   example: 5
 *       responses:
 *         200:
 *           description: Dívida atualizada com sucesso.
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
 *                     example: Candelabro
 *                   totalAmount:
 *                     type: number
 *                     example: 150.98
 *                   category:
 *                     type: string
 *                     example: Dívidas e parcelas
 *                   totalInstallments:
 *                     type: number
 *                     example: 5
 *                   userId:
 *                     type: string
 *                     example: "68b758862dafbcb6a4560b66"
 *         401:
 *           description: Não autorizado, token faltando ou inválido.
 *         404:
 *           description: Dívida não encontrada.
 *         500:
 *           description: Erro interno do servidor.
 */
router.put("/debts/:id", protect, updateDebt);

/**
 * @swagger
 *   /debts/{id}:
 *     delete:
 *       summary: Exclui uma dívida pelo ID
 *       tags: [Dívidas]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: ID da dívida a ser excluída
 *       responses:
 *         200:
 *           description: Dívida excluída com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Dívida excluída com sucesso."
 *         401:
 *           description: Não autorizado, token faltando ou inválido.
 *         404:
 *           description: Dívida não encontrada para exclusão.
 *         500:
 *           description: Erro interno do servidor.
 */
router.delete("/debts/:id", protect, deleteDebt);

module.exports = router;
