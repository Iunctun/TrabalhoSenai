# Testes funcionais

Testes de ponta a ponta que abrem o site num navegador real (Microsoft Edge) e
simulam o que um usuário faz: clicar, preencher formulários e conferir o
resultado na tela.

Ferramenta: [Playwright](https://playwright.dev/).

## Pré-requisitos

- Node.js instalado.
- Microsoft Edge instalado (o Playwright usa o Edge do sistema — não baixa
  nenhum navegador).
- Dependências do projeto: `npm install` na raiz.

## Como rodar

Na raiz do projeto:

```bash
npm test
```

O Playwright sobe sozinho um servidor local (`http-server` na porta 8080),
executa os testes e derruba o servidor no final.

Outras formas úteis:

```bash
npx playwright test --headed      # ver o navegador executando
npx playwright test tests/functional.spec.js:38   # rodar só um teste
npx playwright show-report        # relatório do último run
```

## O que é testado (`functional.spec.js`)

| # | Cenário | Verifica |
|---|---------|----------|
| 1 | CTA "Agendar Consulta" no cabeçalho da home | leva para `agendar.html` e o formulário aparece |
| 2 | FAQ em acordeão | abrir uma pergunta expande a resposta e recolhe as demais |
| 3 | Formulário rápido da home | redireciona para `agendar.html` com nome, telefone (com máscara) e especialidade já preenchidos, e a lista de profissionais filtrada |
| 4 | Envio do agendamento com campos vazios | é bloqueado, os campos obrigatórios ganham mensagem de erro e nada é salvo |
| 5 | Agendamento válido completo | mostra a tela de sucesso com protocolo `CE-AAAAMMDD-XXXX`, grava no `localStorage` e lista em "Minhas solicitações" |
