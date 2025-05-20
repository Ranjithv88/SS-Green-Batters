"use client";

import React, { useEffect, useState } from "react";
import './edit.scss';
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import NotFound from "@/components/404NotFound";
import { usePathname } from 'next/navigation';
import getSectionDetails from '@/lib/data';
import Link from "next/link";
import axios from "axios";

const UserInformation = () => {
    const { data: session, status } = useSession();
    const pathName = usePathname();
    const [style, setStyle] = useState(null);
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notValid, setNotValid] = useState(false);

    useEffect(() => {
        const path = pathName.split('/');
        console.log("Path:", path);
        const sectionName = path[2];

        if (sectionName) {
            const value = getSectionDetails(sectionName);
            if (value) {
                setStyle(value.style);
                setNotValid(false);
            } else {
                setStyle('');
                setNotValid(true);
            }
        } else {
            setNotValid(true);
        }
        if (sectionName && !notValid) {
            getStock(sectionName);
        }
    }, [pathName, notValid]);

    const getStock = async (sectionName) => {
        if (!sectionName) {
            console.error("Section name is invalid");
            return;
        }
        try {
            const response = await axios.get(`http://localhost:3000/api/stock/get/${sectionName}`);
            if (response.data.status === 200)
                setStock(response.data?.products);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return <Loading />;
    }

    if (!session || notValid) {
        return <NotFound />;
    }

    return (
        <main >
            <div className="titleEdit" style={{ backgroundColor: style }}>
                <Link className='Back' href={'/dashboard'}></Link>
                <h2>{pathName.split('/')[2]}</h2>
            </div>
            <div className="table-wrapper">
                <table className="fl-table">
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Product</th>
                            <th>Packing</th>
                            <th>Quantity</th>
                            <th>Container</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan='7' style={{ textAlign: "center", fontSize: '15px' }}>
                                    Please wait...
                                </td>
                            </tr>
                        ) : stock.length === 0 ? (
                            <tr>
                                <td colSpan='7' style={{ textAlign: "center", fontSize: '15px' }}>
                                    No data available. Please try again later.
                                </td>
                            </tr>
                        ) : (
                            stock.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item.packing.map((packing, subIndex) => (
                                        <tr key={`${index}-${subIndex}`}>
                                            {subIndex === 0 && <td rowSpan={item.packing.length}>{item.sno}</td>}
                                            {subIndex === 0 && <td rowSpan={item.packing.length}>{item.product}</td>}
                                            <td>{packing}</td>
                                            <td>{item.quantity[subIndex]}</td>
                                            <td>{item.container[subIndex]}</td>
                                            {subIndex === 0 && (
                                                <td className='operationBtn' rowSpan={item.packing.length}>
                                                    <button className="star-button" style={{ color: 'rgba(215, 197, 7, 1)' }}> Edit {[...Array(6)].map((_, index) => (
                                                        <div className={`star-${index + 1}`} key={index}>
                                                            <svg xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 784.11 815.53" style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }} version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg"><g id="Layer_x0020_1"><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0" /></g></svg>
                                                        </div>
                                                        ))}
                                                    </button>
                                                </td>
                                            )}
                                            {subIndex === 0 && (
                                                <td className='operationBtn' rowSpan={item.packing.length}>
                                                    <button className="star-button" style={{  color: 'rgba(227, 11, 92, 1)' }}> Delete {[...Array(6)].map((_, index) => (
                                                        <div className={`star-${index + 1}`} key={index}>
                                                            <svg xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 784.11 815.53" style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }} version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg"><g id="Layer_x0020_1"><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0" /></g></svg>
                                                        </div>
                                                        ))}
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        )}
                        <tr>
                            <td colSpan='7' style={{ textAlign: "center", fontSize: '15px' }}>
                                <button className="EditButton">
                                    <span> + Add Item </span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default UserInformation;
