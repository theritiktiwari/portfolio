import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';

const Index = ({ name, client, router, imgURL }) => {
    const dummyImage = "https://i.ibb.co/8xRxbNh/Blog.png";

    const [post, setPost] = useState();

    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "post"] | order(publishedAt desc)`);
            setPost(data);
        }
        getData();
    }, [router]);

    const date = (date) => {
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateObj = new Date(date);
        return `${month[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }

    const getCategories = (category, index) => {
        category.map((item, ind) => {
            client.fetch(`*[_type == "category" && _id == "${item._ref}"]{title}`).then(data => {
                document.querySelector(`#category${index}`).innerHTML = `${data[0].title}${category.length > 1 ? '...' : ''}`;
            }).catch(err => {
                // console.log(err);
            })
        })
    }

    const getAuthors = (author, index) => {
        client.fetch(`*[_type == "author" && _id == "${author._ref}"]{name}`).then(data => {
            document.querySelector(`#author${index}`).innerHTML = `${data[0].name}`;
        }).catch(err => {
            // console.log(err);
        })
    }

    return (
        <>
            <Head>
                <title>Blog | {name}</title>
            </Head>

            <section className='blog'>
                <h1>Blogs</h1>

                <div className="container">
                    {(post && post.length > 0) ? post.map((item, index) => {
                        return <div className="card" key={index}>
                            <div className="image">
                                <img src={item.mainImage ? imgURL(item.mainImage).url() || dummyImage : dummyImage} alt={item.slug.current} />
                            </div>
                            <div className="content">
                                <h3 className="card-title">{(item.title).toLowerCase()}</h3>
                                <div>
                                    {item.metaDescription && <p style={{ textAlign: "justify" }}>{item.metaDescription.substr(0, 190)}...</p>}

                                    {item.author ? <p>By : <span id={`author${index}`} className='text-uppercase text-bold'> {getAuthors(item.author, index)}</span></p> : null}
                                    {item.categories ? <p>Categories : <span id={`category${index}`} className='text-uppercase text-bold'> {getCategories(item.categories, index)}</span></p> : null}

                                    {item.publishedAt ? <p>Date : <span className='text-bold text-uppercase'>{date(item.publishedAt)}</span></p> : null}
                                </div>
                                <Link href={`/blog/${item.slug.current}`}><a className='btn'>Read More</a></Link>
                            </div>
                        </div>
                    }) : null}
                </div>
            </section>
            <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1628956737718591" crossOrigin="anonymous"></Script>
        </>
    )
}

export default Index;