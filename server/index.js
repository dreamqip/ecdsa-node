const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02bb6d2ea351037f6bdd21efe64268b4b9ec181ab7652ff563a15209edfb0fd3a2": 100, // Charlie, private key: a7c6b6b2b48086d90981c4c00c4c70d861e95211d7d5ad742a2353a4105fb9ad
  "033b5676082727cae97a1f55fea883d7600cbb01bd07c5f6a065b62bb6d17e7310": 50, // Bob, private key: 196789da0ad12c3c5df3426bc9f3895f4c8d7c254ee82b48d8b2d7e0c3b26232
  "02d0e9995f286224586533582b006ca65f10f6428a0b6376172ebf41f9a0562d5d": 75, // Alice, private key: c2a1a2793fc96b1647aba7fcab43f650b984e5536d7b61acf8bfec60aaa8bc4c
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, hashedMessage, signature } = req.body;

  const verified = secp256k1.verify(signature, hashedMessage, sender);

  if (!verified) {
    res.status(400).send({ message: "Invalid signature!" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
