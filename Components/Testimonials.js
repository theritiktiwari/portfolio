import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const Testimonials = () => {
    const [testimonialsData, setTestimonialsData] = useState();

    useEffect(() => {
        let xOffset = 0;
        let isMouseIn = false;
        const slides = document.getElementById("slides");

        setInterval(translate, 0);

        function translate() {
            let offsetIncrementor = isMouseIn ? 0.05 : 0.2;
            if (xOffset >= 258 * 7) xOffset = 0;
            else xOffset = xOffset + offsetIncrementor;
            slides.style.transform = "translateX(-" + xOffset + "px)";
        }

        slides.addEventListener("mouseover", function (event) {
            isMouseIn = true;
        });

        slides.addEventListener("mouseout", function (event) {
            isMouseIn = false;
        });

        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "testimonials"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setTestimonialsData(data);
        }
        getData();
    }, []);


    return (
        <>
            <section className="testimonial">
                <h1>Testimonials</h1>
                <div className="slid-er">
                    <div className="slides" id="slides">
                        {
                            testimonialsData && testimonialsData.map((val, index) => {
                                return <div key={index} className="slide">
                                    <div className="slide-content">
                                        <div className="img-area">
                                            <img src={val.img} alt={val.name} />
                                        </div>
                                        <h4>{val.name}</h4>
                                        <p>&quot;{val.content}&quot;</p>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default Testimonials