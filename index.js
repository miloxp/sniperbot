import Web3 from "web3";
// import Contract from "web3-eth-contract";
import config from "./config.js";
import promptSync from "prompt-sync";

const prompt = promptSync();
const web3 = new Web3("https://bsc-dataseed1.binance.org:443");
const account = web3.eth.accounts.privateKeyToAccount(config.private_key);
const nonce = web3.eth.getTransactionCount(account.address);
// Contract.setProvider("https://bsc-dataseed1.binance.org:443");
const pancakeContract = new web3.eth.Contract(
  config.pancake_abi,
  config.pancakeRouterContractAddress
);

const buy = (token, value) => {
  const spend = web3.utils.toChecksumAddress(config.wrappedBNBContract);
  const transaction = pancakeContract.methods
    .swapExactETHForTokens([
      0,
      [spend, token],
      account.address,
      new Date().getTime() + 10000,
    ])
    .buildTransaction({
      from: account.address,
      value: web3.utils.toWei(value, "ether"),
      gas: 250000, // 250000 default
      gasPrice: web3.utils.toWei("5", "gwei"), // 5 default
      nonce: nonce,
    });
  console.log("transaction", transaction);
};

async function main() {
  const balanceEther = await web3.eth.getBalance(account.address);
  const balance = web3.utils.fromWei(balanceEther, "ether");

  // console.log("pancakeContract", pancakeContract);
  console.log(`Balance de BNB: ${balance}`);
  let token = prompt("Contrato token: ");
  let value = prompt("Cantidad a comprar en bnb: ");
  console.log("Comprando...");
  buy(token, value);
}
main();
