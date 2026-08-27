/**
 * Página "Agendar Consulta":
 * monta os selects a partir dos dados da clínica, valida o formulário,
 * grava a solicitação no navegador (localStorage) e monta a mensagem
 * de WhatsApp com os dados preenchidos.
 */
(function () {
    "use strict";

    const CHAVE_STORAGE = "clinical-excellence:agendamentos";

    let form;
    let overlay;

    document.addEventListener("DOMContentLoaded", function () {
        form = document.getElementById("bookingForm");
        if (!form) return;

        overlay = document.getElementById("successMessage");

        montarSelects();
        limitarData();
        aplicarMascaraTelefone();
        preencherPelaURL();
        ligarValidacaoAoVivo();
        listarAgendamentos();

        form.addEventListener("submit", aoEnviar);

        const botaoWhats = document.getElementById("btnWhatsApp");
        if (botaoWhats) botaoWhats.addEventListener("click", enviarPeloWhatsApp);

        const botaoNovo = document.getElementById("btnNovoAgendamento");
        if (botaoNovo) botaoNovo.addEventListener("click", reiniciarFormulario);
    });

    /* ---------------------------------------------------------------------
       Montagem dos campos
       --------------------------------------------------------------------- */

    function montarSelects() {
        const especialidade = form.elements.especialidade;
        const profissional = form.elements.profissional;
        const periodo = form.elements.periodo;

        CLINICA.especialidades.forEach(function (item) {
            especialidade.add(new Option(item.nome, item.id));
        });

        CLINICA.periodos.forEach(function (item) {
            periodo.add(new Option(item.nome, item.id));
        });

        atualizarProfissionais();

        // Ao trocar de especialidade, mostra só quem atende naquela área.
        especialidade.addEventListener("change", atualizarProfissionais);

        function atualizarProfissionais() {
            const filtro = especialidade.value;
            const selecionadoAntes = profissional.value;

            profissional.length = 0;
            profissional.add(new Option("Qualquer profissional", ""));

            CLINICA.profissionais
                .filter(function (p) {
                    return !filtro || p.especialidade === filtro;
                })
                .forEach(function (p) {
                    profissional.add(new Option(p.nome, p.id));
                });

            // Mantém a escolha anterior se ela ainda for válida.
            if (selecionadoAntes) profissional.value = selecionadoAntes;
        }
    }

    /** Não permite escolher uma data no passado nem além de 6 meses. */
    function limitarData() {
        const campo = form.elements.data;
        const hoje = new Date();
        const limite = new Date();
        limite.setMonth(limite.getMonth() + 6);

        campo.min = paraISO(hoje);
        campo.max = paraISO(limite);
    }

    /** Formata o telefone como (00) 00000-0000 enquanto o usuário digita. */
    function aplicarMascaraTelefone() {
        const campo = form.elements.whatsapp;

        campo.addEventListener("input", function () {
            const digitos = campo.value.replace(/\D/g, "").slice(0, 11);
            let formatado = digitos;

            if (digitos.length > 2) {
                formatado = "(" + digitos.slice(0, 2) + ") " + digitos.slice(2);
            }
            if (digitos.length > 6) {
                const corte = digitos.length > 10 ? 7 : 6;
                formatado =
                    "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, corte) + "-" + digitos.slice(corte);
            }

            campo.value = formatado;
        });
    }

    /**
     * Permite chegar nesta página já com dados preenchidos, por exemplo
     * agendar.html?especialidade=cardiologia&nome=Maria
     */
    function preencherPelaURL() {
        const params = new URLSearchParams(window.location.search);
        ["nome", "whatsapp", "email", "especialidade"].forEach(function (campo) {
            const valor = params.get(campo);
            if (!valor) return;

            const elemento = form.elements[campo];
            if (!elemento) return;

            elemento.value = valor;
            elemento.dispatchEvent(new Event("input", { bubbles: true }));
            elemento.dispatchEvent(new Event("change", { bubbles: true }));
        });
    }

    /* ---------------------------------------------------------------------
       Validação
       --------------------------------------------------------------------- */

    const REGRAS = {
        nome: function (valor) {
            if (!valor.trim()) return "Informe seu nome completo.";
            if (valor.trim().split(/\s+/).length < 2) return "Digite nome e sobrenome.";
            return "";
        },
        whatsapp: function (valor) {
            const digitos = valor.replace(/\D/g, "");
            if (!digitos) return "Informe um telefone para contato.";
            if (digitos.length < 10 || digitos.length > 11) return "Use DDD + número (10 ou 11 dígitos).";
            return "";
        },
        email: function (valor) {
            if (!valor.trim()) return ""; // campo opcional
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())) return "E-mail inválido.";
            return "";
        },
        especialidade: function (valor) {
            return valor ? "" : "Escolha a especialidade desejada.";
        },
        data: function (valor) {
            if (!valor) return "Escolha uma data para a consulta.";
            const escolhida = new Date(valor + "T00:00:00");
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            if (escolhida < hoje) return "A data não pode estar no passado.";
            if (escolhida.getDay() === 0) return "Não atendemos aos domingos.";
            return "";
        },
        periodo: function (valor) {
            return valor ? "" : "Selecione o período de preferência.";
        },
    };

    /** Valida um campo e atualiza o estado visual dele. */
    function validarCampo(nome) {
        const elemento = form.elements[nome];
        if (!elemento || !REGRAS[nome]) return true;

        const container = elemento.closest(".field");
        const mensagem = REGRAS[nome](elemento.value);
        const preenchido = elemento.value.trim() !== "";

        if (container) {
            container.classList.toggle("is-invalid", Boolean(mensagem));
            container.classList.toggle("is-valid", !mensagem && preenchido);

            const alvoErro = container.querySelector(".field-error span");
            if (alvoErro) alvoErro.textContent = mensagem;
        }

        elemento.setAttribute("aria-invalid", mensagem ? "true" : "false");
        return !mensagem;
    }

    /** Valida o formulário inteiro e devolve se está tudo certo. */
    function validarTudo() {
        return Object.keys(REGRAS)
            .map(validarCampo)
            .every(Boolean);
    }

    /** Revalida ao sair do campo e limpa o erro assim que o usuário corrige. */
    function ligarValidacaoAoVivo() {
        Object.keys(REGRAS).forEach(function (nome) {
            const elemento = form.elements[nome];
            if (!elemento) return;

            elemento.addEventListener("blur", function () {
                validarCampo(nome);
            });

            const evento = elemento.tagName === "SELECT" || elemento.type === "date" ? "change" : "input";
            elemento.addEventListener(evento, function () {
                const container = elemento.closest(".field");
                if (container && container.classList.contains("is-invalid")) validarCampo(nome);
            });
        });
    }

    /* ---------------------------------------------------------------------
       Envio
       --------------------------------------------------------------------- */

    function aoEnviar(e) {
        e.preventDefault();

        if (!validarTudo()) {
            const primeiroErro = form.querySelector(".field.is-invalid .field-input");
            if (primeiroErro) {
                primeiroErro.focus();
                primeiroErro.scrollIntoView({ block: "center", behavior: "smooth" });
            }
            return;
        }

        const agendamento = coletarDados();
        salvar(agendamento);
        listarAgendamentos();
        const enviadoAuto = notificarClinica(agendamento);
        mostrarSucesso(agendamento, enviadoAuto);
    }

    /**
     * Dispara a solicitação direto para o WhatsApp da clínica via CallMeBot,
     * sem o usuário precisar apertar nada.
     *
     * O request é "fire and forget": usa uma tag <img> porque o CallMeBot não
     * envia cabeçalhos CORS e um fetch normal seria bloqueado pelo navegador.
     * Não dá para ler a resposta — assume-se sucesso se a chave estiver
     * configurada. O botão de WhatsApp na tela de sucesso continua como backup.
     *
     * Devolve true se a tentativa foi feita, false se não há chave configurada.
     */
    function notificarClinica(agendamento) {
        const apikey = (CLINICA.callmebotApikey || "").trim();
        if (!apikey) return false;

        const url =
            "https://api.callmebot.com/whatsapp.php?phone=" +
            encodeURIComponent(CLINICA.whatsapp) +
            "&apikey=" +
            encodeURIComponent(apikey) +
            "&text=" +
            encodeURIComponent(montarMensagem(agendamento));

        try {
            const beacon = new Image();
            beacon.referrerPolicy = "no-referrer";
            beacon.src = url;
        } catch (erro) {
            return false;
        }
        return true;
    }

    /** Lê o formulário e devolve um objeto com a solicitação. */
    function coletarDados() {
        const dados = new FormData(form);

        return {
            protocolo: gerarProtocolo(),
            criadoEm: new Date().toISOString(),
            nome: (dados.get("nome") || "").trim(),
            whatsapp: (dados.get("whatsapp") || "").trim(),
            email: (dados.get("email") || "").trim(),
            especialidade: dados.get("especialidade") || "",
            profissional: dados.get("profissional") || "",
            data: dados.get("data") || "",
            periodo: dados.get("periodo") || "",
            observacoes: (dados.get("observacoes") || "").trim(),
        };
    }

    /** Protocolo no formato CE-AAAAMMDD-XXXX. */
    function gerarProtocolo() {
        const hoje = paraISO(new Date()).replace(/-/g, "");
        const sufixo = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
        return "CE-" + hoje + "-" + sufixo;
    }

    function mostrarSucesso(agendamento, enviadoAuto) {
        const aviso = document.getElementById("successAuto");
        if (aviso) {
            aviso.textContent = enviadoAuto
                ? "Sua solicitação foi enviada automaticamente para o WhatsApp da clínica. A equipe confirmará o horário em breve."
                : "Toque no botão abaixo para enviar sua solicitação pelo WhatsApp da clínica.";
        }

        const resumo = document.getElementById("successResumo");
        if (resumo) {
            resumo.innerHTML = "";
            [
                ["Protocolo", agendamento.protocolo],
                ["Especialidade", CLINICA.nomeEspecialidade(agendamento.especialidade)],
                ["Profissional", CLINICA.nomeProfissional(agendamento.profissional)],
                ["Data", formatarData(agendamento.data) + " · " + CLINICA.nomePeriodo(agendamento.periodo)],
            ].forEach(function (par) {
                const linha = document.createElement("div");
                linha.className = "flex justify-between gap-4 py-2 border-b border-outline-variant/60 last:border-0";
                linha.innerHTML =
                    '<span class="text-label-md text-on-surface-variant">' +
                    escapar(par[0]) +
                    '</span><span class="text-body-md font-medium text-primary text-right">' +
                    escapar(par[1]) +
                    "</span>";
                resumo.appendChild(linha);
            });
        }

        const linkWhats = document.getElementById("successWhatsApp");
        if (linkWhats) {
            linkWhats.href =
                "https://wa.me/" + CLINICA.whatsapp + "?text=" + encodeURIComponent(montarMensagem(agendamento));
        }

        if (overlay) {
            overlay.classList.add("active");
            overlay.setAttribute("aria-hidden", "false");
            // Impede que o Tab alcance o formulário escondido atrás do overlay.
            form.setAttribute("inert", "");
            const foco = overlay.querySelector("h2, button, a");
            if (foco) foco.focus({ preventScroll: true });
        }
    }

    function reiniciarFormulario() {
        form.reset();
        form.removeAttribute("inert");

        form.querySelectorAll(".field").forEach(function (campo) {
            campo.classList.remove("is-valid", "is-invalid");
        });

        // Recarrega a lista de profissionais, já que a especialidade voltou ao início.
        form.elements.especialidade.dispatchEvent(new Event("change", { bubbles: true }));

        if (overlay) {
            overlay.classList.remove("active");
            overlay.setAttribute("aria-hidden", "true");
        }

        form.elements.nome.focus();
    }

    /** Monta a mensagem que será aberta no WhatsApp. */
    function montarMensagem(agendamento) {
        const linhas = [
            "Olá! Gostaria de agendar uma consulta na " + CLINICA.nome + ".",
            "",
            "*Nome:* " + agendamento.nome,
            "*WhatsApp:* " + agendamento.whatsapp,
        ];

        if (agendamento.email) linhas.push("*E-mail:* " + agendamento.email);
        linhas.push("*Especialidade:* " + CLINICA.nomeEspecialidade(agendamento.especialidade));
        linhas.push("*Profissional:* " + CLINICA.nomeProfissional(agendamento.profissional));
        if (agendamento.data) {
            linhas.push(
                "*Data desejada:* " + formatarData(agendamento.data) + " (" + CLINICA.nomePeriodo(agendamento.periodo) + ")"
            );
        }
        if (agendamento.observacoes) linhas.push("*Observações:* " + agendamento.observacoes);
        if (agendamento.protocolo) linhas.push("*Protocolo:* " + agendamento.protocolo);

        return linhas.join("\n");
    }

    /** Botão "Enviar pelo WhatsApp": valida o mínimo e abre a conversa. */
    function enviarPeloWhatsApp() {
        const camposMinimos = ["nome", "whatsapp", "especialidade"];
        const ok = camposMinimos.map(validarCampo).every(Boolean);

        if (!ok) {
            const primeiroErro = form.querySelector(".field.is-invalid .field-input");
            if (primeiroErro) primeiroErro.focus();
            return;
        }

        const agendamento = coletarDados();
        window.open(
            "https://wa.me/" + CLINICA.whatsapp + "?text=" + encodeURIComponent(montarMensagem(agendamento)),
            "_blank",
            "noopener"
        );
    }

    /* ---------------------------------------------------------------------
       Persistência local
       --------------------------------------------------------------------- */

    function lerAgendamentos() {
        try {
            const bruto = localStorage.getItem(CHAVE_STORAGE);
            const lista = bruto ? JSON.parse(bruto) : [];
            return Array.isArray(lista) ? lista : [];
        } catch (erro) {
            // localStorage pode estar bloqueado (aba anônima, política do navegador).
            return [];
        }
    }

    function salvar(agendamento) {
        try {
            const lista = lerAgendamentos();
            lista.unshift(agendamento);
            localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista.slice(0, 20)));
        } catch (erro) {
            /* sem persistência: o fluxo continua funcionando normalmente */
        }
    }

    function remover(protocolo) {
        try {
            const lista = lerAgendamentos().filter(function (item) {
                return item.protocolo !== protocolo;
            });
            localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
        } catch (erro) {
            /* ignora */
        }
        listarAgendamentos();
    }

    /** Mostra as solicitações já feitas neste navegador. */
    function listarAgendamentos() {
        const secao = document.getElementById("meusAgendamentos");
        const lista = document.getElementById("listaAgendamentos");
        if (!secao || !lista) return;

        const itens = lerAgendamentos();
        secao.classList.toggle("hidden", itens.length === 0);
        lista.innerHTML = "";

        itens.forEach(function (item) {
            const card = document.createElement("li");
            card.className =
                "bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4";

            card.innerHTML =
                '<div class="min-w-0">' +
                '<p class="text-label-md text-secondary mb-1">' +
                escapar(item.protocolo) +
                "</p>" +
                '<p class="text-body-md font-medium text-primary truncate">' +
                escapar(CLINICA.nomeEspecialidade(item.especialidade)) +
                " · " +
                escapar(CLINICA.nomeProfissional(item.profissional)) +
                "</p>" +
                '<p class="text-body-md text-on-surface-variant">' +
                escapar(formatarData(item.data)) +
                " · " +
                escapar(CLINICA.nomePeriodo(item.periodo)) +
                "</p>" +
                "</div>";

            const acoes = document.createElement("div");
            acoes.className = "flex items-center gap-2 shrink-0";

            const whats = document.createElement("a");
            whats.className =
                "inline-flex items-center gap-1 text-label-md text-secondary border border-secondary/40 rounded-full px-4 py-2 hover:bg-secondary/5 transition-colors";
            whats.target = "_blank";
            whats.rel = "noopener";
            whats.href = "https://wa.me/" + CLINICA.whatsapp + "?text=" + encodeURIComponent(montarMensagem(item));
            whats.innerHTML = '<span class="material-symbols-outlined text-base">chat</span> Reenviar';

            const excluir = document.createElement("button");
            excluir.type = "button";
            excluir.className =
                "inline-flex items-center gap-1 text-label-md text-on-surface-variant rounded-full px-3 py-2 hover:text-error hover:bg-error-container/40 transition-colors";
            excluir.innerHTML = '<span class="material-symbols-outlined text-base">delete</span>';
            excluir.setAttribute("aria-label", "Remover solicitação " + item.protocolo);
            excluir.addEventListener("click", function () {
                remover(item.protocolo);
            });

            acoes.appendChild(whats);
            acoes.appendChild(excluir);
            card.appendChild(acoes);
            lista.appendChild(card);
        });
    }

    /* ---------------------------------------------------------------------
       Utilitários
       --------------------------------------------------------------------- */

    function paraISO(data) {
        const ajustada = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
        return ajustada.toISOString().split("T")[0];
    }

    function formatarData(iso) {
        if (!iso) return "";
        const partes = iso.split("-");
        if (partes.length !== 3) return iso;
        return partes[2] + "/" + partes[1] + "/" + partes[0];
    }

    function escapar(texto) {
        const div = document.createElement("div");
        div.textContent = texto == null ? "" : String(texto);
        return div.innerHTML;
    }
})();
