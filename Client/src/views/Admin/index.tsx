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

const rows = [createData(1, "asdf", "AS")];

interface Props {}
// const getSvgContent = (imageUrl) => {
//     // return "sfd";
//     return fetch(imageUrl).then((response) => {
//         if (!response.ok) {
//             throw new Error("HTTP error " + response.status);
//         }
//         return response.text();
//     });
// };

function SvgDisplayComponent({ imageUrl }) {
    const [svgContent, setSvgContent] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        getSvgContent(imageUrl)
            .then((content) => {
                setSvgContent(content);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [imageUrl]); // Re-run the effect if imageUrl changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    // console.log(svgContent);
    return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
}

// Assuming getSvgContent is defined as before
const getSvgContent = (imageUrl) => {
    return fetch(imageUrl).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.text();
    });
};

// const downloadit = (imageUrl) => {
//     fetch(imageUrl)
//         .then((response) => {
//             return response.blob();
//         })
//         .then((modifiedSVG) => {
//             // Create a temporary anchor element
//             // const url = window.URL.createObjectURL(blob);
//             var blob = new Blob([modifiedSVG], {
//                 type: "image/svg+xml;charset=utf-8",
//             });

//             var url = URL.createObjectURL(blob);
//             console.log(blob);
//             const link = document.createElement("a");
//             link.href = url;
//             window.open(url, "_blank");
//             //  // Extract the filename from the URL
//             //   const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

//             //   // Set the download attribute and filename
//             //   link.setAttribute("download", filename);
//             //   document.body.appendChild(link);

//             //   // Simulate a click on the anchor element to start the download
//             //   link.click();

//             //   // Clean up the temporary anchor element
//             //   link.parentNode.removeChild(link);

//             // // Set the downloaded image URL to display on the page
//             // setImageUrl(url);
//         })
//         .catch((error) => {
//             console.error("Error downloading image:", error);
//         });
// };

const downloadIt = (res, imageUrl) => {
    fetch(imageUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.blob(); // Get the image as a blob
        })
        .then((blob) => {
            // Create a URL for the blob
            const url = URL.createObjectURL(blob);
            console.log("Blob created:", blob); // Optionally log the blob

            // Create an anchor element and set the download attribute
            const a = document.createElement("a");
            a.href = url;
            a.download = `${res?.id}_${res?.userdetails.firstName}`; // Specify the download file name
            document.body.appendChild(a);
            a.click(); // Trigger a click on the anchor element
            document.body.removeChild(a); // Remove the anchor element from the DOM
        })
        .catch((error) => {
            console.error("Error downloading image:", error);
        });
};

const sendSMS = async (res) => {
    const messagetext = `${res.userdetails?.firstName}, your item is ready for pick-up. Order #${res.id}`;
    const phoneNumber = res.userdetails.phonenumber;
    const formattedPhoneNumber = phoneNumber.replace(/-/g, "");

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/send-sms`,
            {
                to: `+1${formattedPhoneNumber}`,
                from: "+15104058591",
                body: messagetext,
                id: res.id,
            }
        );

        const result = response.data;
        console.log(result);
        toast.success(
            `Message sent to ${
                res.userdetails?.firstName + " " + res.userdetails?.lastName
            } for OrderId #${res.id}`,
            {
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
            }
        );
    } catch (error) {
        toast.error(
            `Message sending failed to ${res.userdetails?.firstName} for OrderId #${res.id}`,
            {
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
            }
        );
        console.error(error);
    }
};

