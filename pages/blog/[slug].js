import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import Script from 'next/script';
import PortableText from "react-portable-text";

const Slug = ({ client, imgURL, name, router }) => {
    const dummyImage = "https://i.ibb.co/8xRxbNh/Blog.png";

    const slug = router.query.slug;
    const [post, setPost] = useState();
    const [allPost, setAllPost] = useState();
    const [nameCat, setNameCat] = useState()

    useEffect(() => {
        setPost();
        setAllPost();
        setNameCat();
        const getData = async () => {
            const data1 = await client.fetch(`*[_type == "post" && slug.current == "${slug}"]`);
            const data2 = await client.fetch(`*[_type == "post" && slug.current != "${slug}"][0...2] | order(publishedAt desc)`);
            const data3 = await client.fetch(`*[_type == "post" && slug.current == "${slug}"][0]{title, "author": author->name, "categories": categories[]->title}`);
            setPost(data1[0]);
            setAllPost(data2);
            setNameCat(data3);
        }
        getData();
    }, [router]);

    const date = (date) => {
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateObj = new Date(date);
        return `${month[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }

    return (
        <>
            <Head>
                <title>{post && post.title} | {name}</title>
            </Head>

            {(post) ? <div className="blog-post">
                <div className="container">
                    <div className='box'>
                        <div className='image' data-aos="zoom-in">
                            <img src={post.mainImage ? imgURL(post.mainImage).url() || dummyImage : dummyImage} alt={post.title} style={{ filter: "brightness(95%)" }} />
                        </div>
                        <div className="details">
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                {post.publishedAt ? <div>
                                    <p>Date : <span className='text-uppercase text-bold'>{date(post.publishedAt)}</span></p>
                                </div> : null}
                                {nameCat.author ? <div>
                                    <p>By :&nbsp;<span className='text-uppercase text-bold'>{nameCat.author}</span></p>
                                </div> : null}
                            </div>
                            {nameCat.categories ? <div>
                                <p>Categories :&nbsp;
                                    {nameCat.categories.map((cat, catIndex) => {
                                        return <span key={catIndex} className='text-uppercase text-bold'>{cat}{(nameCat.categories.length != catIndex + 1) && ", "}</span>
                                    })}
                                </p>
                            </div> : null}
                        </div>

                        <h1 className='heading'>{post.title}</h1>
                        <div className="blog-content">
                            {post.body && <PortableText className='text-justify'
                                content={post.body}
                                serializers={{
                                    h1: (props) => <h1 style={{ color: "red" }} {...props} />,
                                    li: ({ children }) => <li className="special-list-item">{children}</li>
                                }}
                            />}
                        </div>
                    </div>

                    <hr style={{ margin: "40px" }} />


                    <h3 className='text-bold'>Related Posts</h3>
                    <div className="related-post" data-aos="zoom-in">
                        {allPost.map((item, index) => {
                            return <div key={index}>
                                <Link href={`/blog/${item.slug.current}`}><a>
                                    <div className="card">
                                        <div className="image">
                                            <img src={imgURL(item.mainImage).width(1800).height(1200).url() || dummyImage} width="1800" height="1200" alt={item.slug.current} style={{ filter: "brightness(95%)" }} />
                                        </div>
                                        <div className="text-justify">
                                            <h3>{item.title.substr(0, 17)}...</h3>
                                            <p>{item.metaDescription.substr(0, 135)}...</p>
                                        </div>
                                    </div>
                                </a></Link>
                            </div>
                        })}

                    </div>
                </div>
            </div> : null}
        </>
    )
}

export default Slug;