import * as React from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";

interface Props {}

const Info: React.FC<Props> = () => {
    const { userDetails, setUserDetails, setUsagetime, usagetime } =
        React.useContext(MyContext);

    const handleinputChange = (e) => {
        setUserDetails((prevState) => ({
            ...prevState,
            firstName: e.target.value,
        }));
    };
    React.useEffect(() => {
        setUsagetime({
            ...usagetime,
            start: new Date(),
        });
    }, []);
    React.useEffect(() => {
        const handleInputBlur = () => {
            // Scroll to the top of the page
            window.scrollTo({
                top: 0,
                behavior: "smooth", // optional smooth scrolling
            });
        };

        // Add event listener for input blur
        document.addEventListener("blur", handleInputBlur, true);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("blur", handleInputBlur, true);
        };
    }, []);
    React.useEffect(() => {
        const handleInputBlur = () => {
            // Scroll to the top of the page
            window.scrollTo({
                top: 0,
                behavior: "smooth", // optional smooth scrolling
            });
        };

        // Add event listener for input blur
        document.addEventListener("blur", handleInputBlur, true);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("blur", handleInputBlur, true);
        };
    }, []);
    return (
        <>
            <Layout>
                <RowBox>
                    <h1>Enter your name</h1>
                    <input type="text" onChange={(e) => handleinputChange(e)} />
                </RowBox>

                <Footer>
                    <Link className="nav-link" to="/">
                        <button className="btnglobal btnleft">{`<`}</button>
                    </Link>
                    <Link className="nav-link" to="/infochoose">
                        <button
                            className="btnglobal btnright"
                            disabled={!userDetails.firstName}
                        >
                            {`>`}
                        </button>
                    </Link>
                </Footer>
                <img
                    src="images/common/logo_btm.png"
                    className="logo_btm"
                    alt=""
                />
            </Layout>
        </>
    );
};
const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    padding: 0 40px 34px 40px;
    bottom: 0;
    box-sizing: border-box;
`;
const RowBox = styled.div`
    width: 60vw;
    position: relative;
    &:last-child {
        margin-bottom: 0;
    }
    h1 {
        color: rgba(255, 255, 255, 1);
        text-shadow: 0px 3px 6px #00000084;
        font-size: 36px;
        font-family: Verizon;
        font-weight: 100;
        letter-spacing: 3px;
        position: absolute;
        top: -120px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
    }
    input {
        width: 100%;
        margin: 0;
        border: 1px solid rgba(0, 0, 0, 0.4);
        font-size: 54px;
        outline: 0;
        padding: 10px 15px;
        box-sizing: border-box;
        text-align: center;
        filter: drop-shadow(0 3px 6px #000);
        &::placeholder {
            color: rgba(112, 112, 112, 0.19);
            font-weight: 600;
        }
    }
`;
const Layout = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;

    min-width: 280px;
    padding: 0 10vw;
    // .logo_btm {
    //     position: absolute;
    //     width: 30vw;
    //     bottom: 10px;
    // }

    .enter_button {
        background: #2c3296;
        border: 0;
        font-size: 30px;
        color: #fff;
        outline: 0;
        width: 124px;
        height: 51px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
`;

export default Info;
