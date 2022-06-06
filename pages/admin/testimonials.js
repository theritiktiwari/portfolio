import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { db } from "../../Components/firebase";
import { doc, addDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../../Components/admin/Navbar'

const Testimonials = (props) => {
    const [testimonialData, setTestimonialData] = useState();

    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');

    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newContent, setNewContent] = useState('');

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("myUser")) {
            router.push("/admin");
        }
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "testimonials"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setTestimonialData(data);
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
        if (e.target.name === "newName") {
            setNewName(e.target.value);
        } else if (e.target.name === "newImage") {
            setNewImage(e.target.value);
        } else if (e.target.name === "newContent") {
            setNewContent(e.target.value);
        } else if (e.target.name === "name") {
            setName(e.target.value);
        } else if (e.target.name === "image") {
            setImage(e.target.value);
        } else if (e.target.name === "content") {
            setContent(e.target.value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newName && newImage && newContent) {
                let Add = await addDoc(collection(db, "testimonials"), {
                    name: newName,
                    img: newImage,
                    content: newContent
                });
                if (Add.id) {
                    tst("Testimonial added successfully", "success");
                    router.push("/admin/testimonials");
                } else {
                    tst("Something went wrong", "error");
                }
                setNewName('');
                setNewImage('');
                setNewContent('');
            } else {
                tst("Please fill all the fields", "error");
            }
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const delData = async (id) => {
        try {
            alert("Are you sure you want to delete this testimonial ?");
            await deleteDoc(doc(db, "testimonials", id));
            tst("Testimonial deleted successfully", "success");
            router.push("/admin/testimonials");
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const updateFun = (name, image, content) => {
        setName(name);
        setImage(image);
        setContent(content);
    }

    const updateData = async (id) => {
        try {
            await updateDoc(doc(db, "testimonials", id), {
                name: name,
                img: image,
                content: content
            });
            tst("Testimonial updated successfully", "success");
            document.getElementById(`ID${id}`).remove("show");
            document.getElementsByClassName("modal-backdrop")[0].style.display = "none";
            document.body.style.overflow = "auto";
            router.push("/admin/testimonials");
            setName('');
            setImage('');
            setContent('');
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    return (
        <>
            <Head>
                <title>Testimonials | {props.name}</title>
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
                <h2 className="text-center mb-4">Manage Testimonials</h2>
                <table className="table table-responsive">
                    <thead>
                        <tr className='text-center'>
                            <th scope="col">S.No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Image</th>
                            <th scope="col">Content</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {testimonialData && testimonialData.map((val, index) => {
                            return <>
                                <tr key={index} style={{ textAlign: "justify" }}>
                                    <th scope="row" className='text-center'>{index + 1}</th>
                                    <td><input className='form-control' type="text" value={val.name} name="name" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.img} name="email" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.content} name="password" readOnly /></td>
                                    <td className='text-center'>
                                        <button onClick={() => { updateFun(val.name, val.img, val.content) }} className='mx-1 p-1 bg-primary text-light' style={{ width: "35px", height: "35px", borderRadius: "50%", outline: "none", border: "none" }}><i data-bs-toggle="modal" data-bs-target={`#ID${val.id}`} className="fas fa-pen"></i></button>
                                        <div className="modal fade" id={`ID${val.id}`} tabIndex="-1" aria-labelledby={`${val.id}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Update Testimonial</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Name' value={name} name="name" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Image Link' value={image} name="image" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Content' value={content} name="content" />
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
                            <td><input type="text" onChange={handleChange} value={newName} placeholder={"Name"} className="form-control" name='newName' /></td>
                            <td><input type="text" onChange={handleChange} value={newImage} placeholder={"Image Link"} className="form-control" name='newImage' /></td>
                            <td><input type="text" onChange={handleChange} value={newContent} placeholder={"Content"} className="form-control" name='newContent' /></td>
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

export default Testimonials