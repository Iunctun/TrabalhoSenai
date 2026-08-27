# Clinical Excellence — site de clínica particular com agendamento

Projeto acadêmico (SENAI) construído a partir dos protótipos exportados do
Google Stitch que estavam na raiz do repositório. Os arquivos de design
(`DESIGN.md`, telas e HTML gerado) foram convertidos em um site estático
funcional, responsivo e acessível.

## Como executar

Não há build nem dependências para instalar — é HTML, CSS e JavaScript puros.

**Opção 1 — abrir direto:** dê duplo clique em `index.html`.

**Opção 2 — servidor local** (recomendado, evita restrições do navegador):

```bash
npx http-server -p 8080
# ou, com Python instalado:
python -m http.server 8080
```

Depois acesse <http://localhost:8080>.

> Como usa o Tailwind via CDN e as fontes do Google Fonts, é necessário estar
> conectado à internet para ver o layout completo.

## Estrutura

```
.
├── index.html            Página inicial (hero, sobre, especialidades, corpo
│                         clínico, como funciona, benefícios, FAQ, contato)
├── agendar.html          Formulário completo de solicitação de consulta
├── assets/
│   ├── css/style.css     Estilos próprios: campos flutuantes, acordeão,
│   │                     animações, menu mobile
│   └── js/
│       ├── theme.js      Design tokens (cores, tipografia, espaçamentos)
│       ├── clinica.js    Dados da clínica: contato, especialidades, equipe
│       ├── main.js       Header, menu mobile, FAQ, animações, form rápido
│       └── agendamento.js  Validação, máscara, WhatsApp e histórico local
├── tests/                Testes funcionais (Playwright) — ver tests/README.md
└── stitch_agendamento_cl_nico_particular_moderno/
                          Export original do Stitch, mantido como referência
```

## Testes

Testes funcionais que abrem o site no Edge e simulam o uso real:

```bash
npm install   # uma vez
npm test
```

São 5 cenários (navegação, FAQ, formulário rápido, validação e agendamento
completo). Detalhes em [`tests/README.md`](tests/README.md).

## Funcionalidades

- **Navegação responsiva** com menu hambúrguer funcional e header com sombra
  dinâmica ao rolar.
- **Formulário rápido na home** que leva para `agendar.html` já preenchido, via
  query string (`agendar.html?especialidade=cardiologia&nome=Maria`).
- **Formulário de agendamento** com:
  - especialidades, profissionais e períodos carregados de `clinica.js`;
  - lista de profissionais filtrada pela especialidade escolhida;
  - máscara de telefone `(00) 00000-0000`;
  - validação campo a campo com mensagem de erro e ícone de confirmação;
  - bloqueio de datas passadas, domingos e datas acima de 6 meses;
  - geração de protocolo (`CE-AAAAMMDD-XXXX`) e tela de confirmação;
  - envio dos dados formatados para o WhatsApp da clínica.
- **Envio automático (opcional)**: com uma chave do CallMeBot configurada, a
  solicitação chega sozinha no WhatsApp da clínica ao enviar o formulário, sem a
  pessoa precisar apertar nada. Veja "Envio automático" abaixo.
- **Histórico local**: as solicitações ficam salvas no `localStorage` do
  navegador e podem ser reenviadas ou removidas.
- **Acessibilidade**: link "pular para o conteúdo", foco visível, `aria-expanded`
  no menu e no FAQ, textos alternativos nas imagens e respeito a
  `prefers-reduced-motion`.

## Personalização

Telefone, WhatsApp, endereço, especialidades e corpo clínico ficam todos em
[`assets/js/clinica.js`](assets/js/clinica.js). Alterar o número de WhatsApp,
por exemplo, é mudar uma única linha:

```js
whatsapp: "5511999999999", // 55 + DDD + número, apenas dígitos
```

As cores, fontes e espaçamentos vêm de
[`assets/js/theme.js`](assets/js/theme.js), fiel ao design system do
`DESIGN.md` original.

## Envio automático da solicitação (CallMeBot)

Por padrão, ao enviar o formulário o site **abre** o WhatsApp com a mensagem
pronta e a pessoa aperta enviar. Um site estático não consegue mandar WhatsApp
sozinho — isso precisa de um intermediário.

Para a solicitação chegar **automaticamente** no WhatsApp da clínica (número
fixo, sem custo, sem servidor):

1. No celular com o WhatsApp da clínica — o mesmo número que está em
   `whatsapp` no `clinica.js` — envie a mensagem
   `I allow callmebot to send me messages` para **+34 644 51 95 23**.
2. O bot responde com uma `apikey`.
3. Cole essa chave em [`assets/js/clinica.js`](assets/js/clinica.js):

   ```js
   callmebotApikey: "123456",
   ```

4. Pronto. A cada agendamento a mensagem cai nesse WhatsApp automaticamente. A
   tela de confirmação passa a dizer "enviada automaticamente".

**Limitações:** só funciona para esse número pré-autorizado (não dá para mandar
para o número de cada paciente — isso exigiria a API paga do WhatsApp Business);
o CallMeBot limita a ~1 mensagem por minuto; e a chave fica visível no código
(aceitável para um projeto acadêmico).

## Observações

- As imagens de fotos vêm das URLs geradas pelo Stitch. Se alguma deixar de
  responder, o container exibe um gradiente suave no lugar da imagem quebrada.
- Sem a chave do CallMeBot, o envio do formulário não vai para nenhum servidor:
  o fluxo termina no WhatsApp (aberto para a pessoa enviar) e no armazenamento
  local do navegador, adequado ao escopo do trabalho.
