'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

const BACKEND_URL = 'http://212.119.42.49:8000';

export default function Header() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [isRandomLoading, setIsRandomLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleRandomClick = async () => {
        if (isRandomLoading) return;
        setIsRandomLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/custom/random?limit=1`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    router.push(`/title/${data[0].id}`);
                }
            }
        } catch (error) {
            console.error("Failed to fetch random anime:", error);
        } finally {
            setIsRandomLoading(false);
        }
    };

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                Neko<span>Stream</span>
            </Link>

            <nav className={`${styles.nav} ${isMenuOpen ? styles.navActive : ''}`}>
                <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Главная</Link>
                <Link href="/search" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Каталог</Link>
                <Link href="/search?status=IS_ONGOING" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Онгоинги</Link>
                <button
                    onClick={() => {
                        handleRandomClick();
                        setIsMenuOpen(false);
                    }}
                    className={`${styles.navLink} ${styles.randomBtn}`}
                    disabled={isRandomLoading}
                >
                    {isRandomLoading ? 'Загрузка...' : 'Случайное'}
                </button>
                {/* Mobile actions copied here for easier layout if needed, or just keep them in actions */}
            </nav>

            <div className={styles.actions}>
                <button
                    className={styles.searchBtn}
                    aria-label="Поиск"
                    onClick={() => router.push('/search')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
                {isAuthenticated && user ? (
                    <div className={styles.userMenuWrapper}>
                        <span className={styles.username}>{user.username}</span>
                        <div className={styles.dropdownMenu}>
                            <button className={styles.dropdownItem} onClick={() => { router.push('/profile'); setIsMenuOpen(false); }}>
                                Профиль
                            </button>
                            <button className={styles.dropdownItem} onClick={() => { router.push('/my-list'); setIsMenuOpen(false); }}>
                                Мой список
                            </button>
                            <div className={styles.dropdownDivider}></div>
                            <button className={`${styles.dropdownItem} ${styles.logoutText}`} onClick={() => { logout(); setIsMenuOpen(false); }}>
                                Выход
                            </button>
                        </div>
                    </div>
                ) : (
                    <button className={styles.loginBtn} onClick={() => { router.push('/login'); setIsMenuOpen(false); }}>Войти</button>
                )}

                <button
                    className={styles.hamburger}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Меню"
                >
                    <div className={`${styles.bar} ${isMenuOpen ? styles.bar1 : ''}`}></div>
                    <div className={`${styles.bar} ${isMenuOpen ? styles.bar2 : ''}`}></div>
                    <div className={`${styles.bar} ${isMenuOpen ? styles.bar3 : ''}`}></div>
                </button>
            </div>
        </header>
    );
}
