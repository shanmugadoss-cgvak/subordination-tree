const bcrypt = require("bcryptjs");

const passphrase = "Admin@12345678901234"; // Replace this with your actual passphrase
const hashedPassphrase = bcrypt.hashSync(passphrase, 10);

console.log("Hashed Passphrase:", hashedPassphrase);
