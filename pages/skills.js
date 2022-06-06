import React from 'react';
import Head from 'next/head';

const SkillSet = (props) => {
    return (
        <>
            <Head>
                <title>Skills | {props.name}</title>
            </Head>
            <section className='skill-set'>
                <div className="cont" data-aos="fade-down">
                    <h2 className='title'>Languages</h2>
                    <div className="skill-type">
                        <div className="skill-box">
                            <img src="https://img.icons8.com/ios-filled/1000/122CA3/c-plus-plus-logo.png" alt="cpp" className='icon' />
                            <p>C++</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/ios-filled/1000/6063C5/circled-c.png" alt="c" className='icon' />
                            <p>C</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/ios-glyphs/1000/FFDC00/python.png" alt="python" className='icon' />
                            <p>Python</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/ios-glyphs/1000/E34C26/html-5.png" alt="html" className='icon' />
                            <p>HTML</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/color/1000/F0DB4F/javascript--v1.png" alt="js" className='icon' />
                            <p>JavaScript</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/ios-filled/1000/4B568B/php-server.png" alt="php" className='icon' />
                            <p>PHP</p>
                        </div>
                    </div>
                </div>

                <div className="cont" data-aos="fade-left">
                    <h2 className='title'>Frameworks</h2>
                    <div className="skill-type">
                        <div className="skill-box">
                            <img src="https://img.icons8.com/color/1000/000000/bootstrap.png" alt="bootstrap" className='icon' />
                            <p>Bootstrap</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/material-outlined/1000/151C2E/css-filetype.png" alt="tailwind" className='icon' />
                            <p>Tailwind CSS</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/ios-glyphs/1000/00CEF8/react.png" alt="react" className='icon' />
                            <p>React JS</p>
                        </div>
                        <div className="skill-box">
                            <svg className='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64"><path d="M32 24.795c-1.164.296-1.884.013-2.53-.957l-4.594-6.356-.664-.88-5.365 7.257c-.613.873-1.256 1.253-2.4.944l6.87-9.222-6.396-8.33c1.1-.214 1.86-.105 2.535.88l4.765 6.435 4.8-6.4c.615-.873 1.276-1.205 2.38-.883l-2.48 3.288-3.36 4.375c-.4.5-.345.842.023 1.325L32 24.795zM.008 15.427l.562-2.764C2.1 7.193 8.37 4.92 12.694 8.3c2.527 1.988 3.155 4.8 3.03 7.95H1.48c-.214 5.67 3.867 9.092 9.07 7.346 1.825-.613 2.9-2.042 3.438-3.83.273-.896.725-1.036 1.567-.78-.43 2.236-1.4 4.104-3.45 5.273-3.063 1.75-7.435 1.184-9.735-1.248C1 21.6.434 19.812.18 17.9c-.04-.316-.12-.617-.18-.92q.008-.776.008-1.552zm1.498-.38h12.872c-.084-4.1-2.637-7.012-6.126-7.037-3.83-.03-6.58 2.813-6.746 7.037z" /></svg>
                            <p>Express JS</p>
                        </div>
                    </div>
                </div>

                <div className="cont" data-aos="fade-right">
                    <h2 className='title'>Databases</h2>
                    <div className="skill-type">
                        <div className="skill-box">
                            <img src="https://img.icons8.com/material-sharp/1000/F29111/mysql-logo.png" alt="mysql" className='icon' />
                            <p>MySQL</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/1000/000000/external-mongodb-a-cross-platform-document-oriented-database-program-logo-shadow-tal-revivo.png" alt="mongodb" className='icon' />
                            <p>MongoDB</p>
                        </div>
                    </div>
                </div>

                <div className="cont" data-aos="fade-up">
                    <h2 className='title'>Tools & Technologies</h2>
                    <div className="skill-type">
                        <div className="skill-box">
                            <img src="https://img.icons8.com/color/1000/000000/git.png" alt="git" className='icon' />
                            <p>Git/Github</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/color/1000/000000/firebase.png" alt="firebase" className='icon' />
                            <p>Firebase</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/color/1000/000000/visual-studio-code-2019.png" alt="vscode" className='icon' />
                            <p>VS Code</p>
                        </div>
                        <div className="skill-box">
                            <img src="https://img.icons8.com/color/1000/000000/figma.png" alt="figma" className='icon' />
                            <p>Figma</p>
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default SkillSet
