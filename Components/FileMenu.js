export default function FileMenu()
{
    return (
        <>
            <style>
                {
                    `
                    #fileMenu {
                        position: absolute;
                        background-color: #1e1e1e;
                        color: white;
                    }

                    #fileMenu[disabled] {
                        display: none;
                    }
                    `
                }
            </style>
            <div id="fileMenu" tabIndex="0" disabled>
                <ul>
                    <li>Rename File</li>
                    <li>Delete File</li>
                </ul>
            </div>
        </>
    )
}