import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

interface Props {}

const Thankyou: React.FC<Props> = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        setTimeout(() => {
            console.log("called");
            navigate("/");
            window.location.reload();
        }, 7000);
    }, []);
    return (
        <>
            <Layout>
                <img src="./images/common/logo.png" className="logo" alt="" />
                <img
                    src="./images/common/thankstext.png"
                    className="text"
                    alt=""
                />
            </Layout>
        </>
    );
};
const Layout = styled.div`
    display: flex;
    // align-items: center;
    flex-direction: column;
    justify-content: center;
    align-items: Center;
    min-height: 100vh;
    background: #e91a21;
    img {
        position: absolute;
        left: 50%;
        transform: TranslateX(-50%);
    }
    .logo {
        width: 32vh;
        bottom: 9vh;
        display: none;
    }

    .text {
        width: 80vh;
        top: 25vh;
    }
`;

export default Thankyou;
