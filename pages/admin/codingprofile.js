import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { db } from "../../Components/firebase";
import { doc, addDoc, setDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../../Components/admin/Navbar'

const CodingProfile = (props) => {
    const [problemData, setProblemData] = useState();
    const [rating, setRating] = useState();

    const [name, setName] = useState('');
    const [problem, setProblem] = useState('');

    const [newName, setNewName] = useState('');
    const [newProblem, setNewProblem] = useState('');

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("myUser")) {
            router.push("/admin");
        }
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "problems"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setProblemData(data);
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
        } else if (e.target.name === "newProblem") {
            setNewProblem(e.target.value);
        } else if (e.target.name === "name") {
            setName(e.target.value);
        } else if (e.target.name === "problem") {
            setProblem(e.target.value);
        } else if (e.target.name === "rating") {
            setRating(e.target.value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newName && newProblem) {
                let Add = await addDoc(collection(db, "problems"), {
                    name: newName,
                    problem: newProblem
                });
                if (Add.id) {
                    tst("Problem added successfully", "success");
                    router.push("/admin/codingprofile");
                } else {
                    tst("Something went wrong", "error");
                }
                setNewName('');
                setNewProblem('');
            } else {
                tst("Please fill all the fields", "error");
            }
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const delData = async (id) => {
        try {
            alert("Are you sure you want to delete this problem ?");
            await deleteDoc(doc(db, "problems", id));
            tst("Problem deleted successfully", "success");
            router.push("/admin/codingprofile");
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const updateFun = (name, problem) => {
        setName(name);
        setProblem(problem);
    }

    const updateData = async (id) => {
        try {
            await updateDoc(doc(db, "problems", id), {
                name: name,
                problem: problem
            });
            tst("Problem updated successfully", "success");
            document.getElementById(`ID${id}`).remove("show");
            document.getElementsByClassName("modal-backdrop")[0].style.display = "none";
            document.body.style.overflow = "auto";
            router.push("/admin/codingprofile");
            setName('');
            setProblem('');
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const handleRating = async (e) => {
        e.preventDefault();
        try {
            if (e.target.platformName.value && rating) {
                await setDoc(doc(db, "rating", e.target.platformName.value), {
                    rating: rating
                });
                tst("Ratings added successfully", "success");
                e.target.platformName.options[0].selected = true;
                setRating('');
            } else {
                tst("Please fill all the fields", "error");
            }
        } catch (error) {
            console.log(error);
            tst("Something went wrong", "error");
        }
    }

    return (
        <>
            <Head>
                <title>Coding Profile | {props.name}</title>
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

            <section className='container my-5 mx-auto w-50'>
                <h2 className="text-center mb-4">Manage Rating</h2>
                <form onSubmit={handleRating} method='POST' className='form-group'>
                    <div className="mb-3">
                        <select className="form-select" name="platformName" id="platformName">
                            <option selected>Select Platform</option>
                            <option value="CodeChef">CodeChef</option>
                            <option value="GeeksForGeeks">GeeksForGeeks</option>
                            <option value="LeetCode">LeetCode</option>
                            <option value="HackerRank">HackerRank</option>
                        </select>
                    </div>
                    <div className="mb-3 form-floating">
                        <input type="text" onChange={handleChange} value={rating} placeholder="Rating" className="form-control" name='rating' id="rating" />
                        <label htmlFor="rating" className="form-label">Rating</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </section>


            <section className='container mx-auto pb-5'>
                <h2 className="text-center mb-4">Manage Problems</h2>
                <table className="table table-responsive">
                    <thead>
                        <tr className='text-center'>
                            <th scope="col">S.No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Problem</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {problemData && problemData.map((val, index) => {
                            return <>
                                <tr key={index} style={{ textAlign: "justify" }}>
                                    <th scope="row" className='text-center'>{index + 1}</th>
                                    <td><input className='form-control' type="text" value={val.name} name="name" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.problem} name="problem" readOnly /></td>
                                    <td className='text-center'>
                                        <button onClick={() => { updateFun(val.name, val.problem) }} className='mx-1 p-1 bg-primary text-light' style={{ width: "35px", height: "35px", borderRadius: "50%", outline: "none", border: "none" }}><i data-bs-toggle="modal" data-bs-target={`#ID${val.id}`} className="fas fa-pen"></i></button>
                                        <div className="modal fade" id={`ID${val.id}`} tabIndex="-1" aria-labelledby={`${val.id}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Update Problem</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Name' value={name} name="name" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Problem' value={problem} name="problem" />
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
                            <td><input type="text" onChange={handleChange} value={newProblem} placeholder={"Problem"} className="form-control" name='newProblem' /></td>
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

export default CodingProfile