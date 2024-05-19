import React, { createContext } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Admin from "./views/Admin";
import Customize from "./views/Customize";
import Info from "./views/Info";
import Thankyou from "./views/Thankyou";
import Welcome from "./views/Welcome";
import styled from "styled-components";
import InfoChoose from "./views/InfoChoose";
import Inventory from "./views/Inventory";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// @ts-ignore
export const MyContext = createContext({
    userDetails: {
        firstName: "",
    },
    setUserDetails: (design) => {},
    appDetails: {
        id: 1,
        idname: "",
        name: "",
    },
    customizeInfo: {
        selected: "",
        graphic: {
            value: "",
            font: 1,
            border: 1,
        },
    },
    setCustomizeInfo: (design) => {},
    selectedItem: "",
    setSelectedItem: (design) => {},
    inventoryDetails: [],
    setInventoryDetails: (design) => {},
    usagetime: { start: new Date(), end: new Date() },
    setUsagetime: (design) => {},
});
function App() {
    // const location = useLocation();
    console.log(window.location.pathname);
    const [appDetails, setAppDetails] = React.useState({
        id: 1,
        idname: "app1",
        name: "Suarez",
    });
    const [inventoryDetails, setInventoryDetails] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState("");
    const [usagetime, setUsagetime] = React.useState({
        start: new Date(),
        end: new Date(),
    });
    const [customizeInfo, setCustomizeInfo] = React.useState({
        selected: "graphic",
        graphic: {
            value: "",
            font: 1,
            border: null,
        },
    });

    const [userDetails, setUserDetails] = React.useState({
        firstName: "",
    });

    console.log(selectedItem);
    return (
        <MyContext.Provider
            value={{
                userDetails,
                setUserDetails,
                selectedItem,
                setSelectedItem,
                customizeInfo,
                setCustomizeInfo,
                inventoryDetails,
                setInventoryDetails,
                usagetime,
                setUsagetime,
                appDetails,
            }}
        >
            {/* {
        window.location.pathname != "/admin" ? <BG className="mybglayout"> <img src="images/pg_bg2.png" className="pg_bg2" alt="" />
          <img src="images/pg_bg1.png" className="pg_bg1" alt="" />
        </BG> : null
      } */}
            <ToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/info" element={<Info />} />
                    <Route path="/infochoose" element={<InfoChoose />} />
                    <Route path="/customize" element={<Customize />} />
                    <Route path="/thankyou" element={<Thankyou />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/inventory" element={<Inventory />} />
                </Routes>
            </BrowserRouter>
        </MyContext.Provider>
    );
}

const BG = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -12333;
    .pg_bg1 {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }
    .pg_bg2 {
        position: absolute;
        height: calc(100% - 10px);
        left: 50%;
        top: 50%;
        transform: Translate(-50%, -50%);
        object-fit: cover;
        z-index: 4;
    }
`;
export default App;
