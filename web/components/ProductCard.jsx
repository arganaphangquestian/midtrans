import React from "react";
import { cartStore } from "../store/cart";

// Arrow Function
const ProductCard = ({ id, product_name, price, description, isBuy }) => {
  const addCart = cartStore((state) => state.addCart);
  return (
    <>
      <div className="product">
        <h1>{product_name}</h1>
        <p>{description}</p>
        <div className="product-footer">
          <span>IDR {price}</span>
          {isBuy ? (
            <button
              onClick={() => addCart({ id, product_name, description, price })}
            >
              Buy
            </button>
          ) : undefined}
        </div>
      </div>

      <style jsx>{`
        .product {
          width: fit-content;
          height: fit-content;
          max-width: 350px;
          padding: 16px 32px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .product:hover {
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
        }
        .product h1,
        .product p {
          margin-bottom: 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .product p {
          line-height: 2em;
        }
        .product-footer {
          display: flex;
          justify-content: space-between;
        }
        .product-footer button {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default ProductCard;
