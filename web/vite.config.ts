import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, searchForWorkspaceRoot } from "vite";

const configPath = resolve(import.meta.dirname, "../arcade.config.json");
const config = JSON.parse(readFileSync(configPath, "utf-8"));

export default defineConfig({
    base: "./",
    server: {
        host: true,
        port: config.dev.server.port,
        strictPort: true,
        fs: {
            allow: [searchForWorkspaceRoot(import.meta.dirname), configPath],
        },
    },
});