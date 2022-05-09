import React, { useState, useEffect } from "react";
import logo from "../logo.png";
import "./App.css";
import Web3 from "web3";
import Marketplace from "../abis/Marketplace.json";
import Main from "./Main.js";
// import {init} from "./Web3Client.js"

function App() {
  const [account, setAccount] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketplace, setMarketplace] = useState({});

  useEffect(() => {
    // init();
    let selectedAccount;

    const loadApp = async () => {
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

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkData = Marketplace.networks[networkId];
      if (networkData) {
        const marketplace = new web3.eth.Contract(
          Marketplace.abi,
          Marketplace.networks[networkId].address
        );

        setMarketplace(marketplace);
        // console.log(values.marketplace.methods)
        const productCount = await marketplace.methods.productCount().call();
        setProductCount(productCount);
        for (var i = 1; i <= productCount; i++) {
          const product = await marketplace.methods.products(i).call();
          setProducts((products) => [...products, product]);
        }
        setLoading(false);
      } else {
        window.alert("Web3 not connected");
      }
    };
    loadApp();
  }, []);

  console.log(productCount);

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dapp University's Blockchain Marketplace
        </a>
      </nav>

      <div className="container-fluid mt-5">
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <Main
            products={products}
            marketplace={marketplace}
            account={account}
          />
        )}

        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logo} className="App-logo" alt="logo" />
              </a>
              <h1>Dapp University Starter Kit</h1>
              <p>
                Edit <code>src/components/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                LEARN BLOCKCHAIN{" "}
                <u>
                  <b>NOW! </b>
                </u>
              </a>
              <p>{account}</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
