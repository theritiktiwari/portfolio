import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { db } from "../../Components/firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../../Components/admin/Navbar'

const Home = (props) => {
    const [about1, setAbout1] = useState('');
    const [about2, setAbout2] = useState('');
    const [followers, setFollowers] = useState('');

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("myUser")) {
            router.push("/admin");
        }
    }, [router]);

    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "about"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setAbout1(data[0].maintext);
            setAbout2(data[0].subtext);
        }
        getData();
    }, []);

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

    const handleAbout = async (e) => {
        e.preventDefault();
        try {
            if (about1 && about2) {
                await setDoc(doc(db, "about", "data"), {
                    maintext: about1,
                    subtext: about2
                });
                tst("About edit successfully", "success");
            } else {
                tst("Please fill all the fields", "error");
            }
        } catch (error) {
            console.log(error);
            tst("Something went wrong", "error");
        }
    }

    const handleFollowers = async (e) => {
        e.preventDefault();
        try {
            if (e.target.platformName.value && followers) {
                await setDoc(doc(db, "followers", e.target.platformName.value), {
                    followers: followers
                });
                tst("Followers added successfully", "success");
                e.target.platformName.options[0].selected = true;
                setFollowers('');
            } else {
                tst("Please fill all the fields", "error");
            }
        } catch (error) {
            console.log(error);
            tst("Something went wrong", "error");
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "about1") {
            setAbout1(e.target.value);
        }
        else if (e.target.name === "about2") {
            setAbout2(e.target.value);
        }
        else if (e.target.name === "followers") {
            setFollowers(e.target.value);
        }
    }
    return (
        <>
            <Head>
                <title>Home | {props.name}</title>
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
            <section className='container mx-auto w-50 pt-5'>
                <h2 className="text-center mb-4">Edit About Text</h2>
                <form onSubmit={handleAbout} method='POST'>
                    <div className="mb-3">
                        <label htmlFor="about1" className="form-label">Main Text</label>
                        <textarea type="text" rows={4} onChange={handleChange} value={about1} className="form-control" name='about1' id="about1"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="about2" className="form-label">Sub Text</label>
                        <textarea type="text" rows={4} onChange={handleChange} value={about2} className="form-control" name='about2' id="about2"></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Edit</button>
                </form>
            </section>

            <section className='container my-5 mx-auto w-50 pb-5'>
                <h2 className="text-center mb-4">Manage Followers</h2>
                <form onSubmit={handleFollowers} method='POST' className='form-group'>
                    <div className="mb-3">
                        <select className="form-select" name="platformName" id="platformName">
                            <option selected>Select Platform</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="GitHub">GitHub</option>
                            <option value="Instagram">Instagram</option>
                            <option value="YouTube">YouTube</option>
                        </select>
                    </div>
                    <div className="mb-3 form-floating">
                        <input type="text" onChange={handleChange} value={followers} placeholder="Followers" className="form-control" name='followers' id="followers" />
                        <label htmlFor="followers" className="form-label">Followers</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </section>
        </>
    )
}

export default Home