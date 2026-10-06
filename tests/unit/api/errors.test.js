import statusHandler from "pages/api/v1/status";
import migrationsHandler from "pages/api/v1/migrations";
import statusModel from "models/status";
import migrationsModel from "models/migrations";

jest.mock("models/migrations", () => ({
  __esModule: true,
  default: {
    listPendingMigrations: jest.fn(),
    applyPendingMigrations: jest.fn(),
  },
}));

afterEach(() => {
  jest.restoreAllMocks();
});

describe("API router error responses", () => {
  test.each([
    ["GET", "/api/v1/status", statusHandler, statusModel, "getStatus"],
    [
      "GET",
      "/api/v1/migrations",
      migrationsHandler,
      migrationsModel,
      "listPendingMigrations",
    ],
    [
      "POST",
      "/api/v1/migrations",
      migrationsHandler,
      migrationsModel,
      "applyPendingMigrations",
    ],
  ])(
    "%s %s returns a safe 500 when its model fails",
    async (method, url, handler, model, operation) => {
      const error = new Error("password=secret; SQL SELECT failed");
      jest.spyOn(model, operation).mockRejectedValue(error);
      jest.spyOn(console, "error").mockImplementation(() => {});
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler({ method, url }, response);

      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(1);
      const responseBody = JSON.parse(
        JSON.stringify(response.json.mock.calls[0][0]),
      );
      expect(responseBody).toEqual({
        name: "InternalServerError",
        message: "Um erro interno não esperado aconteceu.",
        action: "Entre em contato com o suporte.",
        status_code: 500,
      });
    },
  );
});
