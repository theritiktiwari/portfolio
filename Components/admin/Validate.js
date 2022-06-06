import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Validate = () => {
    const router = useRouter();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    useEffect(() => {
        if (localStorage.getItem("myUser")) {
            router.push("/admin/home");
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email && password) {
            let u = await getDocs(query(collection(db, "admin"), where("email", "==", email)));
            if (u.empty) {
                tst("Invalid Credentials", "error");
            } else {
                let user = u.docs[0].data();
                let pass = CryptoJS.AES.decrypt(user.password, "this-is-a-crypto-js-secret-key");
                let decryptedPassword = pass.toString(CryptoJS.enc.Utf8);
                if (user.email === email && password === decryptedPassword) {
                    var token = jwt.sign({
                        data: {
                            name: user.name,
                            email: user.email
                        }
                    }, "this-is-a-jwt-secret-key", {
                        expiresIn: "2d"
                    });
                    localStorage.setItem("myUser", JSON.stringify({token: token, email: user.email}));
                    tst("Authentiacted Successful", "success");
                    setTimeout(() => {
                        router.push("/admin/home");
                    }, 2000);
                } else {
                    tst("Invalid Credentials", "error");
                }
            }
        } else {
            tst("Please fill all the fields", "error");
        }

        setEmail('');
        setPassword('');
    }

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        }
        else if (e.target.name === "password") {
            setPassword(e.target.value);
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
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input type="email" onChange={handleChange} value={email} name='email' className="form-control outline-none" id="email" aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" onChange={handleChange} value={password} className="form-control" id="password" name='password' />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </section>
        </>
    )
}

export default Validate