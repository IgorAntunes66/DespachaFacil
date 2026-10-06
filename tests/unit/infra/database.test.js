import { Client } from "pg";
import database from "infra/database";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Database query lifecycle", () => {
  test("Propagating a query failure and closing its connection", async () => {
    const error = new Error("Query failed");
    jest.spyOn(Client.prototype, "connect").mockResolvedValue();
    jest.spyOn(Client.prototype, "query").mockRejectedValue(error);
    const end = jest.spyOn(Client.prototype, "end").mockResolvedValue();

    await expect(database.query("SELECT invalid_column;")).rejects.toBe(error);
    expect(end).toHaveBeenCalledTimes(1);
  });

  test("Returning query results and closing its connection", async () => {
    const result = { rows: [{ value: 1 }] };
    jest.spyOn(Client.prototype, "connect").mockResolvedValue();
    jest.spyOn(Client.prototype, "query").mockResolvedValue(result);
    const end = jest.spyOn(Client.prototype, "end").mockResolvedValue();

    await expect(database.query("SELECT 1;")).resolves.toBe(result);
    expect(end).toHaveBeenCalledTimes(1);
  });

  test("Preserving a connection failure without attempting a query", async () => {
    const error = new Error("Connection failed");
    jest.spyOn(Client.prototype, "connect").mockRejectedValue(error);
    const query = jest.spyOn(Client.prototype, "query");

    await expect(database.query("SELECT 1;")).rejects.toBe(error);
    expect(query).not.toHaveBeenCalled();
  });
});
