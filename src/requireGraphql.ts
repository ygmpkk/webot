import fs from "fs";
import path from "path";
import tag from "graphql-tag";

const pkg = require("../package.json");

export function requireGraphql(fileName: string) {
  const graphqlFileName = fileName.replace(new RegExp(`^${pkg.name}/`), "");
  try {
    const source = fs.readFileSync(path.resolve(__dirname, graphqlFileName), {
      encoding: "utf-8"
    });

    return tag(source);
  } catch (err) {
    console.error("加载 Graphql 文件失败:", err.message);
    throw err;
  }
}
