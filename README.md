# bun-bytecode-shebang-bug

Bytecode builds with shebang silently fail to execute.

## Reproduce

```bash
# Build with bytecode
# equal to `bun build --outdir out --target bun --bytecode index-*.ts`
bun run build

# Source with shebang: works
# equal to `bun index-shebang.ts`
bun demo:source:shebang

# Bytecode with shebang: no output, exits 0
# equal to `bun out/index-shebang.js`
bun demo:out:shebang

# Source without shebang: works
# equal to `bun index-no-shebang.ts`
bun demo:source:noshebang

# Bytecode without shebang: works
# equal to `bun out/index-no-shebang.js`
bun demo:out:noshebang
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
