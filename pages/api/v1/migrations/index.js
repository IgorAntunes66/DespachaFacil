import { runner as migrationRunner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    response.status(405).json({
      error: `Method "${request.method} not allowed"`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationsOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join(process.cwd(), "infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    console.log("DIRETORIO", defaultMigrationsOptions.dir);

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
      });
      await dbClient.end();
      response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });

      await dbClient.end();

      if (migratedMigrations.length > 0) {
        response.status(201).json(migratedMigrations);
      }

      response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
