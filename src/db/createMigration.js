const fs = require("fs");
const path = require("path");

const name = process.argv[2];
if (!name) {
    console.error("❌ Migration name required");
    process.exit(1);
}

const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);

const fileName = `${timestamp}_${name}.js`;
const filePath = path.join(__dirname, "../migrations", fileName);

const template = `module.exports = {
  up: async (client) => {
    // write SQL here
  },

  down: async (client) => {
    // rollback SQL here
  }
};
`;

fs.writeFileSync(filePath, template);
console.log(`✅ Migration created: ${fileName}`);