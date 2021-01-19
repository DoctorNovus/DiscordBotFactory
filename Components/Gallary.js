import styles from "../styles/Gallary.module.css";

export default function Gallary(props)
{
    let images = props.images ? props.images.split(/;/g) : [];

    return (
        <div className={styles.images}>
            {images.map(i => (<img src={i} />))}
        </div>
    )
}