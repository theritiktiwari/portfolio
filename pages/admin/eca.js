import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { db } from "../../Components/firebase";
import { doc, addDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../../Components/admin/Navbar'

const ECA = (props) => {
    const [ecaData, setEcaData] = useState();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [date, setDate] = useState('');
    const [link, setLink] = useState('');

    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newLink, setNewLink] = useState('');

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("myUser")) {
            router.push("/admin");
        }
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "eca"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setEcaData(data);
        }
        getData();
    }, [router]);

    const tst = (msg, type) => {
        if (type == "success") {
            toast.success(`${msg}`, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.error(`${msg}`, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "newTitle") {
            setNewTitle(e.target.value);
        } else if (e.target.name === "newDescription") {
            setNewDescription(e.target.value);
        } else if (e.target.name === "newImage") {
            setNewImage(e.target.value);
        } else if (e.target.name === "newDate") {
            setNewDate(e.target.value);
        } else if (e.target.name === "newLink") {
            setNewLink(e.target.value);
        } else if (e.target.name === "title") {
            setTitle(e.target.value);
        } else if (e.target.name === "description") {
            setDescription(e.target.value);
        } else if (e.target.name === "image") {
            setImage(e.target.value);
        } else if (e.target.name === "date") {
            setDate(e.target.value);
        } else if (e.target.name === "link") {
            setLink(e.target.value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newTitle && newDescription && newImage && newDate && newLink) {
                let Add = await addDoc(collection(db, "eca"), {
                    title: newTitle,
                    description: newDescription,
                    img: newImage,
                    date: newDate,
                    link: newLink
                });
                if (Add.id) {
                    tst("ECA added successfully", "success");
                    router.push("/admin/eca");
                } else {
                    tst("Something went wrong", "error");
                }
                setNewTitle('');
                setNewDescription('');
                setNewImage('');
                setNewDate('');
                setNewLink('');
            } else {
                tst("Please fill all the fields", "error");
            }
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const delData = async (id) => {
        try {
            alert("Are you sure you want to delete this ECA ?");
            await deleteDoc(doc(db, "eca", id));
            tst("ECA deleted successfully", "success");
            router.push("/admin/eca");
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const updateFun = (title, description, image, date, link) => {
        setTitle(title);
        setDescription(description);
        setImage(image);
        setDate(date);
        setLink(link);
    }

    const updateData = async (id) => {
        try {
            await updateDoc(doc(db, "eca", id), {
                img: image,
                title: title,
                description: description,
                date: date,
                link: link
            });
            tst("ECA updated successfully", "success");
            document.getElementById(`ID${id}`).remove("show");
            document.getElementsByClassName("modal-backdrop")[0].style.display = "none";
            document.body.style.overflow = "auto";
            router.push("/admin/eca");
            setTitle('');
            setDescription('');
            setImage('');
            setDate('');
            setLink('');
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    return (
        <>
            <Head>
                <title>ECA | {props.name}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous" />
            </Head>
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossOrigin="anonymous" />
            <Navbar name={props.name} logout={props.logout} />
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <section className='container mx-auto py-5'>
                <h2 className="text-center mb-4">Manage ECA</h2>
                <table className="table table-responsive">
                    <thead>
                        <tr style={{ textAlign: "center" }}>
                            <th scope="col">S.No.</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Image Link</th>
                            <th scope="col">Date</th>
                            <th scope="col">Link</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ecaData && ecaData.map((val, index) => {
                            return <>
                                <tr key={index} style={{ textAlign: "justify" }}>
                                    <th scope="row">{index + 1}</th>
                                    <td><input className='form-control' type="text" value={val.title} name="title" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.description} name="description" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.img} name="image" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.date} name="date" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.link} name="link" readOnly /></td>
                                    <td>
                                        <button onClick={() => { updateFun(val.title, val.description, val.img, val.date, val.link) }} className='mx-1 p-1 bg-primary text-light' style={{ width: "35px", height: "35px", borderRadius: "50%", outline: "none", border: "none" }}><i data-bs-toggle="modal" data-bs-target={`#ID${val.id}`} className="fas fa-pen"></i></button>
                                        <div className="modal fade" id={`ID${val.id}`} tabIndex="-1" aria-labelledby={`${val.id}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Update ECA</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Title' value={title} name="title" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Description' value={description} name="description" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Image' value={image} name="image" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Date' value={date} name="date" />
                                                        <input className='form-control mb-0' type="text" onChange={handleChange} placeholder='Link' value={link} name="link" />
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button onClick={() => { updateData(val.id) }} type="button" className="w-100 btn btn-primary">Edit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => { delData(val.id) }} className='mx-1 p-1 bg-danger text-light' style={{ width: "35px", height: "35px", borderRadius: "50%", outline: "none", border: "none" }}><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </>
                        })}
                        <tr>
                            <th scope="row">#</th>
                            <td><input type="text" onChange={handleChange} value={newTitle} placeholder={"Title"} className="form-control" name='newTitle' /></td>
                            <td><input type="text" onChange={handleChange} value={newDescription} placeholder={"Description"} className="form-control" name='newDescription' /></td>
                            <td><input type="text" onChange={handleChange} value={newImage} placeholder={"Image Link"} className="form-control" name='newImage' /></td>
                            <td><input type="text" onChange={handleChange} value={newDate} placeholder={"Date"} className="form-control" name='newDate' /></td>
                            <td><input type="text" onChange={handleChange} value={newLink} placeholder={"Link"} className="form-control" name='newLink' /></td>
                            <td>
                                <button onClick={handleSubmit} type="button" className="btn btn-success btn-sm">Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </>
    )
}

export default ECA