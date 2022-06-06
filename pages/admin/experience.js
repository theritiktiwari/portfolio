import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { db } from "../../Components/firebase";
import { doc, addDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../../Components/admin/Navbar'

const Experience = (props) => {
    const [experienceData, setExperienceData] = useState();

    const [title, setTitle] = useState('');
    const [organisation, setOrganisation] = useState('');
    const [image, setImage] = useState('');
    const [detail, setDetail] = useState('');
    const [starting, setStarting] = useState('');
    const [ending, setEnding] = useState('');
    const [time, setTime] = useState('');
    const [link, setLink] = useState('');
    const [certificate, setCertificate] = useState('');

    const [newTitle, setNewTitle] = useState('');
    const [newOrganisation, setNewOrganisation] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newDetail, setNewDetail] = useState('');
    const [newStarting, setNewStarting] = useState('');
    const [newEnding, setNewEnding] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newLink, setNewLink] = useState('');
    const [newCertificate, setNewCertificate] = useState('');

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem("myUser")) {
            router.push("/admin");
        }
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "experience"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setExperienceData(data);
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
        } else if (e.target.name === "newStarting") {
            setNewStarting(e.target.value);
        } else if (e.target.name === "newEnding") {
            setNewEnding(e.target.value);
        } else if (e.target.name === "newTime") {
            setNewTime(e.target.value);
        } else if (e.target.name === "newLink") {
            setNewLink(e.target.value);
        } else if (e.target.name === "newCertificate") {
            setNewCertificate(e.target.value);
        } else if (e.target.name === "title") {
            setTitle(e.target.value);
        } else if (e.target.name === "organisation") {
            setOrganisation(e.target.value);
        } else if (e.target.name === "image") {
            setImage(e.target.value);
        } else if (e.target.name === "detail") {
            setDetail(e.target.value);
        } else if (e.target.name === "starting") {
            setStarting(e.target.value);
        } else if (e.target.name === "ending") {
            setEnding(e.target.value);
        } else if (e.target.name === "time") {
            setTime(e.target.value);
        } else if (e.target.name === "link") {
            setLink(e.target.value);
        } else if (e.target.name === "certificate") {
            setCertificate(e.target.value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newTitle && newOrganisation && newImage && newDetail && newStarting && newEnding && newTime && newLink && newCertificate) {
                let Add = await addDoc(collection(db, "experience"), {
                    title: newTitle,
                    organisation: newOrganisation,
                    img: newImage,
                    detail: newDetail,
                    starting: newStarting,
                    ending: newEnding,
                    time: newTime,
                    link: newLink,
                    certificate: newCertificate
                });
                if (Add.id) {
                    tst("Experience added successfully", "success");
                    router.push("/admin/experience");
                } else {
                    tst("Something went wrong", "error");
                }
                setNewTitle('');
                setNewOrganisation('');
                setNewImage('');
                setNewDetail('');
                setNewStarting('');
                setNewEnding('');
                setNewTime('');
                setNewLink('');
                setNewCertificate('');
            } else {
                tst("Please fill all the fields", "error");
            }
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const delData = async (id) => {
        try {
            alert("Are you sure you want to delete this experience ?");
            await deleteDoc(doc(db, "experience", id));
            tst("Experience deleted successfully", "success");
            router.push("/admin/experience");
        } catch (error) {
            tst("Something went wrong", "error");
        }
    }

    const updateFun = (title, organisation, image, detail, starting, ending, time, link, certificate) => {
        setTitle(title);
        setOrganisation(organisation);
        setImage(image);
        setDetail(detail);
        setStarting(starting);
        setEnding(ending);
        setTime(time);
        setLink(link);
        setCertificate(certificate);
    }

    const updateData = async (id) => {
        try {
            await updateDoc(doc(db, "experience", id), {
                title: title,
                organisation: organisation,
                img: image,
                detail: detail,
                starting: starting,
                ending: ending,
                time: time,
                link: link,
                certificate: certificate
            });
            tst("Experience updated successfully", "success");
            document.getElementById(`ID${id}`).remove("show");
            document.getElementsByClassName("modal-backdrop")[0].style.display = "none";
            document.body.style.overflow = "auto";
            router.push("/admin/experience");
            setTitle('');
            setOrganisation('');
            setImage('');
            setDetail('');
            setStarting('');
            setEnding('');
            setTime('');
            setLink('');
            setCertificate('');
        } catch (error) {
            console.log(error);
            tst("Something went wrong", "error");
        }
    }
    return (
        <>
            <Head>
                <title>Experience | {props.name}</title>
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
                <h2 className="text-center mb-4">Manage Experience</h2>
                <table className="table table-responsive">
                    <thead>
                        <tr style={{ textAlign: "center" }}>
                            <th scope="col">S.No.</th>
                            <th scope="col">Title</th>
                            <th scope="col">Organisation</th>
                            <th scope="col">Image Link</th>
                            <th scope="col">Detail</th>
                            <th scope="col">Starting</th>
                            <th scope="col">Ending</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Link</th>
                            <th scope="col">Certificate</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {experienceData && experienceData.map((val, index) => {
                            return <>
                                <tr key={index} style={{ textAlign: "justify" }}>
                                    <th scope="row">{index + 1}</th>
                                    <td><input className='form-control' type="text" value={val.title} name="title" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.organisation} name="description" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.img} name="image" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.detail} name="detail" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.starting} name="starting" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.ending} name="ending" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.time} name="time" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.link} name="link" readOnly /></td>
                                    <td><input className='form-control' type="text" value={val.certificate} name="certificate" readOnly /></td>
                                    <td>
                                        <button onClick={() => { updateFun(val.title, val.organisation, val.img, val.detail, val.starting, val.ending, val.time, val.link, val.certificate) }} className='mx-1 p-1 bg-primary text-light' style={{ width: "35px", height: "35px", borderRadius: "50%", outline: "none", border: "none" }}><i data-bs-toggle="modal" data-bs-target={`#ID${val.id}`} className="fas fa-pen"></i></button>
                                        <div className="modal fade" id={`ID${val.id}`} tabIndex="-1" aria-labelledby={`${val.id}Label`} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Update Experience</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Title' value={title} name="title" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Organisation' value={organisation} name="organisation" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Image' value={image} name="image" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Detail' value={detail} name="detail" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Starting Time' value={starting} name="starting" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Ending Time' value={ending} name="ending" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Duration' value={time} name="time" />
                                                        <input className='form-control mb-3' type="text" onChange={handleChange} placeholder='Link' value={link} name="link" />
                                                        <input className='form-control mb-0' type="text" onChange={handleChange} placeholder='Certificate' value={certificate} name="certificate" />
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
                            <td><input type="text" onChange={handleChange} value={newStarting} placeholder={"Starting Time"} className="form-control" name='newStarting' /></td>
                            <td><input type="text" onChange={handleChange} value={newEnding} placeholder={"Ending Time"} className="form-control" name='newEnding' /></td>
                            <td><input type="text" onChange={handleChange} value={newTime} placeholder={"Duration"} className="form-control" name='newTime' /></td>
                            <td><input type="text" onChange={handleChange} value={newLink} placeholder={"Link"} className="form-control" name='newLink' /></td>
                            <td><input type="text" onChange={handleChange} value={newCertificate} placeholder={"Certificate"} className="form-control" name='newCertificate' /></td>
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

export default Experience