"use client";

import React, { useEffect, useState } from 'react';
import './style/StockSummary.scss';

function StockSummarye({ name, api }) {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStock();
  }, []);

  const getStock = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/${api}`);
      const data = await res.json();

      if (data.status === 200) {
        setStock(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
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
                <td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td>
              </tr>
            ) : stock.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No data available.</td>
              </tr>
            ) : (
              stock.map((item) => {
                if (!Array.isArray(item.packing)) return null;

                return item.packing.map((packing, subIndex) => (
                  <tr key={`${item.sno}-${subIndex}`}>
                    {subIndex === 0 && (
                      <>
                        <td rowSpan={item.packing.length}>{item.sno}</td>
                        <td rowSpan={item.packing.length}>{item.product}</td>
                      </>
                    )}
                    <td>{packing}</td>
                    <td>{item.Quantity?.[subIndex] || '-'}</td>
                    <td>{item.container?.[subIndex] || '-'}</td>
                  </tr>
                ));
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default StockSummarye;

