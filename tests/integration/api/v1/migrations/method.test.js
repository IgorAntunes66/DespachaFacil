import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("HTTP methods /api/v1/migrations", () => {
  test("Accepting HEAD with an empty response body", async () => {
    const response = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "HEAD",
    });
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
  });

  test("Rejecting PUT without applying migrations", async () => {
    const response = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "PUT",
    });
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD, POST");
    expect(await response.json()).toEqual({
      name: "MethodNotAllowedError",
      message: "Método HTTP não permitido para este recurso.",
      action: "Utilize um dos métodos indicados no cabeçalho Allow.",
      status_code: 405,
    });
    const pendingResponse = await fetch(
      "http://localhost:3000/api/v1/migrations",
    );
    expect(pendingResponse.status).toBe(200);
    const pendingMigrations = await pendingResponse.json();
    expect(pendingMigrations.length).toBeGreaterThan(0);
  });
});
