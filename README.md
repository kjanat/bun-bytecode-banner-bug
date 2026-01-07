# bun-bytecode-shebang-bug

Bytecode builds with shebang silently fail to execute.

## Reproduce

```bash
bun test
```

## Expected

All tests pass.

## Actual

```
bun@1.3.5 > bytecode output files > bytecode with shebang produces output [FAIL]
```

Bytecode with shebang: no output, exit code 0.

<details open>
<summary>Full test output</summary>

```sh
bun test v1.3.5 (1e86cebd)

test/bytecode-banner.test.ts:
✓ bun@1.3.5 > source files > source without shebang produces output [11.00ms]
✓ bun@1.3.5 > source files > source with shebang produces output [9.00ms]
✓ bun@1.3.5 > bytecode output files > bytecode without shebang produces output [10.00ms]
35 |   });
36 |
37 |   test("bytecode with shebang produces output", async () => {
38 |    // BUG in 1.3.5: Parser uses wrong end boundary when scanning for pragma after shebang
39 |    const result = await $`bun ${outdir}/index-shebang.js`.text();
40 |    expect(result.trim()).toBe("Hello from bytecode!");
                              ^
error: expect(received).toBe(expected)

Expected: "Hello from bytecode!"
Received: ""

      at <anonymous> (/home/kjanat/projects/bun-bytecode-banner-bug/test/bytecode-banner.test.ts:40:26)
✗ bun@1.3.5 > bytecode output files > bytecode with shebang produces output [9.00ms]

 3 pass
 1 fail
 4 expect() calls
Ran 4 tests across 1 file. [65.00ms]
```

</details>

## Cause

Parser used wrong end boundary (`self.lexer.end` instead of `end`) when
scanning for pragma after shebang.

## Fix

[`src/ast/Parser.zig:1497`](https://github.com/oven-sh/bun/commit/c62b8bc193012ae2572a531d11bef42c4c8c3cc9#diff-fab595e18428ee340e085d96a598c8eb6894b4544621409616de77542507f39fL1497)

```diff
-        while (cursor < self.lexer.end) : (cursor += 1) {
+        while (cursor < end) : (cursor += 1) {
```

Proposed fix: https://github.com/kjanat/bun/tree/bytecode-banner-bug

## Workaround

Remove shebang from source when using `bytecode: true`.

## Environment

- Bun 1.3.5
- Linux x64
