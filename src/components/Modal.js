import React from "react";
import { css } from '@emotion/css'

function Modal({ children, isOpen = true, onClick }) {

    return (
        <>
            {
                isOpen && (
                    <div
                        className={css`
                    justify-content: center;
                    position: fixed;
                    background: rgba(0, 0, 0, 0.55);
                    width: 100vw;
                    height: 100vh;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                `}
                        onClick={onClick}
                    >
                        {children}
                    </div>
                )
            }

        </>
    )
}

export default Modal;