import { runner as migrationRunner } from "node-pg-migrate";
import database from "infra/database";
import migrations from "models/migrations";

jest.mock("node-pg-migrate", () => ({ runner: jest.fn() }));

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe("Migrations connection lifecycle", () => {
  test.each(["listPendingMigrations", "applyPendingMigrations"])(
    "%s closes the connection once on success",
    async (operation) => {
      const client = { end: jest.fn().mockResolvedValue() };
      const result = [{ name: "migration" }];
      jest.spyOn(database, "getNewClient").mockResolvedValue(client);
      migrationRunner.mockResolvedValue(result);

      await expect(migrations[operation]()).resolves.toBe(result);
      expect(client.end).toHaveBeenCalledTimes(1);
    },
  );

  test.each(["listPendingMigrations", "applyPendingMigrations"])(
    "%s propagates a runner failure and closes the connection once",
    async (operation) => {
      const client = { end: jest.fn().mockResolvedValue() };
      const error = new Error("Migration failed");
      jest.spyOn(database, "getNewClient").mockResolvedValue(client);
      migrationRunner.mockRejectedValue(error);

      await expect(migrations[operation]()).rejects.toBe(error);
      expect(client.end).toHaveBeenCalledTimes(1);
    },
  );

  test("Preserving a connection failure without starting migrations", async () => {
    const error = new Error("Connection failed");
    jest.spyOn(database, "getNewClient").mockRejectedValue(error);

    await expect(migrations.applyPendingMigrations()).rejects.toBe(error);
    expect(migrationRunner).not.toHaveBeenCalled();
  });
});
