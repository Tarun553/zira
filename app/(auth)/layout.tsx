import React from "react";

const Layout = ({children}: {children: React.ReactNode}) => {
    return <div className="flex min-h-screen flex-col items-center justify-between p-24">{children}</div>
}

export default Layout
