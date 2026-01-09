# bun-bytecode-shebang-bug

Bytecode builds with shebang would silently fail to execute in Bun 1.3.5.

**Status: FIXED** in [v1.3.6-canary.84][fix]

## The Bug

Parser used wrong end boundary (`self.lexer.end` instead of `end`) when scanning for pragma after shebang, causing bytecode with shebang to produce no output.

## Fix

[`src/ast/Parser.zig:1497`][fix:Parser.zig]

```diff
-        while (cursor < self.lexer.end) : (cursor += 1) {
+        while (cursor < end) : (cursor += 1) {
```

PR: https://github.com/oven-sh/bun/pull/25868

## Affected

Bun <= 1.3.5

## Workaround (for older versions)

Remove shebang from source when using `bytecode: true`.

[fix]: https://github.com/oven-sh/bun/commit/65d006aae05fbf974282ab8edfe518d3f2a55465
[fix:Parser.zig]: https://github.com/oven-sh/bun/commit/65d006aae05fbf974282ab8edfe518d3f2a55465#diff-fab595e18428ee340e085d96a598c8eb6894b4544621409616de77542507f39fL1494-R1497

<!--markdownlint-disable-file MD034-->
