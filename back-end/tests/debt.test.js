const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Debt = require("../src/models/Debt");

const mockUserId = new mongoose.Types.ObjectId("60c728b9f01f4c001f8e4e9b");

jest.mock("../src/middleware/authMiddleware", () => {
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
  await Debt.deleteMany({});
});

describe("POST /api/debts", () => {
  it("deve criar uma nova dívida com sucesso", async () => {
    const debtData = {
      description: "Carro",
      totalAmount: 20000,
      category: "Transporte",
      totalInstallments: 24,
    };

    const res = await request(app).post("/api/debts").send(debtData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("description", "Carro");
    expect(res.body.totalAmount).toEqual(20000);
    expect(res.body.userId).toEqual(mockUserId.toString());
    expect(res.body.installments.length).toEqual(24);
    expect(res.body.installments[0].amount).toEqual(debtData.totalAmount / debtData.totalInstallments);

    const savedDebt = await Debt.findById(res.body._id);
    expect(savedDebt).not.toBeNull();
  });

  it("deve retornar 400 se os dados da dívida forem inválidos", async () => {
    const invalidData = {
      description: "Aluguel",
      category: "Moradia",
      totalInstallments: 12,
    };
    const res = await request(app).post("/api/debts").send(invalidData);
    expect(res.statusCode).toEqual(400);
  });
});

describe("GET /api/debts", () => {
  it("deve retornar um array vazio se não houver dívidas", async () => {
    const res = await request(app).get("/api/debts");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("deve retornar as dívidas existentes", async () => {
    const debtData = {
      description: "Empréstimo",
      totalAmount: 5000,
      category: "Pessoal",
      totalInstallments: 10,
      userId: mockUserId,
    };
    await Debt.create(debtData);

    const res = await request(app).get("/api/debts");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].description).toEqual(debtData.description);
  });
});

describe("GET /api/debts/:id", () => {
  it("deve retornar uma dívida por ID se o usuário for o dono", async () => {
    const debt = await Debt.create({
      description: "Moto",
      totalAmount: 12000,
      category: "Transporte",
      totalInstallments: 12,
      userId: mockUserId,
    });

    const res = await request(app).get(`/api/debts/${debt._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toEqual("Moto");
  });

  it("deve retornar 404 se a dívida não for encontrada", async () => {
    const res = await request(app).get(`/api/debts/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toEqual(404);
  });

  it("deve retornar 404 se a dívida for de outro usuário", async () => {
    const otherUserId = new mongoose.Types.ObjectId("60c728b9f01f4c001f8e4e9c");
    const otherUserDebt = await Debt.create({
      description: "Dívida de Outro",
      totalAmount: 100,
      category: "Outros",
      totalInstallments: 1,
      userId: otherUserId,
    });
    const res = await request(app).get(`/api/debts/${otherUserDebt._id}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("PUT /api/debts/:id", () => {
  it("deve atualizar uma dívida existente", async () => {
    const debt = await Debt.create({
      description: "TV",
      totalAmount: 3000,
      category: "Eletrônicos",
      totalInstallments: 3,
      userId: mockUserId,
    });

    const updatedData = {
      description: "TV 4K",
      totalAmount: 3500,
    };

    const res = await request(app).put(`/api/debts/${debt._id}`).send(updatedData);
    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toEqual(updatedData.description);
    expect(res.body.totalAmount).toEqual(updatedData.totalAmount);
  });

  it("deve retornar 404 se a dívida a ser atualizada não for encontrada", async () => {
    const updatedData = { description: "Não Encontrado" };
    const res = await request(app)
      .put(`/api/debts/${new mongoose.Types.ObjectId()}`)
      .send(updatedData);
    expect(res.statusCode).toEqual(404);
  });
});

describe("DELETE /api/debts/:id", () => {
  it("deve deletar uma dívida existente", async () => {
    const debt = await Debt.create({
      description: "Viagem",
      totalAmount: 5000,
      category: "Lazer",
      totalInstallments: 5,
      userId: mockUserId,
    });

    const res = await request(app).delete(`/api/debts/${debt._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Dívida excluída com sucesso.");

    const deletedDebt = await Debt.findById(debt._id);
    expect(deletedDebt).toBeNull();
  });

  it("deve retornar 404 se a dívida a ser deletada não for encontrada", async () => {
    const res = await request(app).delete(`/api/debts/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toEqual(404);
  });
});
