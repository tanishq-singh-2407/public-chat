import Head from 'next/head';
import styles from '../styles/Chat.module.css';
import { Component } from 'react';
import Header from '../components/Navbar';

class Chat extends Component {
    state = {
        message: '',
        ws: null,
        publicMessages: [{
            name: 'BOT',
            message: 'Type Something'
        }],
        name: ''
    };

    componentDidMount() {
        const url: any = process.env.NEXT_PUBLIC_WS_ENDPOINT;
        const ws = new WebSocket(url);
        const name = new URLSearchParams(window.location.search).get('name');
        const button: HTMLButtonElement | any = document.getElementById('button');
        button.disabled = true;

        name === null ? window.location.replace(window.location.origin) : this.setState({ name });

        ws.onopen = () => {
            this.setState({ ws });
            button.disabled = false;
        };

        ws.onmessage = (event: any) => {
            const data = JSON.parse(event.data);
            if (!data.fromServer) {
                this.setState({
                    publicMessages: [...this.state.publicMessages, {
                        name: data.name === null ? 'UK' : data.name,
                        message: data.message
                    }]
                });
            };
        };

        this.scrollToBottom();
        window.addEventListener('keypress', e => e.code === "Enter" ? button.disabled ? null : this.send(this.state.ws, this.state.message, this.state.name) : null);
    };

    componentDidUpdate() {
        this.scrollToBottom();
    };

    send = (ws: WebSocket | any, message: string, name: string) => {
        ws.send(JSON.stringify({ action: "publicMessage", message, name }));
        this.setState({ message: '' });
    };
    scrollToBottom = () => document.getElementById('forScrollDown')?.scrollIntoView({ behavior: 'smooth' });

    render() {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <Head>
                        <title>KAJU | CHAT</title>
                        <meta name="description" content="Generated by create next app" />
                        <link rel="icon" href="/favicon.ico" />
                        <title>Chat</title>
                    </Head>
                    <section className={styles.chat_section}>
                        <section className={styles.chats}>
                            {
                                this.state.publicMessages.map((value, index) =>
                                    <div key={index} className={styles.one_message}>
                                        <span className={styles.one_message_name}>{value.name}</span>
                                        <span className={styles.one_message_msg}>{value.message}</span>
                                    </div>
                                )
                            }
                            <div className={styles.forScrollDown} id="forScrollDown" />
                        </section>
                        <section className={styles.input_section}>
                            <input type="text" value={this.state.message} onChange={e => this.setState({ message: e.target.value })} className={styles.text} placeholder='Enter text.' />
                            <button type="submit" id="button" onClick={() => this.send(this.state.ws, this.state.message, this.state.name)} className={styles.submit}>
                                <i className="bi bi-send" id={styles.submit_icon}></i>
                            </button>
                        </section>
                    </section>
                </main>
            </>
        );
    };
}

export default Chat;