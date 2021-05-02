import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ProductCard from "../components/ProductCard";
import { cartStore } from "../store/cart";

function Home({ data }) {
  const cart = cartStore((state) => state.cart);
  const { register, handleSubmit } = useForm();

  const onSubmitForm = (data) => {
    axios
      .post(`http://127.0.0.1:8080/api/products/${cart.id}`, {
        amount: parseInt(data.amount),
        ...cart,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="content">
        <div className="container">
          {data.map((x) => (
            <ProductCard key={x.id} {...x} isBuy />
          ))}
        </div>
        <div className="cart">
          {!cart ? undefined : (
            <>
              <ProductCard {...cart} isBuy={false} />
              <form className="form" onSubmit={handleSubmit(onSubmitForm)}>
                <input
                  type="number"
                  placeholder="Amount"
                  {...register("amount")}
                />
                <button className="btn-pay" type="submit">
                  Pay
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .form {
          margin-top: 24px;
          padding: 16px 32px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .form:hover {
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
        }
        .form input {
          margin-top: 24px;
        }
        .btn-pay {
          margin-top: 24px;
          cursor: pointer;
        }
        .content {
          display: flex;
        }
        .container {
          flex: 1;
          padding: 56px 32px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .cart {
          min-width: 350px;
          height: 100vh;
          background-color: #e9e9e9;
          padding: 24px 32px 0;
        }
      `}</style>
    </>
  );
}

Home.getInitialProps = async function () {
  const res = await axios.get("http://127.0.0.1:8080/api/products");
  const data = await res.data.data;

  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    data: data,
  };
};

export default Home;
