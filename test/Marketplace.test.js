const { assert } = require("chai");

require('chai')
.use(require('chai-as-promised'))
.should()

const Marketplace = artifacts.require("Marketplace.sol");

contract("Marketplace", ([deployer, seller, buyer]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await marketplace.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await marketplace.name();
      assert.equal(name, "Dapp University Marketplace");
    });
  });

  describe("products", async () => {
    let result, productCount

    before(async () => {
      result = await marketplace.createProduct("iPhone x", web3.utils.toWei('1',"Ether"), {from: seller});
      productCount = await marketplace.productCount();
    })

    it("creates products", async () => {
      // SUCCESS
      assert.equal(productCount, 1);
      // console.log(result.logs)
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name,"iPhone x",'name is correct')
      assert.equal(event.price,'1000000000000000000','price is correct')
      assert.equal(event.owner,seller,'is correct')
      assert.equal(event.purchased, false,'purchased is correct')

      // FAILURE
      // name
      await await marketplace.createProduct("", web3.utils.toWei('1',"Ether"), {from: seller}).should.be.rejected;
      // price
      await await marketplace.createProduct("iPhone x",0, {from: seller}).should.be.rejected;
    });


    it("lists products", async () => {
      const product = await marketplace.products(productCount);
      assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(product.name,"iPhone x",'name is correct')
      assert.equal(product.price,'1000000000000000000','price is correct')
      assert.equal(product.owner, seller,'is correct')
      assert.equal(product.purchased, false,'purchased is correct')
    });

    it("sells products", async () => {
      let oldSellerBalance;
      oldSellerBalance = await web3.eth.getBalance(seller);
      oldSellerBalance = new web3.utils.BN(oldSellerBalance);

      //SUCCESS : buyer makes purchase
      result = await marketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('1',"Ether")});
    
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name,"iPhone x",'name is correct')
      assert.equal(event.price,'1000000000000000000','price is correct')
      assert.equal(event.owner, buyer,'is correct')
      assert.equal(event.purchased, true,'purchased is correct')

      let newSellerBalance;
      newSellerBalance = await web3.eth.getBalance(seller);
      newSellerBalance = new web3.utils.BN(newSellerBalance);

      let price;
      price = web3.utils.toWei('1','Ether');
      price = new web3.utils.BN(price);

      const expectedBalance = oldSellerBalance.add(price);
      assert.equal(newSellerBalance.toString(),expectedBalance.toString())
    
      //Failure 
      await marketplace.purchaseProduct(99,{from: buyer, value: web3.utils.toWei('1',"Ether")}).should.be.rejected;
      await marketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('0.5',"Ether")}).should.be.rejected;
      await marketplace.purchaseProduct(productCount,{from: deployer, value: web3.utils.toWei('0.5',"Ether")}).should.be.rejected;
      await marketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('1',"Ether")}).should.be.rejected;

    });
  });
});
