import React, { useState, useEffect } from "react";

function Main ({products, marketplace, account}){

	const initialValues = {
		productName: "",
		price: ""
	}
	const [inputs, setInputs] = useState(initialValues);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

	useEffect(() => {
		console.log(account)
	}, []);


	const createProduct = (productName, price) => {
    setInputs({ loading: true });
    marketplace.methods.createProduct( productName, price )
      .send({ from: account })
      .once("receipt", (receipt) => {
        setInputs({ loading: false });
      });
  };

	const purchaseProduct = (id, price) => {
    setInputs({ loading: true });
    marketplace.methods.purchaseProduct( id )
      .send({ from: account, value: price })
      .once("receipt", (receipt) => {
        setInputs({ loading: false });
      });
  };


    return (
      <div id="content">
        <h1>Add Product</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            // values.price = window.web3.utils.toWei(
            //   this.productPrice.value.toString(),
            //   "Ether"
            // );
            createProduct(inputs.productName, inputs.price);
          }}
        >
          <div className="form-group mr-sm-2">
            <input
							name="productName"
              id="productName"
              type="text"
              value={inputs.productName}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Product Name"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
							name="price"
              id="productPrice"
              type="text"
							value={inputs.price}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Product Price"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
        <p> </p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
					{ products.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{product.price} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                    { !product.purchased
                      ? <button
                          name={product.id}
                          value={product.price}
                          onClick={(event) => {
                            purchaseProduct(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }

export default Main;
