import Link from "next/link"
import styles from "./Navbar.module.css"

export default function Navbar() {

    return (
        <header className={styles.navbar}>
            <h1 className={styles.title}>
                <Link href={"/"}>Movie App</Link>
            </h1>
            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <li>
                        <Link href={"/search"} className={styles.link}>Search</Link>
                    </li>
                    <li>
                        <Link href={"/favorites"} className={styles.link}>Favorites</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}