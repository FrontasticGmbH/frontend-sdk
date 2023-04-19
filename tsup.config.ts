import { defineConfig } from "tsup";

export default defineConfig((options) => {
	const dev = options.env?.["ENV"] === "dev";
	return {
		entry: dev ? ["src/index.ts"] : ["src"],
		outDir: "lib",
		sourcemap: true,
		watch: dev,
		format: dev ? undefined : ["esm", "cjs"],
		dts: true,
	};
});
