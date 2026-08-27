// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Testes funcionais do site Clinical Excellence.
 * Usa o Microsoft Edge já instalado (channel "msedge"), então não é preciso
 * baixar navegadores do Playwright.
 */
module.exports = defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    reporter: [["list"]],

    use: {
        baseURL: "http://127.0.0.1:8080",
        channel: "msedge",
        headless: true,
        trace: "on-first-retry",
    },

    projects: [
        { name: "edge", use: { ...devices["Desktop Edge"] } },
    ],

    // Sobe o servidor estático antes dos testes e derruba ao final.
    webServer: {
        command: "npx http-server -p 8080 -c-1 --silent",
        url: "http://127.0.0.1:8080/index.html",
        reuseExistingServer: !process.env.CI,
        timeout: 60000,
    },
});
