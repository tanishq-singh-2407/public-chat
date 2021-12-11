import Navbar from './Navbar';
import Footer from './Footer';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
};