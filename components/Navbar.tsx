import type { NextPage } from 'next';
import styles from '../styles/components/navbar.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const NavBar: NextPage = () => {
    const router = useRouter();
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        setName(new URLSearchParams(window.location.search).get('name'))
    }, [])

    return (
        <header className={styles.header} >
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <span onClick={() => router.push('/')} className={styles.span} >
                        Public Chat
                    </span>
                </div>
                <div className={styles.name} >
                    {name}
                </div>
            </nav>
        </header>
    );
};

export default NavBar;