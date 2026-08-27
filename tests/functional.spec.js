// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Testes funcionais do site Clinical Excellence.
 *
 * Cobrem os cinco fluxos principais que um usuário percorre:
 *   1. Navegar da home para a página de agendamento
 *   2. Abrir e alternar as perguntas do FAQ
 *   3. Iniciar o agendamento pelo formulário rápido da home
 *   4. Ter o envio bloqueado quando o formulário está incompleto
 *   5. Concluir um agendamento válido e vê-lo salvo no histórico
 *
 * Rode com:  npm test
 */

/** Devolve uma data futura (YYYY-MM-DD) que não caia num domingo. */
function dataFuturaValida(diasAdiante = 7) {
    const d = new Date();
    d.setDate(d.getDate() + diasAdiante);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // pula domingo
    return d.toISOString().split("T")[0];
}

/** Preenche o formulário de agendar.html com dados válidos. */
async function preencherAgendamentoValido(page) {
    await page.fill("#nome", "Maria Souza");
    await page.fill("#whatsapp", "11987654321");
    await page.fill("#email", "maria@exemplo.com");
    await page.selectOption("#especialidade", "cardiologia");
    await page.fill("#data", dataFuturaValida());
    await page.selectOption("#periodo", "manha");
}

// ---------------------------------------------------------------------------
// 1. Navegação: home -> agendamento
// ---------------------------------------------------------------------------
test("1 - CTA do cabeçalho leva da home para a página de agendamento", async ({ page }) => {
    await page.goto("/index.html");

    await page
        .locator("#mainHeader")
        .getByRole("link", { name: "Agendar Consulta" })
        .first()
        .click();

    await expect(page).toHaveURL(/agendar\.html$/);
    await expect(page.locator("#bookingForm")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Agende sua Consulta" })).toBeVisible();
});

// ---------------------------------------------------------------------------
// 2. FAQ em acordeão
// ---------------------------------------------------------------------------
test("2 - FAQ abre a resposta clicada e recolhe as demais", async ({ page }) => {
    await page.goto("/index.html#faq");

    const itens = page.locator(".accordion-item");
    const primeiro = itens.nth(0).locator(".accordion-trigger");
    const segundo = itens.nth(1).locator(".accordion-trigger");

    // Começa tudo fechado.
    await expect(primeiro).toHaveAttribute("aria-expanded", "false");

    // Abre o primeiro item.
    await primeiro.click();
    await expect(primeiro).toHaveAttribute("aria-expanded", "true");
    await expect(itens.nth(0)).toHaveClass(/active/);
    await expect(itens.nth(0).locator(".accordion-content")).toBeVisible();

    // Abrir o segundo deve fechar o primeiro.
    await segundo.click();
    await expect(itens.nth(1)).toHaveClass(/active/);
    await expect(primeiro).toHaveAttribute("aria-expanded", "false");
    await expect(itens.nth(0)).not.toHaveClass(/active/);
});

// ---------------------------------------------------------------------------
// 3. Formulário rápido da home encaminha para o agendamento preenchido
// ---------------------------------------------------------------------------
test("3 - formulário rápido da home abre agendar.html com os dados preenchidos", async ({ page }) => {
    await page.goto("/index.html#contato");

    await page.fill("#rapido-nome", "João Pereira");
    await page.fill("#rapido-telefone", "11912345678");
    await page.selectOption("#rapido-especialidade", "dermatologia");
    await page.click('#formRapido button[type="submit"]');

    await page.waitForURL(/agendar\.html\?/);

    // Campos chegam preenchidos na página de agendamento.
    await expect(page.locator("#nome")).toHaveValue("João Pereira");
    await expect(page.locator("#especialidade")).toHaveValue("dermatologia");
    // O telefone passa pela máscara ao ser recebido.
    await expect(page.locator("#whatsapp")).toHaveValue("(11) 91234-5678");

    // E a lista de profissionais é filtrada pela especialidade.
    const opcoesProfissional = await page.locator("#profissional option").allInnerTexts();
    expect(opcoesProfissional).toContain("Dra. Beatriz Costa");
    expect(opcoesProfissional).not.toContain("Dr. Carlos Mendes");
});

// ---------------------------------------------------------------------------
// 4. Validação impede envio incompleto
// ---------------------------------------------------------------------------
test("4 - envio com campos obrigatórios vazios é bloqueado e mostra erros", async ({ page }) => {
    await page.goto("/agendar.html");

    await page.click('#bookingForm button[type="submit"]');

    // A tela de sucesso não aparece.
    await expect(page.locator("#successMessage")).not.toHaveClass(/active/);

    // Campos obrigatórios ficam marcados como inválidos, com mensagem.
    const campoNome = page.locator(".field", { has: page.locator("#nome") });
    await expect(campoNome).toHaveClass(/is-invalid/);

    const erroNome = campoNome.locator(".field-error");
    await expect(erroNome).toBeVisible();
    await expect(erroNome).toContainText(/nome/i);

    // O mesmo vale para especialidade, data e período.
    await expect(page.locator(".field", { has: page.locator("#especialidade") })).toHaveClass(/is-invalid/);
    await expect(page.locator(".field", { has: page.locator("#data") })).toHaveClass(/is-invalid/);
    await expect(page.locator(".field", { has: page.locator("#periodo") })).toHaveClass(/is-invalid/);

    // Nada foi salvo no armazenamento local.
    const salvos = await page.evaluate(() => localStorage.getItem("clinical-excellence:agendamentos"));
    expect(salvos).toBeNull();
});

// ---------------------------------------------------------------------------
// 5. Agendamento válido conclui e é salvo no histórico
// ---------------------------------------------------------------------------
test("5 - agendamento válido mostra tela de sucesso com protocolo e salva no histórico", async ({ page }) => {
    await page.goto("/agendar.html");
    await preencherAgendamentoValido(page);

    await page.click('#bookingForm button[type="submit"]');

    // Tela de sucesso visível com um protocolo no formato esperado.
    const sucesso = page.locator("#successMessage");
    await expect(sucesso).toHaveClass(/active/);
    await expect(page.locator("#successResumo")).toContainText(/CE-\d{8}-\d{4}/);
    await expect(page.locator("#successResumo")).toContainText("Cardiologia");

    // A solicitação é gravada no localStorage.
    const salvos = await page.evaluate(() =>
        JSON.parse(localStorage.getItem("clinical-excellence:agendamentos") || "[]")
    );
    expect(salvos).toHaveLength(1);
    expect(salvos[0]).toMatchObject({
        nome: "Maria Souza",
        especialidade: "cardiologia",
        periodo: "manha",
    });
    expect(salvos[0].protocolo).toMatch(/^CE-\d{8}-\d{4}$/);

    // E aparece na seção "Minhas solicitações".
    await page.click("#btnNovoAgendamento");
    await expect(page.locator("#meusAgendamentos")).toBeVisible();
    await expect(page.locator("#listaAgendamentos li")).toHaveCount(1);
    await expect(page.locator("#listaAgendamentos li").first()).toContainText("Cardiologia");
});
