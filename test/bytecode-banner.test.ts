// Suppress debug bun's syscall tracing output
Bun.env.BUN_DEBUG_QUIET_LOGS = "1";

import { $ } from "bun";
import { describe, expect, test } from "bun:test";
import { resolve } from "path";

const root = resolve(import.meta.dir, "..");
const srcdir = resolve(root, "src");
const outdir = resolve(root, "out");

// Use the currently running bun executable for all subprocess calls
// This allows testing with different bun versions (e.g. ./bun/build/debug/bun-debug test)
const bunExe = process.execPath;

describe(`bun@${Bun.version}`, () => {
	describe("source files", () => {
		test.concurrent("source without shebang produces output", async () => {
			const result = await $`${bunExe} ${srcdir}/no-shebang.ts`.text();
			expect(result.trim()).toBe("Hello from bytecode!");
		});

		test.concurrent("source with shebang produces output", async () => {
			const result = await $`${bunExe} ${srcdir}/shebang.ts`.text();
			expect(result.trim()).toBe("Hello from bytecode!");
		});
	});

	describe("bytecode output files", () => {
		test.concurrent("bytecode without shebang produces output", async () => {
			const result = await $`${bunExe} ${outdir}/no-shebang.js`.text();
			expect(result.trim()).toBe("Hello from bytecode!");
		});

		test.concurrent("bytecode with shebang produces output", async () => {
			// BUG in 1.3.5: Parser uses wrong end boundary when scanning for pragma after shebang
			const result = await $`${bunExe} ${outdir}/shebang.js`.text();
			expect(result.trim()).toBe("Hello from bytecode!");
		});
	});
});
