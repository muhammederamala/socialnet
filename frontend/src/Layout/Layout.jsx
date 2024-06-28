import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import Navbar from '../Components/PC/Navbar/Navbar';

function Layout() {
    const location = useLocation();
    const [hideLayout, setHideLayout] = useState(location.pathname.startsWith("/login") || location.pathname.startsWith("/signup"));

    useEffect(() => {
        setHideLayout(location.pathname.startsWith("/login") || location.pathname.startsWith("/signup"));
    }, [location.pathname])

    return (
        <div style={{ height: "95vh", width: "95vw" }}>

            {!hideLayout && <Navbar />}
            <Outlet />
        </div>
    )
}

export default Layout
