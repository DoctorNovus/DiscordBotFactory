export default function GridManager(props)
{
    return (
        <>
            <style>{`
            .container {
                display: grid;
                grid-template-columns: 33% 33% 33%;
                grid-gap: 5px;
              }
              .container div {
                background-color: red;
              }
              
              .container div::before {
                content: "";
                padding-bottom: 100%;
                display: inline-block;
                vertical-align: top;
              }
            `}
            </style>

            <div className="container">
                {props.children}
            </div>
        </>
    )
}