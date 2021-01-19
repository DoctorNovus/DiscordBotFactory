import GridManager from "./GridManager";
import Template from "./Template";

export default function TemplateSelector(){
    return (
        <>
            <GridManager>
                <Template redirect="SimpleBot"></Template>
            </GridManager>
        </>
    );
}