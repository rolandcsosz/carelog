import fs from "fs";
import path from "path";

const filePath = path.resolve("./routes/routes.ts");
let content = fs.readFileSync(filePath, "utf8");

content = content.replace(/from\s*(['"]\.\/\.\.\/controllers\/.*?)(['"])/g, "from $1.js$2");
content = content.replace(/from\s*(['"]\.\/auth)(['"])/g, "from $1.js$2");

fs.writeFileSync(filePath, content, "utf8");
console.log("✔ Added .js to controller and auth imports");
