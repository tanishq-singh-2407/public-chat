import type { NextPage } from 'next';
import styles from '../styles/components/footer.module.css';

const Footer: NextPage = () => {
    return (
        <footer className={styles.footer} >
            <span className={styles.span} onClick={() => window.open('https://github.com/tanishq-singh-2301', '_blank')}>Created by: Tanishq Singh</span>
        </footer>
    );
};

export default Footer;