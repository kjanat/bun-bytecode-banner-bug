import type { BuildOutput } from "bun";
import { relative } from "node:path";

const result: BuildOutput = await Bun.build({
	entrypoints: ["./index.ts"],
	outdir: "./out",
	target: "bun",
	bytecode: true,
});

console.log(
	"Built:",
	result.outputs.map((
		o,
	) => relative(
		process.cwd(),
		o.path,
	)).join(", "),
);
