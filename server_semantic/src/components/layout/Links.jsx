import { interpolateNumber } from 'd3';
import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';


function createLinkPolygonPath(d, curvature) {

    d = d.item;
    // code block sourced from d3-sankey https://github.com/d3/d3-sankey for drawing curved blocks
    var x = d.source.x,
        x1 = d.target.x,
        y = d.source.y,
        y1 = d.target.y,
        yi = interpolateNumber(y, y1),
        y2 = yi(curvature),
        y3 = yi(1 - curvature),
        p0 = d.target.x1,
        p1 = d.source.x1,
        qi = interpolateNumber(y1, y),
        q2 = qi(curvature),
        q3 = qi(1 - curvature);

    return "M" + x + "," + y + // svg start point
        "C" + x + "," + y2 + // 1st curve point 1
        " " + x1 + "," + y3 + // 1st curve point 2
        " " + x1 + "," + y1 + // 1st curve end point
        "L" + p0 + "," + y1 + // bottom line
        "C" + p0 + "," + q2 + // 2nd curve point 1
        " " + p1 + "," + q3 + // 2nd curve point 2
        " " + p1 + "," + y // end point and move back to start
}
function createLinkLinePath(d, curvature) {
    // code block sourced from d3-sankey https://github.com/d3/d3-sankey for drawing curved blocks


    d = d.item;
    var x0 = d.source.x,
        x1 = d.target.x,
        y0 = d.source.y,
        y1 = d.target.y,
        yi = interpolateNumber(y0, y1),
        y2 = yi(curvature),
        y3 = yi(1 - curvature);

    return "M" + x0 + "," + y0 + // svg start point
        "C" + x0 + "," + y2 + // curve point 1
        " " + x1 + "," + y3 + // curve point 2
        " " + x1 + "," + y1; // end point
}


