import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("HTTP methods /api/v1/status", () => {
  test("Accepting HEAD with an empty response body", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status", {
      method: "HEAD",
    });
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
  });

  test("Rejecting POST", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status", {
      method: "POST",
    });
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD");
    expect(await response.json()).toEqual({
      name: "MethodNotAllowedError",
      message: "Método HTTP não permitido para este recurso.",
      action: "Utilize um dos métodos indicados no cabeçalho Allow.",
      status_code: 405,
    });
  });
});
