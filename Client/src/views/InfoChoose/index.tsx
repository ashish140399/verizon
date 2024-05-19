import * as React from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { Footer } from "../../styles";
import axios from "axios";

interface Props {}

const InfoChoose: React.FC<Props> = () => {
    const [sizeaccept, setSizeaccept] = React.useState<string>("");
    // const [selectedCover, setSelectedItem] = useState(selectedGradient);
    const [inventory, setInventory] = React.useState([]);
    const { setSelectedItem, appDetails } = React.useContext(MyContext);

    const handleAcceptChange = (event: SelectChangeEvent) => {
        setSizeaccept(String(event.target.value));
    };

    React.useEffect(() => {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/api/fetchinventory?appid=${appDetails.id}`
            )
            // .get(`http://localhost:8084/api/fetchsizes`)
            .then((response) => {
                console.log(response.data);
                setInventory(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    console.log(inventory);

    // React.useEffect(() => {
    //     if (inventory) {
    //         let temparr = [];
    //         inventory.map((item, index) => {
    //             if (item.is_active) {
    //                 temparr.push(item.size);
    //             }
    //         });
    //         setAvlsizearr(temparr);
    //         setSizeaccept(temparr[0]);
    //     }
    // }, [inventory]);

    React.useEffect(() => {
        setSelectedItem(sizeaccept);
    }, [sizeaccept]);
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
                    <h1>Choose your phone case</h1>
                    <FormControl fullWidth>
                        <Select
                            labelId="timeSelect"
                            id="timeSelect"
                            defaultValue={sizeaccept}
                            value={sizeaccept}
                            onChange={handleAcceptChange}
                        >
                            {inventory.length > 0 &&
                                inventory.map((item) => (
                                    <MenuItem
                                        key={item.iv}
                                        value={item.item_name}
                                        className={`${
                                            item.used_count >=
                                            item.available_items
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        {item.item_name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </RowBox>
                <Footer>
                    <Link className="nav-link" to="/info">
                        <button className="btnglobal btnleft">{`<`}</button>
                    </Link>
                    <Link className="nav-link" to="/customize">
                        <button className="btnglobal btnright">{`>`}</button>
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
    .MuiInputBase-formControl {
        color: #000 !important;
        font-size: 54px !important;
        background: #fff;
        filter: drop-shadow(0 3px 6px #000);
        .MuiInputBase-input {
            padding: 8px 18px !important;
        }
        .MuiOutlinedInput-notchedOutline {
            border: 1px solid #fff !important;
            border-radius: 0 !important;
        }
        .MuiSvgIcon-root {
            font-size: 160px !important;
            color: #ec1c24 !important;
            margin-right: -40px;
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

export default InfoChoose;
