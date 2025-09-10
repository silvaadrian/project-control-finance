const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Expense = require("../src/models/Expense");
const Revenue = require("../src/models/Revenue");

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
  await Expense.deleteMany({});
  await Revenue.deleteMany({});
});

describe("GET /api/dashboard/summary/monthly", () => {
  it("deve retornar um resumo mensal para o mês e ano atuais se nenhum parâmetro for fornecido", async () => {
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;

    await Expense.create({ description: "Aluguel", amount: 1500, category: "Moradia", date: new Date(), type: "fixed", yearMonth: currentYearMonth, userId: mockUserId });
    await Expense.create({ description: "Supermercado", amount: 500, category: "Alimentação", date: new Date(), type: "variable", yearMonth: currentYearMonth, userId: mockUserId });
    await Revenue.create({ description: "Salário", amount: 3000, category: "Salário", date: new Date(), type: "fixed", yearMonth: currentYearMonth, userId: mockUserId });

    const res = await request(app).get("/api/dashboard/summary/monthly");

    expect(res.statusCode).toEqual(200);
    expect(res.body.revenues).toEqual(3000);
    expect(res.body.expenses).toEqual(2000);
    expect(res.body.balance).toEqual(1000);
    expect(res.body.expensesByCategory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: "Moradia", total: 1500 }),
        expect.objectContaining({ _id: "Alimentação", total: 500 }),
      ])
    );
  });

  it("deve retornar um resumo mensal para um mês e ano específicos", async () => {
    const specificYearMonth = "2023-09";
    await Expense.create({ description: "Viagem", amount: 800, category: "Lazer", date: new Date("2023-09-15"), type: "variable", yearMonth: specificYearMonth, userId: mockUserId });
    await Revenue.create({ description: "Freelance", amount: 1000, category: "Serviços", date: new Date("2023-09-10"), type: "variable", yearMonth: specificYearMonth, userId: mockUserId });

    const otherYearMonth = "2023-08";
    await Expense.create({ description: "Conta", amount: 100, category: "Contas", date: new Date("2023-08-20"), type: "fixed", yearMonth: otherYearMonth, userId: mockUserId });

    const res = await request(app).get("/api/dashboard/summary/monthly?month=09&year=2023");

    expect(res.statusCode).toEqual(200);
    expect(res.body.revenues).toEqual(1000);
    expect(res.body.expenses).toEqual(800);
    expect(res.body.balance).toEqual(200);
    expect(res.body.expensesByCategory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: "Lazer", total: 800 }),
      ])
    );
  });

  it("deve retornar um resumo com valores zero se não houver dados", async () => {
    const res = await request(app).get("/api/dashboard/summary/monthly");

    expect(res.statusCode).toEqual(200);
    expect(res.body.revenues).toEqual(0);
    expect(res.body.expenses).toEqual(0);
    expect(res.body.balance).toEqual(0);
    expect(res.body.expensesByCategory).toEqual([]);
  });
});

describe("GET /api/dashboard/summary/annual", () => {
  it("deve retornar um resumo anual para um ano específico", async () => {
    const yearStr = "2023";

    await Expense.create({ description: "Viagem", amount: 500, category: "Lazer", date: new Date("2023-01-01"), type: "variable", yearMonth: "2023-01", userId: mockUserId });
    await Expense.create({ description: "Aluguel", amount: 1000, category: "Moradia", date: new Date("2023-02-01"), type: "fixed", yearMonth: "2023-02", userId: mockUserId });
    await Revenue.create({ description: "Salário", amount: 2000, category: "Salário", date: new Date("2023-01-01"), type: "fixed", yearMonth: "2023-01", userId: mockUserId });
    await Revenue.create({ description: "Extra", amount: 500, category: "Outros", date: new Date("2023-02-01"), type: "variable", yearMonth: "2023-02", userId: mockUserId });

    const res = await request(app).get(`/api/dashboard/summary/annual?year=${yearStr}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.year).toEqual(yearStr);
    expect(res.body.revenues).toEqual(2500);
    expect(res.body.expenses).toEqual(1500);
    expect(res.body.balance).toEqual(1000);
  });

  it("deve retornar 400 se o parâmetro 'year' não for fornecido", async () => {
    const res = await request(app).get("/api/dashboard/summary/annual");

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("O parâmetro \"year\" é obrigatório.");
  });

  it("deve retornar um resumo com valores zero se não houver dados para o ano", async () => {
    const res = await request(app).get("/api/dashboard/summary/annual?year=2023");

    expect(res.statusCode).toEqual(200);
    expect(res.body.year).toEqual("2023");
    expect(res.body.revenues).toEqual(0);
    expect(res.body.expenses).toEqual(0);
    expect(res.body.balance).toEqual(0);
  });
});
