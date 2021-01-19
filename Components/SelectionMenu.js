import styles from "../styles/SelectionMenu.module.css";
import { buildText, importCode } from "../utils/ClientFileSystem";

export default function SelectionMenu()
{
    return (
        <>
            <div className={styles.container}>
                <ul>
                    <p>File</p>
                    <ul>
                        <li className={styles.import}>
                            <p onClick={importCode} >Import</p>
                            <input id="import-file" title="import-settings" type="file" accept=".json"/>
                        </li>
                        <li onClick={buildText}>Save</li>
                    </ul>
                </ul>
                <ul>
                    <p>Debug</p>
                    <ul>
                        <li>Test</li>
                    </ul>
                </ul>
            </div>
        </>
    )
}