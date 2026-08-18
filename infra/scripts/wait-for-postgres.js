import { exec } from "node:child_process";

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  async function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("Postgres está pronto e aceitando conexões!");
  }
}

console.log("\n\nAguardando Postgres aceitar conexões");
checkPostgres();
