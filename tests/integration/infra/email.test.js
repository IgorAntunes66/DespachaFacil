import { createServer } from "node:net";
import email from "infra/email";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.deleteAllEmails();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("infra/email.js", () => {
  test("Sending plain text and retrieving the last email", async () => {
    await email.send({
      to: "cliente@example.test",
      subject: "Primeiro e-mail",
      text: "Corpo do primeiro e-mail.",
    });
    const result = await email.send({
      to: "cliente@example.test",
      subject: "Último e-mail enviado",
      text: "Olá! Recebemos sua solicitação.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(result.accepted).toEqual(["cliente@example.test"]);
    expect(result.rejected).toEqual([]);
    expect(lastEmail.sender).toBe(`<${process.env.EMAIL_FROM}>`);
    expect(lastEmail.recipients).toEqual(["<cliente@example.test>"]);
    expect(lastEmail.subject).toBe("Último e-mail enviado");
    expect(lastEmail.text.trim()).toBe("Olá! Recebemos sua solicitação.");
    expect(lastEmail.html).toBeNull();
  });

  test("Sending HTML with a plain text alternative", async () => {
    await email.send({
      to: "cliente@example.test",
      subject: "Boas-vindas",
      text: "Bem-vindo! Seu cadastro foi recebido.",
      html: "<p>Bem-vindo! <strong>Seu cadastro foi recebido.</strong></p>",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.subject).toBe("Boas-vindas");
    expect(lastEmail.text.trim()).toBe("Bem-vindo! Seu cadastro foi recebido.");
    expect(lastEmail.html.trim()).toBe(
      "<p>Bem-vindo! <strong>Seu cadastro foi recebido.</strong></p>",
    );
  });

  test("Propagating an SMTP server failure", async () => {
    const server = createServer((socket) => {
      socket.end("421 SMTP temporarily unavailable\r\n");
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

    try {
      jest.replaceProperty(process, "env", {
        ...process.env,
        EMAIL_SMTP_HOST: "127.0.0.1",
        EMAIL_SMTP_PORT: String(server.address().port),
        EMAIL_SMTP_SECURE: "false",
      });

      await expect(
        email.send({
          to: "failure@example.test",
          subject: "SMTP failure",
          text: "This message must fail.",
        }),
      ).rejects.toMatchObject({ responseCode: 421 });
    } finally {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });
});
