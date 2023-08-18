import React from 'react';
import { Triangle } from 'react-loader-spinner'

const Loader = () => {
    return (
        <div>
            <Triangle
                height="100"
                width="100"
                color="#FFFFFF"
                ariaLabel="triangle-loading"
                wrapperStyle={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "100vw",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999,
                    backgroundColor: "#0060FF"
                }}
                visible={true}
            />
        </div>
    )
}

export default Loader;