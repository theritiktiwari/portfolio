import React, { useEffect } from "react";

const img1 = "https://www.kindpng.com/picc/m/163-1636340_user-avatar-icon-avatar-transparent-user-icon-png.png";
const img2 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgSmojUgwjIB87c4Q0hLCAyl__oiTySWGWJUZtUNHlHjBALLzTsu_vMHYMaEwLts4QEoo&usqp=CAU";
const img3 = "https://cdn-icons-png.flaticon.com/512/194/194938.png";
// const img4 = "https://library.kissclipart.com/20180919/xae/kissclipart-male-avatar-icon-clipart-computer-icons-avatar-104635e37f6b2f94.png";
// const img5 = "https://cdn.iconscout.com/icon/free/png-256/avatar-1659503-1410025.png";

const Testimonials = () => {

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

    }, []);


    return (
        <>
            <section class="testimonial">
                <h1>Testimonials</h1>

                <div class="slid-er">
                    <div class="slides" id="slides">

                        <div class="slide">
                            <div class="slide-content">
                                <div class="img-area">
                                    <img src={img1} alt="Test1" />
                                </div>
                                <h4>Ishika Agarwal</h4>
                                <p>"Thank you for the fantastic service and the excellent customer service you give."</p>
                            </div>
                        </div>

                        <div class="slide">
                            <div class="slide-content">
                                <div class="img-area">
                                    <img src={img2} alt="Test1" />
                                </div>
                                <h4>Tejashwa Agarwal</h4>
                                <p>"You should give it a shot since the service is so good that everything is worth it."</p>
                            </div>
                        </div>

                        <div class="slide">
                            <div class="slide-content">
                                <div class="img-area">
                                    <img src={img3} alt="Test1" />
                                </div>
                                <h4>Shivani Shukla</h4>
                                <p>"You can trust him, since he's a nice man with a wonderful nature and his work is excellent."</p>
                            </div>
                        </div>

                        {/* <div class="slide">
                            <div class="slide-content">
                                <div class="img-area">
                                    <img src={img4} alt="Test1" />
                                </div>
                                <h4>Jessica Jones</h4>
                                <p>"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus veritatis repellendus delectus, est."</p>
                            </div>
                        </div>

                        <div class="slide">
                            <div class="slide-content">
                                <div class="img-area">
                                    <img src={img5} alt="Test1" />
                                </div>
                                <h4>Jessica Jones</h4>
                                <p>"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus veritatis repellendus delectus, est."</p>
                            </div>
                        </div> */}

                    </div>
                </div>
            </section>
        </>
    )
}

export default Testimonials