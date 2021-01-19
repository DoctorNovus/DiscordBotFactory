import Gallary from "./Gallary";
import UpdateMenu from "./UpdateMenu";
import styles from "../styles/MainBody.module.css";

export default function MainBody()
{
    return (
        <div className={styles.main}>
            <UpdateMenu></UpdateMenu>
            <Gallary images="apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png; apple-touch-icon.png"></Gallary>
        </div>
    )
}