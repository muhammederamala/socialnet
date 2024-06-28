// ModalPortal.js
import React from "react";
import ReactDOM from "react-dom";

const portalRoot = document.getElementById("portal-root");

const ModalPortal = ({ children }) => {
    const el = document.createElement("div");

    React.useEffect(() => {
        portalRoot.appendChild(el);
        return () => portalRoot.removeChild(el);
    }, [el]);

    // Center the children horizontally and vertically
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.padding = "0px"

    return ReactDOM.createPortal(children, el);
};

export default ModalPortal;
