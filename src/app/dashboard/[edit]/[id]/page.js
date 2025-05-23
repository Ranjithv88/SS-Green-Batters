"use client";

import React, { useState, useEffect } from "react";
import './modify.scss';
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import NotFound from "@/components/404NotFound";
import { usePathname } from 'next/navigation';
import getSectionDetails from '@/lib/data';
import axios from "axios";
import { useRouter } from "next/navigation";

const UserInformation = () => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const pathName = usePathname();
    const path = pathName.split('/');
    const [notValid, setNotValid] = useState(false);
    const columnName = ['Product', 'Packing', 'Quantity', 'Container'];
    const [row, setRow] = useState(1);
    const [product, setProduct] = useState('');
    const [packing, setPacking] = useState(['']);
    const [quantity, setQuantity] = useState(['']);
    const [container, setContainer] = useState(['']);
    const [stock, setStock] = useState({})
    const [productValidation, setProductValidation] = useState(false)
    const router = useRouter();
    const [statusInAnimation, setStatusInAnimation] = useState('');
    const [productExist, setProductExist] = useState(false);
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

   useEffect(() => {
        const sectionName = path[2];
        if (sectionName) {
            const value = getSectionDetails(sectionName);
            if (!value) {
                setNotValid(false);
            } else {
                getStock(sectionName)
            }
        }
    }, [pathName, notValid])

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
    }, [row])

    const getStock = async (sectionName) => { 
        if (!sectionName) {
            console.error("Section name is invalid");
            return;
        }
        try {
            const response = await axios.post(`/api/stock/getOne/${sectionName}`, {id: path[3]}, {withCredentials: true});
            if (response.data.status === 200){
                setRow(response.data?.product?.packing.length)
                setStock(response.data?.product)
                setProduct(response.data?.product.product)
                setNotValid(false)
                setLoading(true)
            }
        } catch (error) {
            setNotValid(true)
            if(error.response.status===403){
                console.log(" Access Denied ....! ")
                alert(" Access Denied ...! ")
            }
            const errorMessage = error.response?.data?.error || ' Something went wrong '
            console.error('Insert error:', errorMessage)
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

    const handleClick = async(e) => {
        setTimeout(() => {setStatusInAnimation('loading')}, 125)
        if(await validation()){ setStatusInAnimation('Done'); await sleep(2000); router.push(`../${path[2]}`)}
        else setStatusInAnimation('')
    }

    const validation = async () => {
        if (product === '') {
            const input = document.querySelector('#editInput');
            if (input) input.focus();
            setProductValidation(true);
            autoOff();
            return false;
        }
        return await updatedApi()
    }

    const autoOff = async() => {
        console.log("enter")
        await sleep(5000)
        setProductValidation(false)
    }

    const updatedApi = async () => {
        const data = {
                sno: stock.sno,
                product: product,
                packing: packing,
                quantity: quantity,
                container: container
            }
        if(data === stock) return false
        try {
            const response = await axios.put(`/api/stock/edit/${path[2]+'+'+stock._id}`, data,{
                withCredentials: true
            })
            if(response.status===200){
                console.log('Inserted:', response.data)
                setProductExist(false)
                setRow(1)
                return true
            }
        } catch (err) {
            if(err.response?.status===403){
                console.log(" places login Again ...! ")
                alert(" places login Again ...! ")
            }else if (err.response?.status===409){
                setProductExist(true)
            } 
            const errorMessage = err.response?.data?.error || ' Something went wrong '
            console.error('Insert error:', errorMessage)
            return false
        }
    }

    if (status === 'loading') return <Loading />

    if (!session || notValid) return <NotFound />

  return (
    <main className="editPage">
        <div className="table-wrapper" >
            <table className="fl-table">
                <thead>
                    <tr>
                        <th>S.no</th>
                        <th>Product</th>
                        <th>Packing</th>
                        <th>Quantity</th>
                        <th>Container</th>
                        <th colSpan={2}>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="oldData">
                        <td colSpan={7}> Old Data </td>
                    </tr>
                    {!loading ? (
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
                      [...Array(1)].map((_, index) => (
                        <React.Fragment key={index}>
                            {stock.packing.map((packing, subIndex) => (
                            <tr key={`${index}-${subIndex}`}>
                                {subIndex === 0 && (
                                <>
                                    <td rowSpan={stock.packing.length}>{stock.sno}</td>
                                    <td rowSpan={stock.packing.length}>{stock.product}</td>
                                </>
                                )}
                                <td>{packing}</td>
                                <td>{stock.quantity[subIndex]}</td>
                                <td>{stock.container[subIndex]}</td>
                            </tr>
                            ))}
                        </React.Fragment>
                        ))
                    )}
                    <tr className="newData">
                        <td colSpan={7}> New Data </td>
                    </tr>
                    <tr>
                        <td rowSpan={row}>{stock.sno}</td>
                        <td rowSpan={row}>
                            <input className="editInput" id='editInput' minLength={2} onChange={(e)=>setProduct(e.target.value)} value={product} placeholder={columnName[0]} />
                            {productValidation&&<h5 style={{ color: 'rgba(227, 11, 92, 1)' }}> places Enter the Product name </h5>}
                            {productExist&&<h5 style={{ color: 'rgba(227, 11, 92, 1)' }}> Already Product Exist... </h5>}
                        </td>
                        {[...Array(3)].map((_, index) => (
                            <td key={index}>
                                <input className="editInput" minLength={2} onChange={(e)=>SetNewData(e,columnName[index+1],0)}  placeholder={columnName[index+1]} />
                            </td>
                        ))}
                        <td><button className="btn-2" onClick={()=>setRow(pre=>pre+1)}><span style={{ pointerEvents: 'none' }}> + Add Row </span></button></td>
                        <td><button className="btn-2" onClick={()=>router.push(`../${path[2]}`)}><span style={{  color: 'rgba(227, 11, 92, 1)', pointerEvents: 'none' }}> X cancel </span></button></td>
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
                    <tr className="SaveOperationInEdit">
                        <td colSpan={7}>
                            <button className={statusInAnimation} onClick={handleClick}>{statusInAnimation === 'loading' ? 'loading' : 'Save'}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
  );
};

export default UserInformation;

