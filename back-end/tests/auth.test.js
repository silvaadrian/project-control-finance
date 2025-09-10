const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../src/models/User");

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
  await User.deleteMany({});
});

describe("POST /api/register", () => {
  it("deve registrar um novo usuário com sucesso", async () => {
    const userData = {
      name: "Teste User",
      email: "teste@example.com",
      password: "password123",
    };

    const res = await request(app).post("/api/register").send(userData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toEqual(userData.email);

    const userInDb = await User.findById(res.body._id);
    expect(userInDb).not.toBeNull();
    expect(userInDb.email).toEqual(userData.email);
  });

  it("deve retornar 400 se o usuário já existir", async () => {
    const userData = {
      name: "Existing User",
      email: "existing@example.com",
      password: "password123",
    };

    await User.create(userData);

    const res = await request(app).post("/api/register").send(userData);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Usuário já existe.");
  });

  it("deve retornar 400 se os dados do usuário forem inválidos", async () => {
    const invalidData = {
      name: "Invalid User",
      email: "invalid-email",
      password: "123", 
    };

    const res = await request(app).post("/api/register").send(invalidData);

    expect(res.statusCode).toEqual(400);
  });
});

describe("POST /api/login", () => {
  it("deve autenticar um usuário com credenciais válidas e retornar um token", async () => {
    const userData = {
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    };

 
    const user = await User.create(userData);

    const res = await request(app).post("/api/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toEqual(userData.email);
  });

  it("deve retornar 401 para credenciais inválidas", async () => {
    const userData = {
      name: "Login User 2",
      email: "login2@example.com",
      password: "password123",
    };

    await User.create(userData);

    const res = await request(app).post("/api/login").send({
      email: userData.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Email ou senha inválidos.");
  });

  it("deve retornar 401 se o usuário não for encontrado", async () => {
    const res = await request(app).post("/api/login").send({
      email: "nonexistent@example.com",
      password: "anypassword",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Email ou senha inválidos.");
  });
});
