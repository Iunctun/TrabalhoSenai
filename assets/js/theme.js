/**
 * Design tokens do sistema "Clinical Excellence".
 * Extraídos do DESIGN.md exportado pelo Stitch (pasta
 * stitch_agendamento_cl_nico_particular_moderno/) e compartilhados por todas as páginas.
 * Este arquivo precisa ser carregado DEPOIS do script do Tailwind CDN.
 */
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#000000",
                "on-primary": "#ffffff",
                "primary-container": "#131b2e",
                "on-primary-container": "#7c839b",
                "primary-fixed": "#dae2fd",
                "primary-fixed-dim": "#bec6e0",
                "on-primary-fixed": "#131b2e",
                "on-primary-fixed-variant": "#3f465c",
                "inverse-primary": "#bec6e0",

                secondary: "#006b5f",
                "on-secondary": "#ffffff",
                "secondary-container": "#62fae3",
                "on-secondary-container": "#007165",
                "secondary-fixed": "#62fae3",
                "secondary-fixed-dim": "#3cddc7",
                "on-secondary-fixed": "#00201c",
                "on-secondary-fixed-variant": "#005047",

                tertiary: "#000000",
                "on-tertiary": "#ffffff",
                "tertiary-container": "#001e2f",
                "on-tertiary-container": "#008cc7",
                "tertiary-fixed": "#c9e6ff",
                "tertiary-fixed-dim": "#89ceff",
                "on-tertiary-fixed": "#001e2f",
                "on-tertiary-fixed-variant": "#004c6e",

                error: "#ba1a1a",
                "on-error": "#ffffff",
                "error-container": "#ffdad6",
                "on-error-container": "#93000a",

                background: "#f7f9fb",
                "on-background": "#191c1e",
                surface: "#f7f9fb",
                "surface-dim": "#d8dadc",
                "surface-bright": "#f7f9fb",
                "surface-container-lowest": "#ffffff",
                "surface-container-low": "#f2f4f6",
                "surface-container": "#eceef0",
                "surface-container-high": "#e6e8ea",
                "surface-container-highest": "#e0e3e5",
                "surface-variant": "#e0e3e5",
                "surface-tint": "#565e74",
                "on-surface": "#191c1e",
                "on-surface-variant": "#45464d",
                "inverse-surface": "#2d3133",
                "inverse-on-surface": "#eff1f3",
                outline: "#76777d",
                "outline-variant": "#c6c6cd",
            },
            borderRadius: {
                sm: "0.25rem",
                DEFAULT: "0.5rem",
                md: "0.75rem",
                lg: "1rem",
                xl: "1.5rem",
                full: "9999px",
            },
            spacing: {
                base: "8px",
                gutter: "24px",
                "margin-mobile": "20px",
                "section-gap-desktop": "120px",
                "section-gap-mobile": "64px",
                "container-max-width": "1280px",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
            },
            fontSize: {
                "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
                "display-lg-mobile": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
                "headline-md": ["30px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
                "headline-sm": ["24px", { lineHeight: "1.4", fontWeight: "600" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "500" }],
            },
            maxWidth: {
                "container-max-width": "1280px",
            },
            boxShadow: {
                soft: "0 20px 40px -15px rgba(15, 23, 42, 0.05)",
                lift: "0 28px 56px -20px rgba(15, 23, 42, 0.12)",
            },
        },
    },
};
