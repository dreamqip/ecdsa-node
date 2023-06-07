const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const privateKey = toHex(secp256k1.utils.randomPrivateKey());
const publicKey = toHex(secp256k1.getPublicKey(privateKey));

const hashedMessage = toHex(keccak256(utf8ToBytes("Hello, world!")));

const signature = secp256k1.sign(hashedMessage, privateKey);

const verified = secp256k1.verify(signature.toCompactHex(), hashedMessage, publicKey);

console.log(`Signature: ${signature.toCompactHex()}`);
console.log(`Verified: ${verified}`);
console.log(`Private key: ${privateKey}`);
console.log(`Public key: ${publicKey}`);
