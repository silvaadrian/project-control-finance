const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Revenue = require("../src/models/Revenue");

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
  await Revenue.deleteMany({});
});

describe("GET /api/revenues", () => {
  it("deve retornar um array vazio se não houver receitas", async () => {
    const res = await request(app).get("/api/revenues");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("deve retornar as receitas existentes", async () => {
    const revenueData = {
      description: "Salário",
      amount: 5000,
      category: "Salário",
      date: new Date(),
      type: "fixed",
      userId: mockUserId,
      yearMonth: "2023-11",
    };
    await Revenue.create(revenueData);

    const res = await request(app).get("/api/revenues");

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].description).toEqual(revenueData.description);
  });
});

describe("POST /api/revenues", () => {
  it("deve criar uma nova receita com sucesso", async () => {
    const revenueData = {
      description: "Serviço de consultoria",
      amount: 1200,
      category: "Freelance",
      date: new Date(),
      type: "variable",
    };

    const res = await request(app).post("/api/revenues").send(revenueData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("description", "Serviço de consultoria");
    expect(res.body).toHaveProperty("userId", mockUserId.toString());

    const revenue = await Revenue.findById(res.body._id);
    expect(revenue).not.toBeNull();
  });

  it("deve retornar 400 se os dados da receita forem inválidos", async () => {
    const invalidData = {
      description: "Sem valor",
      category: "Outros",
      date: new Date(),
    };
    const res = await request(app).post("/api/revenues").send(invalidData);
    expect(res.statusCode).toEqual(400);
  });
});

describe("GET /api/revenues/:id", () => {
  it("deve retornar uma receita por ID se o usuário for o dono", async () => {
    const revenue = await Revenue.create({ description: "Bônus", amount: 300, category: "Salário", date: new Date(), type: "variable", userId: mockUserId, yearMonth: "2023-11" });

    const res = await request(app).get(`/api/revenues/${revenue._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toEqual("Bônus");
    expect(res.body._id).toEqual(revenue._id.toString());
  });

  it("deve retornar 404 se a receita não for encontrada", async () => {
    const res = await request(app).get(`/api/revenues/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("PUT /api/revenues/:id", () => {
  it("deve atualizar uma receita existente", async () => {
    const revenue = await Revenue.create({ description: "Dividendo", amount: 50, category: "Investimento", date: new Date(), type: "variable", userId: mockUserId, yearMonth: "2023-11" });

    const updatedData = {
      description: "Dividendo Atualizado",
      amount: 75,
      category: "Investimento",
      date: new Date(),
      type: "fixed",
      yearMonth: "2023-11",
      userId: mockUserId,
    };

    const res = await request(app)
      .put(`/api/revenues/${revenue._id}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toEqual("Dividendo Atualizado");
    expect(res.body.amount).toEqual(75);

    const checkRevenue = await Revenue.findById(revenue._id);
    expect(checkRevenue.description).toEqual("Dividendo Atualizado");
  });

  it("deve retornar 404 se a receita a ser atualizada não for encontrada", async () => {
    const updatedData = {
      description: "Teste 404",
      amount: 100,
      category: "Outros",
      date: new Date(),
      type: "fixed",
      yearMonth: "2023-11",
      userId: mockUserId,
    };
    const res = await request(app)
      .put(`/api/revenues/${new mongoose.Types.ObjectId()}`)
      .send(updatedData);
    expect(res.statusCode).toEqual(404);
  });
});

describe("DELETE /api/revenues/:id", () => {
  it("deve deletar uma receita existente", async () => {
    const revenue = await Revenue.create({ description: "Venda", amount: 100, category: "Outros", date: new Date(), type: "variable", userId: mockUserId, yearMonth: "2023-11" });

    const res = await request(app).delete(`/api/revenues/${revenue._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Receita excluída com sucesso.");

    const checkRevenue = await Revenue.findById(revenue._id);
    expect(checkRevenue).toBeNull();
  });

  it("deve retornar 404 se a receita a ser deletada não for encontrada", async () => {
    const res = await request(app).delete(`/api/revenues/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("PATCH /api/revenues/:id", () => {
  it("deve substituir uma receita existente", async () => {
    const revenue = await Revenue.create({ description: "Extra 1", amount: 150, category: "Outros", date: new Date(), type: "variable", userId: mockUserId, yearMonth: "2023-11" });
    const replacementData = {
      description: "Extra 2",
      amount: 200,
      category: "Outros",
      date: new Date(),
      type: "variable",
      yearMonth: "2023-11",
      userId: mockUserId,
    };

    const res = await request(app)
      .patch(`/api/revenues/${revenue._id}`)
      .send(replacementData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toEqual("Extra 2");
    expect(res.body.amount).toEqual(200);

    const checkRevenue = await Revenue.findById(revenue._id);
    expect(checkRevenue.description).toEqual("Extra 2");
  });

  it("deve retornar 404 se a receita a ser substituída não for encontrada", async () => {
    const replacementData = {
      description: "Teste 404",
      amount: 100,
      category: "Outros",
      date: new Date(),
      type: "fixed",
      yearMonth: "2023-11",
      userId: mockUserId,
    };
    const res = await request(app)
      .patch(`/api/revenues/${new mongoose.Types.ObjectId()}`)
      .send(replacementData);
    expect(res.statusCode).toEqual(404);
  });
});
