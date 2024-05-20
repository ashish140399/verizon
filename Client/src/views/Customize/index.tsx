import React, { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";
import { fabric } from "fabric";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import LoaderAnimation from "../components/LoaderAnimation";
import axios from "axios";
interface Props {}

const Customize: React.FC<Props> = () => {
    const [selGraphic, setSelGraphic] = useState([]);
    const [graphicinventory, setGraphicinventory] = useState([]);
    const [canvasObjects, setCanvasObjects] = useState([]);
    const [showloader, setShowloader] = useState(false);
    const [canvas, setCanvas] = useState(null);
    const navigate = useNavigate();
    const [designfinalised, setDesignfinalised] = useState(false);
    const [objectadding, setObjectadding] = useState(true);

    const { selectedItem, appDetails, setUsagetime, usagetime, userDetails } =
        useContext(MyContext);
    // const [selcdesign, setSelcdesign] = useState(selectedCover);
    const [bgImage2, setBgImage2] = useState(null);
    const [screennum, setScreennum] = useState(2);
    var deleteIcon =
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

    const toggleArtSelection = (index: any) => {
        setObjectadding(true);
        setSelGraphic([...selGraphic, index]);
    };
    console.log(selGraphic);

    React.useEffect(() => {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/api/fetchGraphic?appid=${appDetails.id}`
            )
            // .get(`http://localhost:8084/api/fetchsizes`)
            .then((response) => {
                setGraphicinventory(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    console.log("graphicinventory", graphicinventory);
    const downloadimage = async () => {
        const objectarray = canvas.getObjects();

        // if (
        //     customizeInfo.selected === "text" ||
        //     customizeInfo.selected === "monogram"
        // ) {
        //     objectarray.forEach((object) => {
        //         object.set("fill", "#000");
        //     });
        //     // canvas.renderAll();
        // } else {
        //     objectarray.forEach((object) => {
        //         object.set("fill", "#000");
        //     });
        // }

        setShowloader(true);
        var dataURLpng = await canvas.toDataURL({
            format: "png",
            quality: 10,
            multiplier: 2,
        });
        // const modifiedSVG = base64ToSVG(
        //     dataURLpng,
        //     canvas.width,
        //     canvas.height
        // );
        // console.log(modifiedSVG);

        // console.log("dataURLpng", dataURLpng);
        // var modifiedSVG = canvas.toSVG();
        // console.log(dataURL);
        // let modifiedSVG;

        // console.log(modifiedSVG);

        // var blob = new Blob([dataURL], {
        //     type: "image/svg+xml;charset=utf-8",
        // });
        // var url = URL.createObjectURL(blob);

        // var link = document.createElement("a");
        // link.download = `canvas.png`;
        // link.href = dataURLpng;
        // link.click();

        // if (customizeInfo.selected === "graphic") {
        //     modifiedSVG = await replaceImageURLWithBase64(dataURL);
        // } else {
        //     modifiedSVG = await dataURL;
        // }

        // modifiedSVG = await dataURL;

        // var blob = new Blob([modifiedSVG], {
        //     type: "image/svg+xml;charset=utf-8",
        // });
        // var url = URL.createObjectURL(blob);

        // var link = document.createElement("a");
        // link.download = `canvas.svg`;
        // link.href = url;
        // link.click();

        // console.log(modifiedSVG);
        setUsagetime({
            ...usagetime,
            end: new Date(),
        });

        const timeDifference =
            usagetime.start.getTime() - usagetime.end.getTime();
        console.log("timeDifference", timeDifference);
        // console.log(
        //     "LLOGGGGGGGGGGGGGGGGG",
        //     JSON.stringify(userDetails),
        //     selectedItem,
        //     // customizeInfo["graphic"].value.toString(),
        //     JSON.stringify(modifiedSVG),
        //     timeDifference
        // );

        axios
            .post(`${process.env.REACT_APP_API_URL}/api/savepng`, {
                userDetails: JSON.stringify(userDetails),
                itemname: JSON.stringify(selectedItem),
                canvasuri: dataURLpng,
                timeDiff: timeDifference,
                appDetails: JSON.stringify(appDetails),
            })
            .then((response) => {
                console.log(response.data);
                setShowloader(false);

                navigate("/thankyou");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const canvasRef = useRef(null);

    const rightWrapperRef = useRef(null);
    const handleMouseWheel = (event) => {
        const delta = event.e.deltaY;
        let zoom = canvas.getZoom();
        zoom = zoom + delta / 1100;
        if (zoom > 20) zoom = 20; // set maximum zoom level
        if (zoom < 0.01) zoom = 0.01; // set minimum zoom level
        canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
        event.e.preventDefault();
        event.e.stopPropagation();
    };

    // creates and saves the canvas element
    useEffect(() => {
        if (canvasRef.current && rightWrapperRef.current) {
            // 2.0219
            setCanvas(
                new fabric.Canvas("demo", {
                    targetFindTolerance: 5,
                    width: 298,
                    height: 600,
                })
            );
        }
    }, []);
    var img = document.createElement("img");
    img.src = deleteIcon;

    function deleteObject(eventData, transform) {
        var target = transform.target;
        var canvas = target.canvas;
        canvas.remove(target);
        canvas.requestRenderAll();
    }

    function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
    // Add delete control
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 16,
        cursorStyle: "pointer",
        // @ts-ignore
        mouseUpHandler: deleteObject,
        render: renderIcon,
        cornerSize: 24,
    });

    const reorderCanvasObjects = (e) => {
        if (bgImage2 && e.target !== bgImage2) {
            canvas.moveTo(bgImage2, canvas.getObjects().length - 1);
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    };

    // useEffect(() => {
    //     if (canvas) {
    //         canvas.clear();
    //         canvas.renderAll();
    //     }
    // }, [canvas]);

    // updates the canvas when the design is finalised
    useEffect(() => {
        if (canvas) {
            const objectarray = canvas.getObjects();

            if (designfinalised) {
                canvas.forEachObject(function (object) {
                    object.selectable = false;
                    object.hasBorders = false;
                    object.hasControls = false;
                });
                // objectarray[1].visible = false;
                canvas.discardActiveObject().renderAll();
            } else {
                for (let i = 0; i < objectarray.length; i++) {
                    objectarray[i].selectable = true;
                    objectarray[i].hasBorders = true;
                    objectarray[i].hasControls = true;
                }

                // objectarray[1].visible = true;
                canvas.setActiveObject(objectarray[0]);
            }
        }
    }, [designfinalised]);
    // generates the canvas at the initial load of the page
    useEffect(() => {
        if (canvas) {
            let imgurl1 = `images/templates/Blank/${selectedItem}.png`;
            let topshift = 0;
            if (appDetails.id === 1) {
                topshift = 0;
            } else {
                topshift = -10;
            }
            fabric.Image.fromURL(imgurl1, (bgimage1) => {
                canvas.setBackgroundImage(
                    bgimage1,
                    canvas.renderAll.bind(canvas),
                    {
                        scaleX: canvas.width / bgimage1.width,
                        scaleY: canvas.height / bgimage1.height,
                    }
                );
                // console.log(appDetails.idname);
                // Load the second image after the first image is set
                let imgurl2 = `images/templates/Borders/${appDetails.idname}/${selectedItem}.png`;
                fabric.Image.fromURL(imgurl2, (bgimage2) => {
                    bgimage2.set({
                        scaleX: canvas.width / bgimage2.width,
                        scaleY: canvas.height / bgimage2.height,
                        selectable: false, // Makes the image non-selectable
                        evented: false, // Disables events on the image
                        top: topshift,
                    });

                    // Add the second image to the canvas
                    canvas.add(bgimage2);
                    // Store bgimage2 in state
                    setBgImage2(bgimage2);
                    // Move the image to the top
                    canvas.moveTo(bgimage2, canvas.getObjects().length - 1);
                    canvas.renderAll();
                    // Move the image to the background (just above the first background image)
                    // canvas.bringToFront(bgimage2);
                });
            });
            // Add event listener to reorder objects when new object is added
            // canvas.on("object:added", (e) => {
            //     if (bgImage2 && e.target !== bgImage2) {
            //         canvas.moveTo(bgImage2, canvas.getObjects().length - 1);
            //     }
            // });
        }
    }, [canvas]);

    // update the canvas with selected artboard and refresh canvas
    useEffect(() => {
        if (canvas) {
            if (objectadding) {
                let imgurl = `images/graphics/${appDetails.idname}/${
                    selGraphic[selGraphic.length - 1]
                }.png`;

                fabric.Image.fromURL(imgurl, (img) => {
                    // Desired default width and height in pixels
                    const defaultWidth = 100;
                    const defaultHeight = 100;
                    // Calculate the scale based on the default size
                    const scale = Math.min(
                        defaultWidth / img.width,
                        defaultHeight / img.height
                    );

                    img.set({
                        selectable: true, // allow object to be selected/dragged
                        evented: true,
                        cornerSize: 10,
                        cornerStyle: "circle",
                        transparentCorners: false,
                        hasRotatingPoint: false,
                        lockUniScaling: true, // Maintain aspect ratio while scaling
                        scaleX: scale,
                        scaleY: scale,
                    });

                    canvas.selection = true;
                    canvas.add(img);
                    canvas.centerObject(img);
                    setCanvasObjects([...canvasObjects, img]);
                });
            }
            // Add event listener to reorder objects when new object is added
            canvas.on("object:added", (e) => {
                if (bgImage2) {
                    reorderCanvasObjects(e);
                }
            });

            canvas.on("object:scaling", function (e) {
                const target = e.target;
                const scale = target.scaleX; // Use scaleX or scaleY, as they are equal

                target.scaleY = scale;
                if (bgImage2) {
                    reorderCanvasObjects(e);
                }
            });

            const paddingTop = 27;
            const paddingBottom = 48;
            const paddingRight = 22;
            const paddingLeft = 22;
            canvas.on("object:moving", function (e) {
                const target = e.target;

                // Constrain movement within canvas boundaries with 10px padding
                if (target.left < paddingLeft) {
                    target.left = paddingLeft;
                }
                if (target.top < paddingTop) {
                    target.top = paddingTop;
                }
                if (
                    target.left + target.width * target.scaleX >
                    canvas.width - paddingRight
                ) {
                    target.left =
                        canvas.width -
                        paddingRight -
                        target.width * target.scaleX;
                }
                if (
                    target.top + target.height * target.scaleY >
                    canvas.height - paddingBottom
                ) {
                    target.top =
                        canvas.height -
                        paddingBottom -
                        target.height * target.scaleY;
                }
                if (bgImage2) {
                    reorderCanvasObjects(e);
                }
            });

            canvas.on("object:modified", function (e) {
                const target = e.target;
                const padding = 10;

                // Ensure object remains within canvas boundaries after modification
                if (target.left < paddingLeft) {
                    target.left = paddingLeft;
                }
                if (target.top < paddingTop) {
                    target.top = paddingTop;
                }
                if (
                    target.left + target.width * target.scaleX >
                    canvas.width - paddingRight
                ) {
                    target.left =
                        canvas.width -
                        paddingRight -
                        target.width * target.scaleX;
                }
                if (
                    target.top + target.height * target.scaleY >
                    canvas.height - paddingBottom
                ) {
                    target.top =
                        canvas.height -
                        paddingBottom -
                        target.height * target.scaleY;
                }
                if (bgImage2) {
                    reorderCanvasObjects(e);
                    console.log("in obejctmodify");
                }
            });
            // Ensure cleanup to prevent multiple event bindings
            return () => {
                canvas.off("object:added", reorderCanvasObjects);
                canvas.off("mouse:up", reorderCanvasObjects);
                canvas.off("object:scaling", reorderCanvasObjects);
                canvas.off("object:moving", reorderCanvasObjects);
                canvas.off("object:modified", reorderCanvasObjects);
            };
        }
    }, [selGraphic]);
    return (
        <>
            {showloader && <LoaderAnimation />}

            <Layout>
                {screennum == 2 ? (
                    <h1 className="customize">Design Your Case</h1>
                ) : (
                    <h1 className="customize">Preview Your Case</h1>
                )}

                <Wrapper>
                    <TopWrapper
                        ref={rightWrapperRef}
                        className={`${
                            screennum === 2
                                ? "screen2"
                                : screennum === 3
                                ? "screen3"
                                : ""
                        }`}
                    >
                        <canvas ref={canvasRef} id="demo" />
                    </TopWrapper>
                </Wrapper>
                {screennum === 2 ? (
                    <Footer>
                        <BottomWrapper>
                            <div className="sliderwrapper page2">
                                <div className="selrow1">
                                    {graphicinventory.map((item, index) => {
                                        console.log(item, index);
                                        if (
                                            index + 1 <=
                                            graphicinventory.length / 2
                                        )
                                            return (
                                                <SelectorBox
                                                    key={index}
                                                    onClick={() =>
                                                        toggleArtSelection(
                                                            item.graphic_img_name
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={`images/graphics/${appDetails.idname}/${item.graphic_img_name}.png`}
                                                        alt=""
                                                    />
                                                </SelectorBox>
                                            );
                                    })}
                                </div>
                                <div className="selrow2">
                                    {graphicinventory.map((item, index) => {
                                        if (
                                            index + 1 >
                                            graphicinventory.length / 2
                                        )
                                            return (
                                                <SelectorBox
                                                    key={index}
                                                    onClick={() =>
                                                        toggleArtSelection(
                                                            item.graphic_img_name
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={`images/graphics/${appDetails.idname}/${item.graphic_img_name}.png`}
                                                        alt=""
                                                    />
                                                </SelectorBox>
                                            );
                                    })}
                                </div>
                            </div>
                        </BottomWrapper>

                        <Link className="nav-link" to="/infochoose">
                            <button className="btnglobal btnleft">{`<`}</button>
                        </Link>

                        <button
                            className="btnglobal btnright"
                            onClick={() => {
                                setScreennum(3);
                                setDesignfinalised(true);
                            }}
                        >
                            {`>`}
                        </button>
                    </Footer>
                ) : (
                    <Footer className="footerfinal">
                        <button
                            className="btnglobal btnleft"
                            onClick={() => {
                                setScreennum(2);
                                setDesignfinalised(false);
                            }}
                        >{`<`}</button>

                        <button
                            className="btnglobal btnright"
                            onClick={() => downloadimage()}
                        >
                            {`>`}
                        </button>
                    </Footer>
                )}
                <img
                    src="images/common/logo_btm.png"
                    className="logo_btm"
                    alt=""
                />
            </Layout>
        </>
    );
};
const Layout = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 100vh;
    max-width: 100vw;
    overflow: hidden;
    padding-top: 66px;
    .customize {
        width: 100vw;

        color: #fff;
        font-size: 40px;
        font-family: Verizon;
        letter-spacing: 3px;
        margin: 0;
        text-align: center;
        font-weight: 100;
        padding: 8px 0;
        // padding-bottom: 0px;
        margin-bottom: 20px;
        filter: drop-shadow(0 3px 6px #000);
    }
`;

const SelectorBox = styled.div`
    // background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px;
    box-sizing: border-box;
    border: 2px solid #ffffff;
    border-radius: 22px;
    cursor: pointer;
    min-height: 40px;
`;
const BottomWrapper = styled.div`
    padding: 0px;
    // width: 400px;
    // max-height: calc(100vh - 184px);
    box-sizing: border-box;

    padding: 15px 0;

    .sliderwrapper {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        overflow: auto;
        .selrow1,
        .selrow2 {
            position: absolute;
            height: 58vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            justify-content: center;
            top: 24.7vh;
            ${SelectorBox} {
                height: 12.5vh;
                width: 12.5vh;
                margin-bottom: 14px;
                margin-right: 14px;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
        }
        .selrow1 {
            right: 64vw;
        }
        .selrow2 {
            left: 64vw;
        }
    }
`;

const TopWrapper = styled.div`
    // background: #fff;
    height: 100%;
    // width: 85vw;
    // height: 700px;
    box-sizing: border-box;
    // margin-bottom: 60px;
    overflow: hidden;
    display: flex;
    align-items: Center;
    justify-content: Center;
    // display: none;

    canvas {
        width: 100%;
        height: 100%;
    }
    &.screen2 {
        margin-top: -20px;
        transform: scale(0.9);
    }
    &.screen1 {
        transform: scale(0.96);
    }
    &.screen3 {
        transform: scale(0.9);
        margin-top: -20px;
        // margin-top: 80px;
    }
`;
const Wrapper = styled.div`
    display: flex;
    // border-top: 1px solid #707070;
    flex-direction: column;
`;
const Footer = styled.div`
    padding-top: 0;
    padding-bottom: 0;
    // margin-bottom: 30px;
    width: 100%;
    // position: absolute;
    bottom: 0;
    box-sizing: border-box;

    .footerflex {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 33px 37px 33px;
        // margin-top:15px;
        &.screen1 {
            margin-top: 15px;
        }
    }
    button {
        cursor: pointer;
        margin: 0;
        display: flex;
        align-items: center;
        img {
            width: 100%;
            height: auto;
        }
    }
    .footerleft {
        display: flex;
        align-items: center;
        // width: 30vw;
    }
    .footercenter {
        .text {
            text-align: center;
            color: #fff;
            font-family: Emberregular;
            font-size: 20px;
            font-weight: 400;
            margin-top: 0px;
        }
    }
    .footerright {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    &.footerfinal {
        // background: Transparent;
        // .footerright {
        //     button {
        //         width: 210px;
        //     }
        // }
    }
`;

export default Customize;
