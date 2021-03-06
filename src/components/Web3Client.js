import Web3 from "web3";
import Marketplace from "../abis/Marketplace.json"

let selectedAccount;

let isInitialized = false;

export const init = async() => {
  const providerUrl = process.env.PROVIDER_URL || "http://localhost:8545";

  let provider = window.ethereum;
  if (typeof provider !== "undefined") {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
				selectedAccount = accounts[0];
        console.log(`selected account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
      });

    window.ethereum.on("accountsChanged", function(accounts) {
			selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  }

  const web3 = new Web3(provider);

	const networkId = await web3.eth.net.getId();

	const marketplace = new web3.eth.Contract(
		Marketplace.abi,
		Marketplace.networks[networkId].address
	);

	const accounts = await web3.eth.getAccounts();
	console.log(accounts)


};
