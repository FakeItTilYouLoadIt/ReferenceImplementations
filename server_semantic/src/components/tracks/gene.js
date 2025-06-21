
/*
Should hold some basic information about the drawn box. Currently passing in more information than necessary
*/
export class gene {
    constructor(geneInfo, color, trackType) {
        this.start = geneInfo.start;
        this.end = geneInfo.end;
        this.chromosome = geneInfo.chromosome;
        this.key = geneInfo.key;
        this.value = geneInfo.value;
        this.color = color;
        this.hover = false;
        this.siblings = geneInfo.siblings;
        this.lightness = geneInfo.lightness;
        this.trackType = trackType;
        //! Adjusting the color just to find orthologs as a proof of concept
        if (this.siblings !== undefined && this.siblings.length > 0) {
            this.color = "#ff0000"
        }
    }

    draw(context, coordinateX, coordinateY, width, height) {
        this.coordinateX = coordinateX
        this.coordinateY = coordinateY
        this.width = width
        this.height = height
        context.fillStyle = this.color
        context.beginPath()
        if (this.trackType === 'scatter') {
            let radius = width / 15,
                // shift the start of the point draw so the point is drawn in the center of the allocated width for each rectangle
                xShift = this.coordinateX + (width / 2) - radius;
            drawPoint(context, xShift, this.coordinateY, width);
        }
        else {
            context.rect(coordinateX, coordinateY, width, height)
        }
        context.fill()
    }

    highlight(context, coordinateX, coordinateY, width, height) {
        this.coordinateX = coordinateX
        this.coordinateY = coordinateY
        this.width = width
        this.height = height
        context.fillStyle = "#800000"
        context.beginPath()
        if (this.trackType === 'scatter') {
            let radius = width / 10,
                // shift the start of the point draw so the point is drawn in the center of the allocated width for each rectangle
                xShift = this.coordinateX + (width / 2) - radius;
            drawPoint(context, xShift, this.coordinateY, width);
        }
        else {
            context.rect(coordinateX, coordinateY, width, height)
        }
        context.fill()
    }

    hovering(mouseX) {
        return (mouseX >= this.coordinateX && mouseX <= this.coordinateX + this.width)
    }

}

function drawPoint(context, cx, cy, r) {
    // NOTE; each point needs to be drawn as its own path
    // as every point needs its own stroke. you can get an insane
    // speed up if the path is closed after all the points have been drawn
    // and don't mind points not having a stroke
    context.beginPath();
    context.arc(cx, cy, 3, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.stroke();
}
