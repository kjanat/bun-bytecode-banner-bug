import { $ } from "bun";
import type { BuildOutput } from "bun";
import { relative } from "path";

const BUG_VERSION = "1.3.5";

if (Bun.semver.order(Bun.version, BUG_VERSION) > 0) {
	console.log("Nice, working on a fix?\n");
} else if (Bun.version !== BUG_VERSION) {
	console.warn(
		"This bug was found in Bun %s. You are running Bun %s.",
		BUG_VERSION,
		Bun.version,
	);
}

const outdir = "./out";

await $`rm -rf ${outdir}`;

const result: BuildOutput = await Bun.build({
	entrypoints: [
		"./index-shebang.ts",
		"./index-no-shebang.ts",
	],
	outdir: outdir,
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
