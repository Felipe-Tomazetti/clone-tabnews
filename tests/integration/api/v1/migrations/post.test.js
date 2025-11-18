import database from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  //Remove todas as tabelas ligadas ao schema
  //e depois remove o schema em si do banco
  //depois cria o schema novamente
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/migrations should return 201 when there are migrations to be run and 200 when there is no more migrations", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  const response1Body = await response1.json();

  expect(response1.status).toBe(201);
  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  const response2Body = await response2.json();

  expect(response2.status).toBe(200);
  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});
