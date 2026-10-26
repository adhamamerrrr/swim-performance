const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");
const root = path.resolve(__dirname, "../src");
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((f) =>
      f.isDirectory()
        ? files(path.join(dir, f.name))
        : [path.join(dir, f.name)],
    );
}
const routes = new Set(
  files(path.join(root, "app"))
    .filter((f) => f.endsWith(".tsx") && !path.basename(f).startsWith("_"))
    .map(
      (f) =>
        "/" +
        path
          .relative(path.join(root, "app"), f)
          .replace(/\\/g, "/")
          .replace(/\.tsx$/, "")
          .replace(/\([^/]+\)\//g, "")
          .replace(/(^|\/)index$/, "")
          .replace(/\/$/, ""),
    )
    .map((r) => r || "/"),
);
let destinations = 0;
for (const file of files(root).filter((f) => /\.tsx?$/.test(f))) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  function values(node) {
    if (!node) return;
    if (ts.isStringLiteral(node)) {
      if (node.text.startsWith("/")) {
        assert.ok(routes.has(node.text), `${file}: missing route ${node.text}`);
        destinations++;
      }
    } else if (ts.isObjectLiteralExpression(node)) {
      for (const prop of node.properties)
        if (
          ts.isPropertyAssignment(prop) &&
          prop.name.getText(source) === "pathname"
        )
          values(prop.initializer);
    } else if (ts.isConditionalExpression(node)) {
      values(node.whenTrue);
      values(node.whenFalse);
    }
  }
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      /^router\.(push|replace|navigate)$/.test(node.expression.getText(source))
    )
      values(node.arguments[0]);
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText(source) === "href" &&
      node.initializer &&
      ts.isJsxExpression(node.initializer)
    )
      values(node.initializer.expression);
    ts.forEachChild(node, visit);
  }
  visit(source);
}
for (const mode of ["swimmer", "coach"]) {
  const layout = fs.readFileSync(
    path.join(root, "app", mode, "(tabs)", "_layout.tsx"),
    "utf8",
  );
  for (const match of layout.matchAll(/name="([a-z]+)"/g))
    assert.ok(routes.has(`/${mode}/${match[1]}`));
}
console.log(
  `PASS: ${destinations} explicit navigation destinations and all 10 tabs match ${routes.size} real routes.`,
);