function draw(arrayCoordinates, ctx,curvature){
    let totalLines = arrayCoordinates.length;
    const Turbocolors = ["#23171b", "#271a28", "#2b1c33", "#2f1e3f", "#32204a", "#362354", "#39255f", "#3b2768", "#3e2a72", "#402c7b", "#422f83", "#44318b", "#453493", "#46369b", "#4839a2", "#493ca8", "#493eaf", "#4a41b5", "#4a44bb", "#4b46c0", "#4b49c5", "#4b4cca", "#4b4ecf", "#4b51d3", "#4a54d7", "#4a56db", "#4959de", "#495ce2", "#485fe5", "#4761e7", "#4664ea", "#4567ec", "#446aee", "#446df0", "#426ff2", "#4172f3", "#4075f5", "#3f78f6", "#3e7af7", "#3d7df7", "#3c80f8", "#3a83f9", "#3985f9", "#3888f9", "#378bf9", "#368df9", "#3590f8", "#3393f8", "#3295f7", "#3198f7", "#309bf6", "#2f9df5", "#2ea0f4", "#2da2f3", "#2ca5f1", "#2ba7f0", "#2aaaef", "#2aaced", "#29afec", "#28b1ea", "#28b4e8", "#27b6e6", "#27b8e5", "#26bbe3", "#26bde1", "#26bfdf", "#25c1dc", "#25c3da", "#25c6d8", "#25c8d6", "#25cad3", "#25ccd1", "#25cecf", "#26d0cc", "#26d2ca", "#26d4c8", "#27d6c5", "#27d8c3", "#28d9c0", "#29dbbe", "#29ddbb", "#2adfb8", "#2be0b6", "#2ce2b3", "#2de3b1", "#2ee5ae", "#30e6ac", "#31e8a9", "#32e9a6", "#34eba4", "#35eca1", "#37ed9f", "#39ef9c", "#3af09a", "#3cf197", "#3ef295", "#40f392", "#42f490", "#44f58d", "#46f68b", "#48f788", "#4af786", "#4df884", "#4ff981", "#51fa7f", "#54fa7d", "#56fb7a", "#59fb78", "#5cfc76", "#5efc74", "#61fd71", "#64fd6f", "#66fd6d", "#69fd6b", "#6cfd69", "#6ffe67", "#72fe65", "#75fe63", "#78fe61", "#7bfe5f", "#7efd5d", "#81fd5c", "#84fd5a", "#87fd58", "#8afc56", "#8dfc55", "#90fb53", "#93fb51", "#96fa50", "#99fa4e", "#9cf94d", "#9ff84b", "#a2f84a", "#a6f748", "#a9f647", "#acf546", "#aff444", "#b2f343", "#b5f242", "#b8f141", "#bbf03f", "#beef3e", "#c1ed3d", "#c3ec3c", "#c6eb3b", "#c9e93a", "#cce839", "#cfe738", "#d1e537", "#d4e336", "#d7e235", "#d9e034", "#dcdf33", "#dedd32", "#e0db32", "#e3d931", "#e5d730", "#e7d52f", "#e9d42f", "#ecd22e", "#eed02d", "#f0ce2c", "#f1cb2c", "#f3c92b", "#f5c72b", "#f7c52a", "#f8c329", "#fac029", "#fbbe28", "#fdbc28", "#feb927", "#ffb727", "#ffb526", "#ffb226", "#ffb025", "#ffad25", "#ffab24", "#ffa824", "#ffa623", "#ffa323", "#ffa022", "#ff9e22", "#ff9b21", "#ff9921", "#ff9621", "#ff9320", "#ff9020", "#ff8e1f", "#ff8b1f", "#ff881e", "#ff851e", "#ff831d", "#ff801d", "#ff7d1d", "#ff7a1c", "#ff781c", "#ff751b", "#ff721b", "#ff6f1a", "#fd6c1a", "#fc6a19", "#fa6719", "#f96418", "#f76118", "#f65f18", "#f45c17", "#f25916", "#f05716", "#ee5415", "#ec5115", "#ea4f14", "#e84c14", "#e64913", "#e44713", "#e24412", "#df4212", "#dd3f11", "#da3d10", "#d83a10", "#d5380f", "#d3360f", "#d0330e", "#ce310d", "#cb2f0d", "#c92d0c", "#c62a0b", "#c3280b", "#c1260a", "#be2409", "#bb2309", "#b92108", "#b61f07", "#b41d07", "#b11b06", "#af1a05", "#ac1805", "#aa1704", "#a81604", "#a51403", "#a31302", "#a11202", "#9f1101", "#9d1000", "#9b0f00", "#9a0e00", "#980e00", "#960d00", "#950c00", "#940c00", "#930c00", "#920c00", "#910b00", "#910c00", "#900c00", "#900c00", "#900c00"]

    arrayCoordinates.map((item, index) => {
        var p = new Path2D(createLinkLinePath({ item }, curvature));

        if (item.type === "line") {
            var color = item.color;
            if (color) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.fillStyle = '#000'

                ctx.stroke(p)

            }
            else {
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.fillStyle = '#000'

                ctx.stroke(p)
            }


        } else if (item.type === "polygon") {
            var p = new Path2D(createLinkPolygonPath({ item }, curvature));

            var color = item.color;
            if (color) {

                ctx.strokeStyle = 'none';
                ctx.fillStyle = color;

                ctx.fill(p)
            } else {

                ctx.strokeStyle = 'none';
                ctx.fillStyle = Turbocolors[Math.round((index + 1) * Turbocolors.length / (totalLines + 1))]

                ctx.fill(p)

            }

        }

    })
}
const Links = ({ arrayCoordinates, curvature = 0.5, type = "canvas", width=900, gradient, locate }) => {
    const canvasRef = useRef()
    const svgRef = useRef()
    const svgGRef = useRef()
    let height = document.querySelector('.draggable')?.getBoundingClientRect()?.height

    let pathList = [];
    

    const Turbocolors = ["#23171b", "#271a28", "#2b1c33", "#2f1e3f", "#32204a", "#362354", "#39255f", "#3b2768", "#3e2a72", "#402c7b", "#422f83", "#44318b", "#453493", "#46369b", "#4839a2", "#493ca8", "#493eaf", "#4a41b5", "#4a44bb", "#4b46c0", "#4b49c5", "#4b4cca", "#4b4ecf", "#4b51d3", "#4a54d7", "#4a56db", "#4959de", "#495ce2", "#485fe5", "#4761e7", "#4664ea", "#4567ec", "#446aee", "#446df0", "#426ff2", "#4172f3", "#4075f5", "#3f78f6", "#3e7af7", "#3d7df7", "#3c80f8", "#3a83f9", "#3985f9", "#3888f9", "#378bf9", "#368df9", "#3590f8", "#3393f8", "#3295f7", "#3198f7", "#309bf6", "#2f9df5", "#2ea0f4", "#2da2f3", "#2ca5f1", "#2ba7f0", "#2aaaef", "#2aaced", "#29afec", "#28b1ea", "#28b4e8", "#27b6e6", "#27b8e5", "#26bbe3", "#26bde1", "#26bfdf", "#25c1dc", "#25c3da", "#25c6d8", "#25c8d6", "#25cad3", "#25ccd1", "#25cecf", "#26d0cc", "#26d2ca", "#26d4c8", "#27d6c5", "#27d8c3", "#28d9c0", "#29dbbe", "#29ddbb", "#2adfb8", "#2be0b6", "#2ce2b3", "#2de3b1", "#2ee5ae", "#30e6ac", "#31e8a9", "#32e9a6", "#34eba4", "#35eca1", "#37ed9f", "#39ef9c", "#3af09a", "#3cf197", "#3ef295", "#40f392", "#42f490", "#44f58d", "#46f68b", "#48f788", "#4af786", "#4df884", "#4ff981", "#51fa7f", "#54fa7d", "#56fb7a", "#59fb78", "#5cfc76", "#5efc74", "#61fd71", "#64fd6f", "#66fd6d", "#69fd6b", "#6cfd69", "#6ffe67", "#72fe65", "#75fe63", "#78fe61", "#7bfe5f", "#7efd5d", "#81fd5c", "#84fd5a", "#87fd58", "#8afc56", "#8dfc55", "#90fb53", "#93fb51", "#96fa50", "#99fa4e", "#9cf94d", "#9ff84b", "#a2f84a", "#a6f748", "#a9f647", "#acf546", "#aff444", "#b2f343", "#b5f242", "#b8f141", "#bbf03f", "#beef3e", "#c1ed3d", "#c3ec3c", "#c6eb3b", "#c9e93a", "#cce839", "#cfe738", "#d1e537", "#d4e336", "#d7e235", "#d9e034", "#dcdf33", "#dedd32", "#e0db32", "#e3d931", "#e5d730", "#e7d52f", "#e9d42f", "#ecd22e", "#eed02d", "#f0ce2c", "#f1cb2c", "#f3c92b", "#f5c72b", "#f7c52a", "#f8c329", "#fac029", "#fbbe28", "#fdbc28", "#feb927", "#ffb727", "#ffb526", "#ffb226", "#ffb025", "#ffad25", "#ffab24", "#ffa824", "#ffa623", "#ffa323", "#ffa022", "#ff9e22", "#ff9b21", "#ff9921", "#ff9621", "#ff9320", "#ff9020", "#ff8e1f", "#ff8b1f", "#ff881e", "#ff851e", "#ff831d", "#ff801d", "#ff7d1d", "#ff7a1c", "#ff781c", "#ff751b", "#ff721b", "#ff6f1a", "#fd6c1a", "#fc6a19", "#fa6719", "#f96418", "#f76118", "#f65f18", "#f45c17", "#f25916", "#f05716", "#ee5415", "#ec5115", "#ea4f14", "#e84c14", "#e64913", "#e44713", "#e24412", "#df4212", "#dd3f11", "#da3d10", "#d83a10", "#d5380f", "#d3360f", "#d0330e", "#ce310d", "#cb2f0d", "#c92d0c", "#c62a0b", "#c3280b", "#c1260a", "#be2409", "#bb2309", "#b92108", "#b61f07", "#b41d07", "#b11b06", "#af1a05", "#ac1805", "#aa1704", "#a81604", "#a51403", "#a31302", "#a11202", "#9f1101", "#9d1000", "#9b0f00", "#9a0e00", "#980e00", "#960d00", "#950c00", "#940c00", "#930c00", "#920c00", "#910b00", "#910c00", "#900c00", "#900c00", "#900c00"]



    // console.log(arrayCoordinates)

    useEffect(() => {

        if (type.toLowerCase() === "canvas") {

            var ctx = canvasRef.current.getContext('2d')

            draw(arrayCoordinates, ctx, curvature);

            // var zoomBehavior = d3.zoom().scaleExtent([1, 1000]).on("zoom", handleZoom);

            // d3.select(canvasRef.current).call(d3.zoom()

            // .on("zoom", (handleZoom)));

        // function handleZoom(e) {

        //     var transform = e.transform;

        //     ctx.save();
        //     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        //     ctx.translate(transform.x,0)

        //     // console.log(transform.k)
        //     ctx.scale(transform.k,1)
        //     draw(arrayCoordinates, ctx, curvature);
        //     ctx.restore();

        // }

        } else if (type.toLowerCase() === "svg") {


            // function handleZoom(e) {
            //     var transform = e.transform;
            //     var transformString = 'translate(' + transform.x + ',' + '0) scale(' + transform.k + ',1)';
            //     d3.select(svgGRef.current).attr("transform", transformString);
            // };
            // var zoomBehavior = d3.zoom().scaleExtent([1, 1000]).on("zoom", handleZoom);

            // d3.select(svgRef.current)
            //     .call(zoomBehavior);


        }

    }, [])



    if (type.toLowerCase() === "svg") {

        let totalLines = arrayCoordinates.length

        pathList = arrayCoordinates.map((item, index) => {
            if (item.type === "line") {
                var color = item.color;
                if (color) { return <path d={createLinkLinePath({ item }, curvature)} key={index} fill="none" stroke={color} strokeWidth="1px" opacity="0.5"></path> }
                else {
                    return <path d={createLinkLinePath({ item }, curvature)} key={index} fill="none" stroke="black" strokeWidth="1px" opacity="0.5"></path>
                }
            } else if (item.type === "polygon") {
                var color = item.color;

                if (color) {
                    return <path d={createLinkPolygonPath({ item }, curvature)} key={index} fill={'url(#link-gradient)'} id={item.above+"-" + item.below}></path>
                } else {
                    return <path d={createLinkPolygonPath({ item }, curvature)} key={index} fill={Turbocolors[Math.round((index + 1) * Turbocolors.length / (totalLines + 1))]} ></path>
                }

            }
        })



        return (<svg ref={svgRef} width={width} height={height} className="LinksSVG" >
            {/* <rect x="0" y="0" width="950" height="100" style={{ fill: "none", stroke: "pink", strokeWidth: 5, fillOpacity: 0.1, strokeOpacity: 0.9 }} /> */}
            <g className="LinksSVGg" ref={svgGRef} onClick={locate}>
            <linearGradient id={'link-gradient'} x1={0} x2={0} y1={0} y2={1}>
            <stop offset=".25" stopColor={gradient[1]}></stop>
            <stop offset=".75" stopColor={gradient[0]}></stop>
            </linearGradient>
                {pathList}
            </g>

        </svg>)
    }
    else if (type === "canvas") {

        return (<canvas ref={canvasRef} width={width} height={height} />)
    }


}
export default Links;

