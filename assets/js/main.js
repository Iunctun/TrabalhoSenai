/**
 * Comportamentos compartilhados por todas as páginas:
 * header, menu mobile, acordeão do FAQ, animação de entrada,
 * fallback de imagens e preenchimento de dados da clínica.
 */
(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        headerScroll();
        menuMobile();
        acordeao();
        revelarAoRolar();
        fallbackImagens();
        preencherDadosDaClinica();
        formularioRapido();
        anoAtual();
    });

    /** Sombra mais forte no header assim que a página é rolada. */
    function headerScroll() {
        const header = document.getElementById("mainHeader");
        if (!header) return;

        const atualizar = function () {
            header.classList.toggle("shadow-md", window.scrollY > 20);
            header.classList.toggle("shadow-sm", window.scrollY <= 20);
        };

        atualizar();
        window.addEventListener("scroll", atualizar, { passive: true });
    }

    /** Abre/fecha o menu de navegação em telas pequenas. */
    function menuMobile() {
        const botao = document.querySelector(".menu-toggle");
        const menu = document.getElementById("mobileMenu");
        if (!botao || !menu) return;

        const fechar = function () {
            menu.classList.remove("open");
            botao.classList.remove("open");
            botao.setAttribute("aria-expanded", "false");
        };

        botao.addEventListener("click", function () {
            const aberto = menu.classList.toggle("open");
            botao.classList.toggle("open", aberto);
            botao.setAttribute("aria-expanded", String(aberto));
        });

        // Fecha ao clicar em um link do menu ou ao pressionar Esc.
        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", fechar);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") fechar();
        });
    }

    /** FAQ em acordeão: abre um item e fecha os demais. */
    function acordeao() {
        const itens = document.querySelectorAll(".accordion-item");
        if (!itens.length) return;

        itens.forEach(function (item) {
            const botao = item.querySelector(".accordion-trigger");
            if (!botao) return;

            botao.addEventListener("click", function () {
                const jaAtivo = item.classList.contains("active");

                itens.forEach(function (outro) {
                    outro.classList.remove("active");
                    const trigger = outro.querySelector(".accordion-trigger");
                    if (trigger) trigger.setAttribute("aria-expanded", "false");
                });

                if (!jaAtivo) {
                    item.classList.add("active");
                    botao.setAttribute("aria-expanded", "true");
                }
            });
        });
    }

    /** Revela as seções conforme entram na viewport. */
    function revelarAoRolar() {
        const alvos = document.querySelectorAll(".reveal");
        if (!alvos.length) return;

        if (!("IntersectionObserver" in window)) {
            alvos.forEach(function (el) {
                el.classList.add("visible");
            });
            return;
        }

        const observer = new IntersectionObserver(
            function (entradas) {
                entradas.forEach(function (entrada) {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("visible");
                        observer.unobserve(entrada.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
        );

        alvos.forEach(function (el) {
            observer.observe(el);
        });
    }

    /**
     * As imagens vêm de uma URL remota do Stitch. Se alguma falhar,
     * o container mantém o gradiente da classe .media em vez de mostrar
     * o ícone de imagem quebrada.
     */
    function fallbackImagens() {
        document.querySelectorAll("img").forEach(function (img) {
            img.addEventListener("error", function () {
                img.classList.add("media-failed");
            });
        });
    }

    /**
     * Preenche telefone, e-mail, endereço e links de WhatsApp a partir
     * de assets/js/clinica.js, usando atributos data-clinica no HTML.
     */
    function preencherDadosDaClinica() {
        if (typeof CLINICA === "undefined") return;

        document.querySelectorAll("[data-clinica]").forEach(function (el) {
            const valor = CLINICA[el.dataset.clinica];
            if (valor) el.textContent = valor;
        });

        document.querySelectorAll("[data-whatsapp-link]").forEach(function (el) {
            const texto = el.dataset.whatsappLink || "Olá! Gostaria de agendar uma consulta.";
            el.href = "https://wa.me/" + CLINICA.whatsapp + "?text=" + encodeURIComponent(texto);
        });

        document.querySelectorAll("[data-tel-link]").forEach(function (el) {
            el.href = "tel:+55" + CLINICA.telefone.replace(/\D/g, "");
        });
    }

    /**
     * Formulário curto da home: não envia nada, apenas leva o visitante para
     * agendar.html já com os campos preenchidos via query string.
     */
    function formularioRapido() {
        const form = document.getElementById("formRapido");
        if (!form) return;

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const params = new URLSearchParams();
            ["nome", "whatsapp", "especialidade"].forEach(function (campo) {
                const valor = (form.elements[campo].value || "").trim();
                if (valor) params.set(campo, valor);
            });

            const query = params.toString();
            window.location.href = "agendar.html" + (query ? "?" + query : "");
        });
    }

    /** Mantém o ano do rodapé sempre atualizado. */
    function anoAtual() {
        document.querySelectorAll("[data-ano]").forEach(function (el) {
            el.textContent = String(new Date().getFullYear());
        });
    }
})();
