import { spawn, execSync } from "node:child_process";

const startWebServ = spawn("npm run dev:exit", {
  shell: "zsh",
  stdio: "inherit",
});

startWebServ.on("close", (code, signal) => {
  if (signal) {
    process.exit(0);
  } else if (code !== 0) {
    console.error(`\n O processo falhou com o codigo: ${code}`);
    process.exit(code);
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("\nVocê pressionou Ctrl + C!");
  startWebServ.kill("SIGINT");

  console.log("Rodando script de limpeza (postdev)...");

  try {
    execSync("npm run postdev", {
      stdio: "inherit",
      shell: "zsh",
    });

    console.log("Limpeza concluida. Saindo...");
  } catch (error) {
    console.error(`\n Erro durante a limpeza: ${error}`);
  } finally {
    process.exit(0);
  }
});
