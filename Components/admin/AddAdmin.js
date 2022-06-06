import React, { useState } from 'react';
import { db } from "../firebase";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
var CryptoJS = require("crypto-js");
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAdmin = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name && email && password && confirmPassword) {
            if (password === confirmPassword) {
                if (password.length > 8) {
                    let user = await getDocs(query(collection(db, "admin"), where("email", "==", email)));
                    if (!user.empty) {
                        tst("Email already exists", "error");
                    } else {
                        let adminAdd = await addDoc(collection(db, "admin"), {
                            name: name,
                            email: email,
                            password: CryptoJS.AES.encrypt(password, "this-is-a-crypto-js-secret-key").toString()
                        });
                        if (adminAdd.id) {
                            tst("Admin added successfully", "success");
                        } else {
                            tst("Something went wrong", "error");
                        }
                    }
                } else {
                    tst("Password must be greater than 8 characters", "error");
                }
            } else {
                tst("Password did not match", "error");
            }
        } else {
            tst("Please fill all the fields", "error");
        }

        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

    const handleChange = (e) => {
        if (e.target.name === "name") {
            setName(e.target.value);
        }
        else if (e.target.name === "email") {
            setEmail(e.target.value);
        }
        else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
        else if (e.target.name === "confirmPassword") {
            setConfirmPassword(e.target.value);
        }
    }

    return (
        <>
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
            <section className='container position-absolute top-50 start-50 translate-middle w-50 bg-secondary bg-opacity-25 p-5 rounded-3'>
                <form onSubmit={handleSubmit} method="POST" className='w-100'>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="name" onChange={handleChange} value={name} name='name' className="form-control outline-none" id="name" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input type="email" onChange={handleChange} value={email} name='email' className="form-control outline-none" id="email" aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" onChange={handleChange} value={password} className="form-control" id="password" name='password' />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input type="password" onChange={handleChange} value={confirmPassword} className="form-control" id="confirmPassword" name='confirmPassword' />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </section>
        </>
    )
}

export default AddAdmin