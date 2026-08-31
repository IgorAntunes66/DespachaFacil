import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.dependencies.database.version).toBe("18");
      expect(responseBody.dependencies.database.max_connections).toBe(100);
      expect(responseBody.dependencies.database.opened_connections).toBe(1);
    });
  });
});
