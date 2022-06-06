import React from 'react';
import Link from 'next/link';

const Navbar = (props) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light w-100 px-5 sticky-top shadow">
        <div className="container-fluid">
          <Link href={"/admin"}><a className="navbar-brand mb-0 h1">{props.name}</a></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item mx-1">
                <Link href={"/admin/home"}><a className="nav-link">Home Page</a></Link>
              </li>
              <li className="nav-item mx-1">
                <Link href={"/admin/testimonials"}><a className="nav-link">Testimonials</a></Link>
              </li>
              <li className="nav-item mx-1">
                <Link href={"/admin/education"}><a className="nav-link">Education</a></Link>
              </li>
              <li className="nav-item mx-1">
                <Link href={"/admin/codingprofile"}><a className="nav-link">Coding Profile</a></Link>
              </li>
              <li className="nav-item mx-1">
                <Link href={"/admin/projects"}><a className="nav-link">Projects</a></Link>
              </li>
              <li className="nav-item mx-1">
                <Link href={"/admin/experience"}><a className="nav-link">Experience</a></Link>
              </li>
              <li className="nav-item mx-1">
                <Link href={"/admin/certificates"}><a className="nav-link">Certificates</a></Link>
              </li>
              <li className="nav-item mx-1">
                <Link href={"/admin/achievements"}><a className="nav-link">Achievements</a></Link>
              </li>
              <li className="nav-item mx-1">
                <Link href={"/admin/eca"}><a className="nav-link">ECA</a></Link>
              </li>
              <li className="nav-item mx-1">
                <Link href={"/admin/users"}><a className="nav-link">Users</a></Link>
              </li>
              <li className="nav-item mx-1">
                <a onClick={props.logout} className="nav-link text-danger" style={{ cursor: "pointer" }}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar