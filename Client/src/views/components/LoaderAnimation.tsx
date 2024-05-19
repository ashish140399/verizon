import * as React from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

interface Props {
    title?: string;
}

const LoaderAnimation: React.FC<Props> = ({ title }) => {
    return (
        <>
            <Layout>
                <div className="fadebg"></div>
                <div id="loader">
                    <div id="box"></div>
                    <div id="hill"></div>
                    <div className="text">{title}</div>
                </div>
            </Layout>
        </>
    );
};

const Layout = styled.div`
    .fadebg {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        top: 0;
        left: 0;
        z-index: 10;
    }
    #loader {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -2.7em;
        margin-left: -2.7em;
        width: 5.4em;
        height: 5.4em;
        background-color: transparent;
        z-index: 14;
    }
    .text {
        color: #fff;
        position: absolute;
        white-space: nowrap;
        bottom: -60px;
        font-size: 26px;
        font-weight: 300;
        left: 50%;
        transform: translateX(-50%);
    }
    #hill {
        position: absolute;
        width: 7.1em;
        height: 7.1em;
        top: 1.7em;
        left: 1.7em;
        background-color: transparent;
        border-left: 0.25em solid whitesmoke;
        transform: rotate(45deg);
    }

    #hill:after {
        content: "";
        position: absolute;
        width: 7.1em;
        height: 7.1em;
        left: 0;
        background-color: transparent;
    }

    #box {
        position: absolute;
        left: 0;
        bottom: -0.1em;
        width: 1em;
        height: 1em;
        background-color: transparent;
        border: 0.25em solid whitesmoke;
        border-radius: 15%;
        transform: translate(0, -1em) rotate(-45deg);
        animation: push 2.5s cubic-bezier(0.79, 0, 0.47, 0.97) infinite;
    }

    @keyframes push {
        0% {
            transform: translate(0, -1em) rotate(-45deg);
        }
        5% {
            transform: translate(0, -1em) rotate(-50deg);
        }
        20% {
            transform: translate(1em, -2em) rotate(47deg);
        }
        25% {
            transform: translate(1em, -2em) rotate(45deg);
        }
        30% {
            transform: translate(1em, -2em) rotate(40deg);
        }
        45% {
            transform: translate(2em, -3em) rotate(137deg);
        }
        50% {
            transform: translate(2em, -3em) rotate(135deg);
        }
        55% {
            transform: translate(2em, -3em) rotate(130deg);
        }
        70% {
            transform: translate(3em, -4em) rotate(217deg);
        }
        75% {
            transform: translate(3em, -4em) rotate(220deg);
        }
        100% {
            transform: translate(0, -1em) rotate(-225deg);
        }
    }
`;

export default LoaderAnimation;
