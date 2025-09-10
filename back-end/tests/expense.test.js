const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Expense = require("../src/models/Expense");

const mockUserId = new mongoose.Types.ObjectId("60c728b9f01f4c001f8e4e9b");

jest.mock("../src/middleware/authMiddleware", () => {
  const mongoose = require("mongoose");
  return {
    protect: jest.fn((req, res, next) => {
      req.user = { _id: mockUserId };
      next();
    }),
  };
});

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Expense.deleteMany({});
});


describe("GET /api/expenses", () => {
  it("deve retornar um array vazio se não houver despesas", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("deve retornar as despesas existentes", async () => {

    const expenseData = {
      description: "Supermercado",
      amount: 150,
      category: "Alimentação",
      date: new Date(),
      type: "variable",
      userId: mockUserId,
      yearMonth: "2023-11",
    };
    await Expense.create(expenseData);

    const res = await request(app).get("/api/expenses");

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].description).toEqual(expenseData.description);
  });
});

describe("POST /api/expenses", () => {
  it("deve criar uma nova despesa com sucesso", async () => {
    const newExpense = {
      description: "Cinema",
      amount: 45,
      category: "Lazer",
      date: "2023-10-25T00:00:00.000Z",
      type: "variable",
    };

    const res = await request(app).post("/api/expenses").send(newExpense);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.description).toEqual(newExpense.description);

    const savedExpense = await Expense.findById(res.body._id);
    expect(savedExpense).not.toBeNull();
    expect(savedExpense.userId).toEqual(mockUserId);
  });
});

describe("GET /api/expenses/:id", () => {
  it("deve retornar uma despesa por ID se o usuário for o dono", async () => {
    const expense = await Expense.create({
      description: "Lanche",
      amount: 25,
      category: "Alimentação",
      date: new Date(),
      yearMonth: "2023-11",
      type: "variable",
      userId: mockUserId,
    });

    const res = await request(app).get(`/api/expenses/${expense._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toEqual(expense.description);
  });

  it("deve retornar 404 se a despesa não for encontrada", async () => {
    const res = await request(app).get(`/api/expenses/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("PUT /api/expenses/:id", () => {
  it("deve atualizar uma despesa existente", async () => {
    const expense = await Expense.create({
      description: "Livro",
      amount: 60,
      category: "Educação",
      date: new Date(),
      yearMonth: "2023-11",
      type: "variable",
      userId: mockUserId,
    });

    const updatedData = {
      description: "Livro de Programação",
      amount: 90,
      category: "Educação",
      date: new Date(),
      yearMonth: "2023-11",
      type: "variable",
      userId: mockUserId,
    };

    const res = await request(app).put(`/api/expenses/${expense._id}`).send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toEqual(updatedData.description);
    expect(res.body.amount).toEqual(updatedData.amount);
  });

  it("deve retornar 404 se a despesa a ser atualizada não for encontrada", async () => {
    const updatedData = {
      description: "Livro de Programação",
      amount: 90,
      category: "Educação",
      date: new Date(),
      yearMonth: "2023-11",
      type: "variable",
      userId: mockUserId,
    };

    const res = await request(app).put(`/api/expenses/${new mongoose.Types.ObjectId()}`).send(updatedData);
    expect(res.statusCode).toEqual(404);
  });
});

describe("DELETE /api/expenses/:id", () => {
  it("deve deletar uma despesa existente", async () => {
    const expense = await Expense.create({
      description: "Jogo",
      amount: 100,
      category: "Lazer",
      date: new Date(),
      yearMonth: "2023-11",
      type: "variable",
      userId: mockUserId,
    });

    const res = await request(app).delete(`/api/expenses/${expense._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Despesa excluída com sucesso.");

    const deletedExpense = await Expense.findById(expense._id);
    expect(deletedExpense).toBeNull();
  });

  it("deve retornar 404 se a despesa a ser deletada não for encontrada", async () => {
    const res = await request(app).delete(`/api/expenses/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("PATCH /api/expenses/:id", () => {
  it("deve substituir uma despesa existente", async () => {
    const expense = await Expense.create({
      description: "Camiseta",
      amount: 50,
      category: "Compras",
      date: new Date(),
      yearMonth: "2023-11",
      type: "variable",
      userId: mockUserId,
    });

    const replacementData = {
      description: "Jaqueta",
      amount: 150,
      category: "Roupas",
      date: new Date(),
      yearMonth: "2023-11",
      type: "variable",
      userId: mockUserId,
    };

    const res = await request(app).patch(`/api/expenses/${expense._id}`).send(replacementData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toEqual(replacementData.description);

    const replacedExpense = await Expense.findById(expense._id);
    expect(replacedExpense.description).toEqual(replacementData.description);
  });

  it("deve retornar 404 se a despesa a ser substituída não for encontrada", async () => {
    const res = await request(app).patch(`/api/expenses/${new mongoose.Types.ObjectId()}`).send({
      description: "Teste",
      amount: 100,
      category: "Outros",
      date: new Date(),
      yearMonth: "2023-11",
      type: "variable",
      userId: mockUserId,
    });
    expect(res.statusCode).toEqual(404);
  });
});
