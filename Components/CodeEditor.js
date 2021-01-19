export default function CodeEditor()
{
    return (
        <>
            <style>
                {
                    `
                .full {
                    height: 100%;
                }

                .border-black {
                    border: 1px solid black;
                }

                #formatter {
                    color: white;
                    background-color: #1e1e1e;
                    white-space: pre-wrap;       /* css-3 */
                    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
                    white-space: -pre-wrap;      /* Opera 4-6 */
                    white-space: -o-pre-wrap;    /* Opera 7 */
                    word-wrap: break-word;       /* Internet Explorer 5.5+ */
                }
                `
                }
            </style>
            <div>
                <div contentEditable id="formatter" className="full border-black"></div>
            </div>
        </>
    )
}