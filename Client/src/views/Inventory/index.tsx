import * as React from "react";
import styled from "styled-components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { createGlobalStyle } from "styled-components";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { TRUE } from "sass";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import { PDFDocument, StandardFonts, rgb, PageSizes } from "pdf-lib";
import { fabric } from "fabric";
import LoaderAnimation from "../components/LoaderAnimation";
import { toast } from "react-toastify";
import { MyContext } from "../../App";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: teal;
    font-family: Verizon;
    background:#f3f3f3;
    overflow:scroll !important;
    .mybglayout{
      display:none !important;
    }
  }

`;

function createData(id: any, name: string, size: string) {
    return { id, name, size };
}

interface Props {}

const Inventory: React.FC<Props> = () => {
    const [inventoryres, setInventoryres] = React.useState(null);
    const { appDetails } = React.useContext(MyContext);
    const fetchInventory = () => {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/api/fetchinventory?appid=${appDetails.id}`
            )
            .then((response) => {
                setInventoryres(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    React.useEffect(() => {
        fetchInventory();
    }, []);

    console.log("inventoryres", inventoryres);

    const [avlupdated, setAvlupdated] = React.useState<number>(0);

    const [avlpatchupdated, setAvlpatchupdated] = React.useState<number>(0);

    const updatepatchInventory = async (iv, avlpatch) => {
        console.log(iv, avlpatch);
        axios
            .post(`${process.env.REACT_APP_API_URL}/api/updateinventory`, {
                iv: iv,
                avlitems: avlpatch,
            })
            .then((response) => {
                console.log(response.data);

                fetchInventory();
                toast.success(`Inventory updated`, {
                    position: "top-right",
                    autoClose: 2000, // Close the toast after 3000ms (3 seconds)
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        fontSize: "15px",
                        color: "rgba(0,0,0,0.7)",
                    },
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <GlobalStyle />

            <>
                <Layout>
                    <div className="heading">
                        <h1>Admin Panel</h1>Case - Inventory
                    </div>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>

                                    <TableCell align="center">
                                        CASE TYPE
                                    </TableCell>
                                    <TableCell align="center">
                                        USED ITEMS
                                    </TableCell>
                                    <TableCell align="center">
                                        TOTAL ITEMS
                                    </TableCell>

                                    <TableCell align="center">
                                        UPDATE TOTAL
                                    </TableCell>

                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inventoryres &&
                                    inventoryres.map((res, index) => {
                                        return (
                                            <TableRow
                                                key={res.iv}
                                                sx={{
                                                    "&:last-child td, &:last-child th":
                                                        {
                                                            border: 0,
                                                        },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {index + 1}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {res.item_name.toUpperCase()}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {res.used_count}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {res.available_items}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <input
                                                        className="name_input"
                                                        type="number"
                                                        placeholder={
                                                            res.available_items
                                                        }
                                                        onChange={(e) =>
                                                            setAvlpatchupdated(
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    />
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        onClick={() =>
                                                            updatepatchInventory(
                                                                res.iv,
                                                                avlpatchupdated
                                                            )
                                                        }
                                                    >
                                                        Update
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Layout>
            </>
        </>
    );
};
const Layout = styled.div`
    max-width: 1200px;
    margin: auto;
    background: #fff;
    padding: 24px;
    margin-top: 40px;
    border-radius: 12px;
    .name_input {
        height: 28px;
        border-radius: 8px;
        max-width: 100px;
        font-size: 20px;
    }
    .opbox {
        font-size: 24px;
    }
    .canvaswrapper {
        // background: red;
        // height: 1800px;
    }
    .ddicon {
        background: transparent;
        padding: 0;
        border: 0;
        cursor: pointer;
        svg {
            transform: scale(2);
            path {
                fill: #fff;
            }
        }
    }
    .heading {
        background: linear-gradient(to top, #5d6dc3, #3c86d8);
        color: #fff;
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 600;
        margin-bottom: 14px;
        h1 {
            font-size: 22px;
        }
    }
    .canvaspreview {
        width: 140px;
        height: 140px;
        object-fit: contain;
    }
    .MuiTableHead-root {
        background: #f7f7f7 !important;
    }
    .MuiTableCell-root {
        padding-top: 14px !important;
        padding-bottom: 14px !important;
    }
    .btmpagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
`;

export default Inventory;
