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
import { useRouter } from "next/navigation";

const UserInformation = () => {
    const { data: session, status } = useSession();
    const pathName = usePathname();
    const [style, setStyle] = useState(null);
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notValid, setNotValid] = useState(false);
    const [addItem, setAddItem] = useState(false);
    const columnName = ['Product', 'Packing', 'Quantity', 'Container'];
    const [row, setRow] = useState(1);
    const [product, setProduct] = useState('');
    const [packing, setPacking] = useState(['']);
    const [quantity, setQuantity] = useState(['']);
    const [container, setContainer] = useState(['']);
    const [productValidation, setProductValidation] = useState(false)
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const [save, setSave] = useState(false);
    const [productExist, setProductExist] = useState(false);
    const path = pathName.split('/');
    const router = useRouter();

    const [deleteProcess, setDeleteProcess] = useState(false);
    const [deletePopMessage, setDeletePopMessage] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const adjustArrayLength = (prevArray) => {
            const updated = [...prevArray];
            if (row > prevArray.length) {
                while (updated.length < row) updated.push('');
            } else {
                updated.length = row;
            }
            return updated;
        };

        setPacking(prev => {
            const updated = adjustArrayLength(prev);
            console.log('Packing updated:', updated);
            return updated;
        });

        setQuantity(prev => {
            const updated = adjustArrayLength(prev);
            console.log('Quantity updated:', updated);
            return updated;
        });

        setContainer(prev => {
            const updated = adjustArrayLength(prev);
            console.log('Container updated:', updated);
            return updated;
        });

        console.log('Row changed to:', row);
    }, [row]);

    useEffect(() => {
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
            const response = await axios.get(`/api/stock/get/${sectionName}`);
            if (response.data.status === 200)
                setStock(response.data?.products);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        } finally {
            setLoading(false);
        }
    }

    const SetNewData = (e, field, indexRow) => {
        if(field==='Packing')
            setPacking(prevItems => { const updatedItems = [...prevItems]; updatedItems[indexRow] = e.target.value; return updatedItems })
        else if (field==='Quantity')
            setQuantity(prevItems => { const updatedItems = [...prevItems]; updatedItems[indexRow] =  e.target.value; return updatedItems })
        else
            setContainer(prevItems => { const updatedItems = [...prevItems]; updatedItems[indexRow] =  e.target.value; return updatedItems })
        console.log({ packing, quantity, container }, indexRow, field)
    }

    const validation = async() => {
        setSave(true)
        if(addItem){
            if(product===''){
                const input = document.querySelector('#editInput')
                if (input) {
                    input.focus()
                }
                setProductValidation(true)
                await sleep(5000)
                setProductValidation(false)
            }else{
                await saveData()
            }
        }
        setSave(false)
    } 

    const saveData = async () => {
        try {
            const response = await axios.post(`/api/stock/edit/${path[2]}`, {
                sno: stock.length+1,
                product: product,
                packing: packing,
                quantity: quantity,
                container: container
            },{
                withCredentials: true
            })
            if(response.status===201){
                console.log('Inserted:', response.data)
                setProductExist(false)
                setAddItem(false)
                setRow(1)
                window.location.reload()
            }
        } catch (error) {
            if(error.response.status===403){
                console.log(" Access Denied ...! ")
                alert(" Access Denied ...! ")
            }else if (error.response.status===409){
                console.log("enter")
                setProductExist(true)
            } 
            const errorMessage = error.response?.data?.error || ' Something went wrong '
            console.error('Insert error:', errorMessage)
        }
    }

    const deleteProduct = async(id) => {
        setDeleteProcess(true)
        if(id){
            setDeletePopMessage(false)
            try {
                const response = await axios.delete(`/api/stock/edit/${path[2]+'+'+id}`, { withCredentials: true })
                if(response.status===200) window.location.reload()
            } catch(error) {
                const errorMessage = error.response?.data?.error || ' Something went wrong '
                console.error('Insert error:', errorMessage)
            } finally {
                setDeleteProcess(false)
            }
        }else {
            console.log("Id is Null : ",id)
        }
    }

    if (status === 'loading') return <Loading />

    if (!session || notValid) return <NotFound />

    return (
        <main >
            <div className="titleEdit" style={{ backgroundColor: style }}>
                <Link className='Back' href={'/dashboard'}></Link>
                <h2>{pathName.split('/')[2]}</h2>
            </div>
            <div className="table-wrapper" >
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
                                                    <button className="star-button" style={{ color: 'rgba(215, 197, 7, 1)' }} onClick={()=>router.push(`${path[2]}/${item._id}`)}> Edit {[...Array(6)].map((_, index) => (
                                                        <div className={`star-${index + 1}`} key={index}>
                                                            <svg xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 784.11 815.53" style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }} version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg"><g id="Layer_x0020_1"><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" className="fil0" /></g></svg>
                                                        </div>
                                                        ))}
                                                    </button>
                                                </td>
                                            )}
                                            {subIndex === 0 && (
                                                <td className='operationBtn' rowSpan={item.packing.length}>
                                                    <button className="star-button" style={{  color: 'rgba(227, 11, 92, 1)' }} onClick={()=>{setDeletePopMessage(true), setDeleteId(item._id), deleteProductName()}}> Delete {[...Array(6)].map((_, index) => (
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
                       {addItem && (<>
                        <tr>
                           <td rowSpan={row}>{stock.length + 1}</td>
                            <td rowSpan={row}>
                                <input className="editInput" id='editInput' minLength={2} onChange={(e)=>setProduct(e.target.value)} value={product} placeholder={columnName[0]} />
                                {productValidation&&<h5 style={{ color: 'rgba(227, 11, 92, 1)' }}> places Enter the Product name </h5>}
                                {productExist&&<h5 style={{ color: 'rgba(227, 11, 92, 1)' }}> Already Product Exist... </h5>}
                            </td>
                            {[...Array(3)].map((_, index) => (
                                <td key={index}>
                                    <input className="editInput" minLength={2} onChange={(e)=>SetNewData(e,columnName[index+1],0)} placeholder={columnName[index+1]} />
                                </td>
                            ))}
                            <td><button className="btn-2" onClick={()=>setRow(pre=>pre+1)}><span style={{ pointerEvents: 'none' }}> + Add Row </span></button></td>
                            <td><button className="btn-2" onClick={()=>{setAddItem(false),setRow(1)}}><span style={{  color: 'rgba(227, 11, 92, 1)', pointerEvents: 'none' }}> X cancel </span></button></td>
                        </tr>
                        {[...Array(row-1)].map((_, indexRow) => ( 
                        <tr key={indexRow}>
                             {[...Array(3)].map((_, index) => (
                                <td key={index}>
                                    <input className="editInput" minLength={2} onChange={(e)=>SetNewData(e,columnName[index+1],indexRow+1)} placeholder={columnName[index+1]} />
                                </td>
                            ))}
                            {indexRow===0&&<td colSpan={2}><button className="btn-2" onClick={()=>setRow(pre=>pre-1)}><span style={{ color: 'rgba(215, 197, 7, 1)', pointerEvents: 'none' }} > - Remove Row </span></button></td>}
                        </tr>
                        ))}
                        </>)}
                        <tr>
                            <td colSpan='7' style={{ textAlign: "center", fontSize: '15px' }}>
                                <button className="EditButton" style={{ pointerEvents: save?'none':'fill' }} onClick={()=>{addItem?validation():setAddItem(true) }}>
                                    <span style={{ pointerEvents: 'none' }}> {addItem?save?'loading':'save':'+ Add Item'} </span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {deletePopMessage&&
                <div className="card">
                    <div className="card-body">
                        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"/>
                        </svg>
                        <div>
                            <h3>Delete product ....!</h3>
                            <p>that was permanently delete click ok delete product</p>
                        </div>
                    </div>
                    <div className="progress">
                        <button className="btn-first" style={{ pointerEvents: deleteProcess?'none':'fill' }} type="button" onClick={()=>{deleteProduct(deleteId)}} >Ok</button>
                        <button className="btn-second" style={{ pointerEvents: deleteProcess?'none':'fill' }} type="button" onClick={()=>{setDeletePopMessage(false),setDeleteId(null)}}>Cancel</button>
                    </div>
                </div>
            }
        </main>
    );
};

export default UserInformation;
