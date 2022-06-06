import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { db } from "../../Components/firebase";
import { doc, addDoc, collection, getDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../../Components/admin/Navbar'

const Education = (props) => {
    const [educationData, setEducationData] = useState();
    const [resume, setResume] = useState('')

    const [title, setTitle] = useState('');
    const [organisation, setOrganisation] = useState('');
    const [image, setImage] = useState('');
    const [detail, setDetail] = useState('');
    const [grade, setGrade] = useState('');
    const [year, setYear] = useState('');

    const [newTitle, setNewTitle] = useState('');
    const [newOrganisation, setNewOrganisation] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newDetail, setNewDetail] = useState('');
    const [newGrade, setNewGrade] = useState('');
    const [newYear, setNewYear] = useState('');

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("myUser")) {
            router.push("/admin");
        }
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "education"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setEducationData(data);

            const docRef = doc(db, "resume", "resumelink");
            const docSnap = await getDoc(docRef);
            setResume(docSnap.data().link);
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
        } else if (e.target.name === "newOrganisation") {
            setNewOrganisation(e.target.value);
        } else if (e.target.name === "newImage") {
            setNewImage(e.target.value);
        } else if (e.target.name === "newDetail") {
            setNewDetail(e.target.value);
        } else if (e.target.name === "newGrade") {
            setNewGrade(e.target.value);
        } else if (e.target.name === "newYear") {
            setNewYear(e.target.value);
        } else if (e.target.name === "title") {
            setTitle(e.target.value);
        } else if (e.target.name === "organisation") {
            setOrganisation(e.target.value);
        } else if (e.target.name === "image") {
            setImage(e.target.value);
        } else if (e.target.name === "detail") {
            setDetail(e.target.value);
        } else if (e.target.name === "grade") {
            setGrade(e.target.value);
        } else if (e.target.name === "year") {
            setYear(e.target.value);
        } else if (e.target.name === "resume") {
            setResume(e.target.value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newTitle && newOrganisation && newImage && newDetail && newGrade && newYear) {
                let Add = await addDoc(collection(db, "education"), {
                    title: newTitle,
                    organisation: newOrganisation,
                    img: newImage,
                    details: newDetail,
                    grade: newGrade,
                    year: newYear
                });
                if (Add.id) {
                    tst("Education added successfully", "success");
                    router.push("/admin/education");
                } else {
                    tst("Something went wrong", "error");
                }
                setNewTitle('');
                setNewOrganisation('');
                setNewImage('');
                setNewDetail('');
                setNewGrade('');
                setNewYear('');
            } else {
                tst("Please fill all the fields", "error");
            }
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const delData = async (id) => {
        try {
            alert("Are you sure you want to delete this education ?");
            await deleteDoc(doc(db, "education", id));
            tst("Education deleted successfully", "success");
            router.push("/admin/education");
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const updateFun = (title, organisation, image, detail, grade, year) => {
        setTitle(title);
        setOrganisation(organisation);
        setImage(image);
        setDetail(detail);
        setGrade(grade);
        setYear(year);
    }

    const updateData = async (id) => {
        try {
            await updateDoc(doc(db, "education", id), {
                title: title,
                organisation: organisation,
                img: image,
                detail: detail,
                grade: grade,
                year: year
            });
            tst("Education updated successfully", "success");
            document.getElementById(`ID${id}`).remove("show");
            document.getElementsByClassName("modal-backdrop")[0].style.display = "none";
            document.body.style.overflow = "auto";
            router.push("/admin/education");
            setTitle('');
            setOrganisation('');
            setImage('');
            setDetail('');
            setGrade('');
            setYear('');
        } catch (error) {
            console.log(error);
            tst("Something went wrong", "error");
        }
    }

    const updateResume = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "resume", "resumelink"), {
                link: resume
            });
            tst("Resume updated successfully", "success");
            router.push("/admin/education");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Head>
                <title>Education | {props.name}</title>
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
                <h2 className="text-center mb-4">Manage Education</h2>
                <table className="table table-responsive">
                    <thead>
                        <tr style={{ textAlign: "center" }}>
                            <th scope="col">S.No.</th>
                            <th scope="col">Title</th>
                            <th scope="col">Organisation</th>
                            <th scope="col">Image Link</th>
                            <th scope="col">Detail</th>
                            <th scope="col">Grade</th>
                            <th scope="col">Year</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {educationData && educationData.map((val, index) => {
                            return <>
                                <tr key={index} style={{ textAlign: "justify" }}>
                                    <th scope="row">{index + 1}</th>
                                    <td><input className='form-control' type="text" value={val.title} name="title" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.organisation} name="description" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.img} name="image" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.details} name="detail" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.grade} name="garde" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.year} name="year" readOnly /></td>
                                    <td>
                                        <button onClick={() => { updateFun(val.title, val.organisation, val.img, val.details, val.grade, val.year) }} className='mx-1 p-1 bg-primary text-light' style={{ width: "35px", height: "35px", borderRadius: "50%", outline: "none", border: "none" }}><i data-bs-toggle="modal" data-bs-target={`#ID${val.id}`} className="fas fa-pen"></i></button>
                                        <div className="modal fade" id={`ID${val.id}`} tabIndex="-1" aria-labelledby={`${val.id}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Update Education</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Title' value={title} name="title" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Organisation' value={organisation} name="organisation" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Image' value={image} name="image" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Detail' value={detail} name="detail" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Grade' value={grade} name="grade" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Year' value={year} name="year" />
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
                            <td><input type="text" onChange={handleChange} value={newOrganisation} placeholder={"Organisation"} className="form-control" name='newOrganisation' /></td>
                            <td><input type="text" onChange={handleChange} value={newImage} placeholder={"Image Link"} className="form-control" name='newImage' /></td>
                            <td><input type="text" onChange={handleChange} value={newDetail} placeholder={"Detail"} className="form-control" name='newDetail' /></td>
                            <td><input type="text" onChange={handleChange} value={newGrade} placeholder={"Grade"} className="form-control" name='newGrade' /></td>
                            <td><input type="text" onChange={handleChange} value={newYear} placeholder={"Year"} className="form-control" name='newYear' /></td>
                            <td>
                                <button onClick={handleSubmit} type="button" className="btn btn-success btn-sm">Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className='container mx-auto pb-5 w-50'>
                <h2 className="text-center mb-4">Update Resume</h2>
                <form onSubmit={updateResume} method="post" className='form-group'>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" onChange={handleChange} id="text" name={"resume"} value={resume} placeholder="https://resume" />
                        <label htmlFor="text">Resume Link</label>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Update</button>
                </form>
            </section>
        </>
    )
}

export default Education