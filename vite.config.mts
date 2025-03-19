import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "url";
import VuePlugin from "@vitejs/plugin-vue";
import { viteSingleFile as SinglefilePlugin } from "vite-plugin-singlefile";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        manifest: true,
        base: env.FRONTEND_BASE || "./",
        build: {
            outDir: "../dist",
            emptyOutDir: true,
            target: "esnext",
            minify: true,
            reportCompressedSize: false,
        },
        root: "./src",
        envDir: "../",
        plugins: [
            VuePlugin(),
            SinglefilePlugin({
                removeViteModuleLoader: true,
            }),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    charset: false,
                    api: "modern-compiler",
                },
            },
        },
        define: {
        },
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        server: {
            cors: true,
            port: 3000,
            https: env.DEV_SERVER_CERT
                ? {
                    cert: env.DEV_SERVER_CERT,
                    key: env.DEV_SERVER_KEY,
                }
                : undefined,
            hmr: {
                host: "localhost",
            },
            headers: {
                "Access-Control-Allow-Private-Network": "true",
            },
            proxy: JSON.parse(env.DEV_SERVER_PROXY_JSON || "{}") || {},
        },
    };
});
