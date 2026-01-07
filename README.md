# bun-bytecode-shebang-bug

Bytecode builds with shebang silently fail to execute.

## Reproduce

```bash
bun build.ts        # Build with bytecode
bun index.ts        # Source works
bun out/index.js    # Bytecode: no output, exits 0
```

## Expected

```console
Hello from bytecode!
```

## Actual

No output, exit code 0.

## Cause

The shebang is preserved before the `// @bun @bytecode @bun-cjs` pragma, causing Bun to not recognize/execute the CJS bytecode wrapper.

```js
#!/usr/bin/env bun           // <-- shebang first
// @bun @bytecode @bun-cjs   // <-- pragma not on line 1
(function(exports, require, module, __filename, __dirname) { ... })
```

## Workaround

Remove shebang from source when using `bytecode: true`.

## Environment

- Bun 1.3.5
- Linux x64
