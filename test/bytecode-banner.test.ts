import { $ } from "bun";
import { beforeAll, describe, expect, test } from "bun:test";
import { resolve } from "path";

const root = resolve(import.meta.dir, "..");
const srcdir = resolve(root, "src");
const outdir = resolve(root, "out");

describe(`bun@${Bun.version}`, () => {
	beforeAll(async () => {
		await $`bun ${
			resolve(
				root,
				"build.ts",
			)
		}`.quiet();
	});

	describe("source files", () => {
		test("source without shebang produces output", async () => {
			const result = await $`bun ${srcdir}/index-no-shebang.ts`.text();
			expect(result.trim()).toBe("Hello from bytecode!");
		});

		test("source with shebang produces output", async () => {
			const result = await $`bun ${srcdir}/index-shebang.ts`.text();
			expect(result.trim()).toBe("Hello from bytecode!");
		});
	});

	describe("bytecode output files", () => {
		test("bytecode without shebang produces output", async () => {
			const result = await $`bun ${outdir}/index-no-shebang.js`.text();
			expect(result.trim()).toBe("Hello from bytecode!");
		});

		test("bytecode with shebang produces output", async () => {
			// BUG in 1.3.5: Parser uses wrong end boundary when scanning for pragma after shebang
			const result = await $`bun ${outdir}/index-shebang.js`.text();
			expect(result.trim()).toBe("Hello from bytecode!");
		});
	});
});