const InnerTableRow = ({ res, index }) => {
    const [isreceiptDownloading, setIsreceiptDownloading] =
        React.useState(false);
    const [status, setStatus] = React.useState<string>(res.status);
    const handleAcceptChange = (event: SelectChangeEvent) => {
        setStatus(String(event.target.value));
        axios
            .post(`${process.env.REACT_APP_API_URL}/api/savestatus`, {
                id: res.id,
                type: "status",
                status: String(event.target.value),
            })
            .then((response) => {
                console.log(response.data);
                toast.success(
                    `Status updated for ${res.userdetails?.firstName} for OrderId #${res.id}`,
                    {
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
                    }
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const canvasRef = React.useRef(null);
    const canvasReftemp = React.useRef(null);
    const [croppedcanvas, setCroppedcanvas] = React.useState(null);

    const generatePrint = async () => {
        await document.fonts.load("16px Gin Montserrat Aldine");
        // Initialize Fabric.js
        let widthcanvas = 2550;
        let heightcanvas = 4200;
        const canvas = new fabric.Canvas(canvasRef.current, {
            targetFindTolerance: 5,
            width: widthcanvas,
            height: heightcanvas,
        });

        // Set canvas background color
        canvas.backgroundColor = "white";

        // Create A4 size rectangle with black border
        const a4SizeRect = new fabric.Rect({
            width: widthcanvas - 50,
            height: heightcanvas - 50,
            originX: "left",
            originY: "top",
            top: 50 / 2, // Adjust the vertical position of the text
            left: 50 / 2,
            fill: "white", // You can change the fill color if needed
            stroke: "black",
            strokeWidth: 8, // Adjust border width as needed
            selectable: false,
            evented: false,
        });
        canvas.add(a4SizeRect);

        // Add text at the bottom

        return new Promise<void>((resolve, reject) => {
            fetch(res.canvasuri)
                .then((response) => response.blob())
                .then((blob) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        fabric.Image.fromURL(
                            reader.result as string,
                            (img) => {
                                // const scale = Math.min(
                                //     maxW / img.width,
                                //     maxH / img.height
                                // );
                                canvas.centerObject(img);
                                img.set({
                                    // top: text.top + text.height,
                                    width: 955,
                                    height: 1931,
                                    selectable: false,
                                    evented: false,
                                });

                                canvas.add(img);
                                const text = new fabric.Text(
                                    `${res?.userdetails.firstName} - ${res?.itemname}`,
                                    {
                                        fontSize: 140,
                                        fontFamily: "Gin",
                                        selectable: false,
                                        evented: false,
                                        scaleX: -1,
                                    }
                                );
                                canvas.centerObject(text);
                                text.set({ top: 300 });
                                canvas.add(text);

                                canvas.renderAll();

                                // Export the scaled canvas
                                const highResDataURL = canvas.toDataURL({
                                    format: "png",
                                    left: 0,
                                    top: 0,
                                    width: canvas.width,
                                    height: canvas.height,
                                });
                                // console.log(tempCanvas.width, highResDataURL);

                                const link = document.createElement("a");
                                link.href = highResDataURL;
                                // window.open(dataUrl, "_blank");
                                link.download =
                                    "#" +
                                    res.id +
                                    " " +
                                    res?.userdetails.firstName;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                setIsreceiptDownloading(false);

                                // Use highResDataURL as needed
                                // setCroppedcanvas(highResDataURL); // This logs the base64 image URL of the high-resolution image

                                resolve(); // Resolve the promise after everything is loaded and rendered
                            },
                            { crossOrigin: "anonymous" }
                        );
                    };
                    reader.readAsDataURL(blob);
                    reader.onerror = (error) => reject(error);
                })
                .catch((error) => reject(error));
        });
    };
    // React.useEffect(() => {
    //     if (res.canvasuri.endsWith(".png")) generatePrint();
    // }, [res]);

    const downloadreceipt = async () => {
        try {
            setIsreceiptDownloading(true);
            await generatePrint();

            // Convert canvas to data URL
            // @ts-ignore
            // const dataUrl = canvasRef?.current?.toDataURL({
            //     format: "png",
            //     multiplier: 1, // Increase multiplier for higher resolution
            // });

            // Create a link element and trigger the download
            // const link = document.createElement("a");
            // link.href = croppedcanvas;
            // // window.open(dataUrl, "_blank");
            // link.download = "#" + res.id + " " + res?.userdetails.firstName;
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);

            // setIsreceiptDownloading(false);
        } catch (error) {
            console.error(
                "Error during the image processing or download:",
                error
            );
        }
    };

    return (
        res.canvasuri.endsWith(".png") && (
            <TableRow
                key={res.id}
                sx={{
                    "&:last-child td, &:last-child th": {
                        border: 0,
                    },
                }}
            >
                <TableCell component="th" scope="row">
                    {index + 1}
                </TableCell>

                <TableCell align="center">
                    {res.userdetails.firstName}
                </TableCell>
                {/* <TableCell align="center">{res.userdetails.phonenumber}</TableCell> */}
                {/* <TableCell align="center">{res.userdetails.phonenumber}</TableCell> */}
                {/* <TableCell align="center">
                {res.itemname.toUpperCase()} TAG
            </TableCell> */}
                <TableCell align="center">{res.itemname}</TableCell>
                {/* <TableCell align="center">
                <div
                    className="opbox"
                    style={{
                        fontFamily: fontlist[res.customizeInfo?.text?.font],

                        // color: colorlist[
                        //     res.customizeInfo?.text?.colorselected
                        // ],
                    }}
                >
                    {res.customizeInfo.text?.value}
                </div>
            </TableCell> */}
                {/* <TableCell align="center">
         
                {fontlist[res.customizeInfo.text?.font]}
            </TableCell> */}
                <TableCell align="center">
                    <div className="canvaspreview">
                        {/* <SvgDisplayComponent imageUrl={res.canvasuri} /> */}
                        <img src={res.canvasuri} alt="" />
                    </div>
                </TableCell>
                {/* <TableCell align="center">
                    <div className="canvaspreview">
                        <img src={croppedcanvas} alt="" />
                    </div>
                </TableCell> */}
                <TableCell align="center">
                    <Button
                        variant="contained"
                        // disabled={!res.canvasuri.endsWith(".svg")}
                        onClick={() => downloadIt(res, res.canvasuri)}
                    >
                        Download
                    </Button>
                </TableCell>
                <TableCell align="center">
                    <div className="canvaswrapper" style={{ display: "none" }}>
                        <canvas ref={canvasRef} />
                    </div>
                    <Button
                        variant="contained"
                        onClick={() => downloadreceipt()}
                    >
                        {isreceiptDownloading ? (
                            <>
                                <CircularProgress
                                    style={{
                                        color: "white",
                                        height: "20px",
                                        width: "20px",
                                    }}
                                    thickness={3}
                                />
                            </>
                        ) : (
                            "Receipt"
                        )}
                    </Button>
                </TableCell>
                <TableCell align="center">
                    <FormControl fullWidth>
                        <Select
                            labelId="statusSelect"
                            id="statusSelect"
                            className={status}
                            defaultValue={status}
                            value={status}
                            onChange={handleAcceptChange}
                        >
                            <MenuItem value={"pending"}>Pending</MenuItem>
                            <MenuItem value={"complete"}>Complete</MenuItem>
                        </Select>
                    </FormControl>
                </TableCell>
                {/* {res.userdetails.smsfeature && ( */}
                {/* <TableCell align="right">
                <Button
                    variant="contained"
                    // disabled={!res.canvasuri.endsWith(".svg")}
                    onClick={() => sendSMS(res)}
                >
                    {res.texttouser?.count > 0
                        ? "Re-Send TEXT !!"
                        : "Send TEXT !!"}
                </Button>
            </TableCell> */}
                {/* )} */}
            </TableRow>
        )
    );
};

const Admin: React.FC<Props> = () => {
    const [dbres, setDbres] = React.useState(null);
    const [showadmin, setShowadmin] = React.useState(true);
    const { appDetails } = React.useContext(MyContext);
    const itemsPerPage = 50;
    const [currentData, setCurrentData] = React.useState(null);
    const [page, setPage] = React.useState(1);
    // console.log(dbsize)
    React.useEffect(() => {
        if (dbres) {
            setCurrentData(
                dbres.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            );
        }
    }, [dbres, page]);
    console.log(dbres);

    React.useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/fetchdb`)
            .then((response) => {
                setDbres(response.data.reverse());
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleChange = (event, value) => {
        setPage(value);
    };
    const [showloader, setShowloader] = React.useState(false);

    return (
        <>
            <GlobalStyle />
            {/* <button onClick={generatePDF}>PF</button> */}
            {showloader && <LoaderAnimation title="Loading" />}
            {showadmin && (
                <>
                    <Layout>
                        <div className="heading">
                            <h1>Admin Panel</h1>Verizon
                        </div>

                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Order ID</TableCell>

                                        <TableCell align="center">
                                            Name (GUEST)
                                        </TableCell>
                                        {/* <TableCell align="center">
                                            PHONE
                                        </TableCell> */}
                                        {/* <TableCell align="center">
                                            Phone No.
                                        </TableCell> */}

                                        {/* <TableCell align="center">
                                            PRODUCT DESCRIPTION
                                        </TableCell> */}
                                        <TableCell align="center">
                                            Case Name
                                        </TableCell>
                                        <TableCell align="center">
                                            Image
                                        </TableCell>

                                        {/* <TableCell align="center">
                                            FONT TYPE
                                        </TableCell> */}
                                        <TableCell align="center">
                                            PDF PRINT
                                        </TableCell>
                                        <TableCell align="center">
                                            RECEIPT
                                        </TableCell>
                                        {/* <TableCell align="center"></TableCell> */}
                                        <TableCell align="center">
                                            STATUS
                                        </TableCell>
                                        {/* <TableCell align="center">
                                            SMS
                                        </TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentData &&
                                        currentData.map((res, index) => {
                                            if (appDetails.id === res.appid)
                                                return (
                                                    <InnerTableRow
                                                        index={index}
                                                        key={res.id}
                                                        res={res}
                                                    />
                                                );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className="btmpagination">
                            <Pagination
                                count={Math.ceil(
                                    dbres ? dbres.length / itemsPerPage : null
                                )}
                                page={page}
                                onChange={handleChange}
                            />
                        </div>
                    </Layout>
                </>
            )}
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
        width: 200px;
        height: 200px;
        object-fit: contain;
        svg {
            width: 200px;
            height: 200px;
            object-fit: contain;
        }
        img {
            width: 200px;
            height: 200px;
            object-fit: contain;
        }
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

export default Admin;
