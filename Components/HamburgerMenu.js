import { useState } from "react";
import styles from "../styles/HamburgerMenu.module.css";

export default function HamburgerMenu()
{
    if (typeof window != "undefined")
    {
        if (window.innerWidth < 968)
        {
            document.querySelector("#hm-menu").classList.remove("hidden")
        } else
        {
            document.querySelector("#hm-menu").classList.add("hidden")
        }

        window.onresize = () =>
        {
            if (window.innerWidth < 968)
            {
                document.querySelector("#hm-menu").classList.remove("hidden")
            } else
            {
                document.querySelector("#hm-menu").classList.add("hidden")
            }
        }
    }

    return (
        <>
            <style>
                {
                    `

                    #hm-menu {
                        display: none;
                    }

                    @media only screen and (max-width: 968px){
                        #hm-menu {
                            font-size: 2em;
                            user-select:none;
                            display: inline-block;
                        }

                        #hm-menu * {
                            display: inline-block;
                        }

                        .leftToggle {
                            transform: rotate(-60deg) translate(-1px, 5px);
                        }

                        .rightToggle {
                            transform: rotate(60deg) translate(1px, 5px);
                        }
                    }
                    `
                }
            </style>

            <div onClick={(e) =>
            {
                document.querySelector("#s-l").classList.toggle("leftToggle");
                document.querySelector("#s-r").classList.toggle("rightToggle");
            }} id="hm-menu" className="hidden">
                <span id="s-l" className="">|</span>
                <span id="s-m" className="">|</span>
                <span id="s-r" className="">|</span>
            </div>
        </>
    )
}