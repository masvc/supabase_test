const fs = require("fs");
const path = require("path");

// .envファイルを読み込む
const envPath = path.join(__dirname, ".env");
const env = fs
  .readFileSync(envPath, "utf8")
  .split("\n")
  .filter((line) => line.trim() !== "")
  .reduce((acc, line) => {
    const [key, value] = line.split("=");
    acc[key] = value;
    return acc;
  }, {});

// config.jsを生成
const configContent = `
// このファイルは自動生成されます。直接編集しないでください。
export const config = {
  supabaseUrl: "${env.SUPABASE_URL}",
  supabaseKey: "${env.SUPABASE_KEY}"
};
`;

fs.writeFileSync(path.join(__dirname, "config.js"), configContent.trim());
console.log("config.js has been generated!");
