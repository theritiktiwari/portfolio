import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { db } from "../../Components/firebase";
import { doc, addDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
var CryptoJS = require("crypto-js");
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Navbar from '../../Components/admin/Navbar'

const Users = (props) => {
    const [userData, setUserData] = useState();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("myUser")) {
            router.push("/admin");
        }
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "admin"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setUserData(data);
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
        } else if (e.target.name === "newEmail") {
            setNewEmail(e.target.value);
        } else if (e.target.name === "newPassword") {
            setNewPassword(e.target.value);
        } else if (e.target.name === "name") {
            setName(e.target.value);
        } else if (e.target.name === "email") {
            setEmail(e.target.value);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newName && newEmail && newPassword) {
                let Add = await addDoc(collection(db, "admin"), {
                    name: newName,
                    email: newEmail,
                    password: CryptoJS.AES.encrypt(newPassword, "this-is-a-crypto-js-secret-key").toString()
                });
                if (Add.id) {
                    tst("User added successfully", "success");
                    router.push("/admin/users");
                } else {
                    tst("Something went wrong", "error");
                }
                setNewName('');
                setNewEmail('');
                setNewPassword('');
            } else {
                tst("Please fill all the fields", "error");
            }
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const delData = async (id) => {
        try {
            alert("Are you sure you want to delete this user ?");
            await deleteDoc(doc(db, "admin", id));
            tst("User deleted successfully", "success");
            router.push("/admin/users");
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const updateFun = (name, email, password) => {
        setName(name);
        setEmail(email);
        setPassword(password);
    }

    const updateData = async (id) => {
        try {
            await updateDoc(doc(db, "admin", id), {
                name: name,
                email: email,
                password: CryptoJS.AES.encrypt(password, "this-is-a-crypto-js-secret-key").toString()
            });
            tst("User updated successfully", "success");
            document.getElementById(`ID${id}`).remove("show");
            document.getElementsByClassName("modal-backdrop")[0].style.display = "none";
            document.body.style.overflow = "auto";
            router.push("/admin/users");
            setName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    return (
        <>
            <Head>
                <title>Users | {props.name}</title>
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
                <h2 className="text-center mb-4">Manage Users</h2>
                <table className="table table-responsive">
                    <thead>
                        <tr className='text-center'>
                            <th scope="col">S.No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Password</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {userData && userData.map((val, index) => {
                            return <>
                                <tr key={index} style={{ textAlign: "justify" }}>
                                    <th scope="row" className='text-center'>{index + 1}</th>
                                    <td><input className='form-control' type="text" value={val.name} name="name" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.email} name="email" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.password} name="password" readOnly /></td>
                                    <td className='text-center'>
                                        <button onClick={() => { updateFun(val.name, val.email, val.password) }} className='mx-1 p-1 bg-primary text-light' style={{ width: "35px", height: "35px", borderRadius: "50%", outline: "none", border: "none" }}><i data-bs-toggle="modal" data-bs-target={`#ID${val.id}`} className="fas fa-pen"></i></button>
                                        <div className="modal fade" id={`ID${val.id}`} tabIndex="-1" aria-labelledby={`${val.id}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Update User</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Name' value={name} name="name" />
                                                        <input className='form-control mb-3' type="email" onChange={handleChange} placeholder='Email Address' value={email} name="email" />
                                                        <input className='form-control mb-3' type="password" onChange={handleChange} placeholder='Password' value={password} name="password" />
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
                            <td><input type="text" onChange={handleChange} value={newName} placeholder={"User Name"} className="form-control" name='newName' /></td>
                            <td><input type="email" onChange={handleChange} value={newEmail} placeholder={"Email Address"} className="form-control" name='newEmail' /></td>
                            <td><input type="password" onChange={handleChange} value={newPassword} placeholder={"Password"} className="form-control" name='newPassword' /></td>
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

export default Users