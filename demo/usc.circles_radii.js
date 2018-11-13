Pts.quickStart( "pt", "#f4f4f4" ); 

(function() {
    var CIRCLE_SIZE = 50;
    var COPIES = 40;
    var MAGNITUDE = 250;

    var COPY_OPACITY_START = 1.0;
    var COPY_OPACITY_END = 0.01;

    var KEY_HORIZ = "circles_horiz";
    var KEY_SLANT_TOP = "circles_slant_top";
    var KEY_SLANT_BOTTOM = "circles_slant_bottom";

    // let dirSlantDown = new Pt({x:Num.randomRange(-1, -0.5), y:Num.randomRange(0.5, 1)});
    // let dirSlantUp = new Pt({x:Num.randomRange(-1, -0.5), y:Num.randomRange(0.5, 1)});
    // let dirHoriz = new Pt({x:Num.randomRange(0.85, 1), y:0});

    let dirSlantDown = new Pt({x:-0.75, y:0.75});
    let dirSlantUp = new Pt({x:-0.75, y:0.75});
    let dirHoriz = new Pt({x:0.75, y:0});

    var copyOpacityStep = (COPY_OPACITY_END-COPY_OPACITY_START)/COPIES;

    var circleMap = [];
    var lastSavedCircle = [];
    var createCircle = (key, dir, startNew, variableMagnitude, variableSize, sizeFactor) => {
        console.log("-----\nSTARTING NEW - "+startNew+", Variable Size - "+variableSize);
        var circlesList = [];
        
        let circleX = Util.randomInt(space.innerBound[1].x * 0.66, space.innerBound[1].x * 0.25);
        let circleY = Util.randomInt(0, space.innerBound[1].y * 0.25);
        let circleCenter = new Pt({x:circleX, y:circleY});
        
        let circle = [];

        let radius = CIRCLE_SIZE;
        if (!startNew){
            radius = lastSavedCircle[1].x;
        }

        let radiusStep = 0;
        if(variableSize){
            // var direction = Util.randomInt(3, -1);
            // direction = 1;
            radiusStep = sizeFactor*radius/COPIES;
            console.log("Radii - "+radius+", "+radiusStep+", "+sizeFactor)
        }

        if(!startNew){
            circle = lastSavedCircle;
            circleCenter = circle[0];
            console.log("Using Old - "+lastSavedCircle);
        } else {
            circle = Circle.fromCenter(circleCenter, radius);
            circlesList.push(circle);
        }

        // circlesList.push(circle);

        var multiplier = MAGNITUDE/COPIES;
        if (variableMagnitude) {
            multiplier = Num.randomRange(MAGNITUDE, MAGNITUDE*3)/COPIES;
        }

        for(let i=0; i<COPIES; i++){
            var lastCenter = circleCenter;
            lastCenter.add(dir.$multiply(multiplier))
            var newRadius = (radius + radiusStep*i);
            console.log("Creating - "+lastCenter+", Radius - "+newRadius);
            var newCircle = Circle.fromCenter(lastCenter, newRadius);
            circlesList.push(newCircle);
            lastSavedCircle = newCircle;
        }
        console.log("LAST SAVED - "+lastSavedCircle);
        circleMap[key] = circlesList;
        // console.log("Saved - "+circleMap[key])
        return circlesList;
    };
 
    // Returns a single rgb color interpolation between given rgb color
    // based on the factor given; via https://codepen.io/njmcode/pen/axoyD?editors=0010
    function interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) {
            factor = 0.5;
        }
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    };
    
    function interpolateColors(color1, color2, steps) {
        var stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];
        color1 = color1.match(/\d+/g).map(Number);
        color2 = color2.match(/\d+/g).map(Number);
        for (var i = 0; i < steps; i++) {
            interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
        }
        return interpolatedColorArray;
    }

    var printCircle = (key, startColor, endColor) => {
        console.log("-----\nPRINTING NEW - "+key);
        var circleList = circleMap[key];
        
        var colorList = interpolateColors(startColor, endColor, COPIES);

        var alpha = 1;
        for(let i=0; i<COPIES; i++){
            alpha = COPY_OPACITY_START + (i-1)*copyOpacityStep;
            // console.log("Making - "+i+" - "+circleList[i]+" with Alpha - "+alpha+", and Color - "+colorList[i]);
            form.fillOnly(Color.from(colorList[i]).toString("rgba")).circle(circleList[i]);
        }
    };


    space.add({          
        start:( bound ) => { 
            createCircle(KEY_SLANT_TOP, dirSlantUp, true, true, true, 1);
            createCircle(KEY_HORIZ, dirHoriz, false, true, true, -0.5);
            createCircle(KEY_SLANT_BOTTOM, dirSlantDown, false, true, true, 1);
        },

        animate: (time, ftime) => {
            printCircle(KEY_SLANT_TOP, "rgb(255, 0, 0)", "rgb(0, 0, 255)");
            printCircle(KEY_HORIZ, "rgb(0, 0, 255)", "rgb(0, 255, 0)");
            printCircle(KEY_SLANT_BOTTOM, "rgb(0, 255, 0)", "rgb(0, 255, 255)");
        }
    });
    space.bindMouse().bindTouch().playOnce(200);
    
})();