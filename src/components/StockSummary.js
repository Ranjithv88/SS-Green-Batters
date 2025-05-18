"use client";

import React, { useEffect, useState } from 'react';
import './style/StockSummary.scss';
import axios from "axios";

function StockSummary({ name, api }) {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStock();
  }, []);

  const getStock = async () => {
    try {
      var response = await axios.get(`http://localhost:3000/api/${api}`);
      setStock(response.data.products)
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
      console.log(stock)
    }
  };

  return (
    <main id="mainStockSummary">
      <h2>{name}</h2>
      <div className="table-wrapper">
        <table className="fl-table">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Product</th>
              <th>Packing</th>
              <th>Quantity</th>
              <th>Container</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", fontSize: '15px' }}>
                  Please wait...
                </td>
              </tr>
            ) : stock.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", fontSize: '15px' }}>
                  No data available. Please try again later.
                </td>
              </tr>
            ) : (
              stock.map((item, index) => (
                <React.Fragment key={index}>
                  {item.Packing.map((packing, subIndex) => (
                    <tr key={`${index}-${subIndex}`}>
                      {subIndex === 0 && <td rowSpan={item.Packing.length}>{item.sno}</td>}
                      {subIndex === 0 && <td rowSpan={item.Packing.length}>{item.Product}</td>}
                      <td>{packing}</td>
                      <td>{item.Quantity[subIndex]}</td>
                      <td>{item.container[subIndex]}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default StockSummary;

