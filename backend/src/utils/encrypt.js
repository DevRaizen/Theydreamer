const crypto = require("crypto");
require("dotenv").config();

const SECRET_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

function encrypt(data) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY),
    iv,
  );
  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

module.exports = { encrypt };
