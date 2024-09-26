import { defineConfig } from "tsup";

export default defineConfig((options) => {
	const isDev = options.env?.["NODE_ENV"] === "dev";
	return {
		entry: ["src"],
		outDir: "lib",
		sourcemap: true,
		watch: isDev,
		format: ["esm", "cjs"],
		dts: true,
	};
});
