Pts.quickStart( "pt", "#f4f4f4" ); 

(function() {
    var CIRCLE_BASE_RADIUS = 25;
    var BASE_MAGNITUDE = 250;
    var COPIES = 30;

    var COPY_OPACITY_START = 1.0;
    var COPY_OPACITY_END = 0.01;

    var KEY_HORIZ = "circles_horiz";
    var KEY_SLANT_TOP = "circles_slant_top";
    var KEY_SLANT_BOTTOM = "circles_slant_bottom";

    let dirSlantDown = new Pt({x:Num.randomRange(-1, -0.5), y:Num.randomRange(0.5, 1)});
    let dirSlantUp = new Pt({x:Num.randomRange(-1, -0.2), y:Num.randomRange(0.2, 1)});
    let dirHoriz = new Pt({x:Num.randomRange(0.85, 1), y:0});


    // let dirSlantDown = new Pt({x:-0.75, y:0.75});
    // let dirSlantUp = new Pt({x:-0.75, y:0.75});
    // let dirHoriz = new Pt({x:0.75, y:0});

    var circleSize = Num.randomRange(CIRCLE_BASE_RADIUS, CIRCLE_BASE_RADIUS*3);
    var copyOpacityStep = (COPY_OPACITY_END-COPY_OPACITY_START)/COPIES;
    var magnitude = Num.randomRange(circleSize*2, circleSize*4);

    var circleMap = [];
    var lastSavedCircle = [];
    var createCircle = (key, dir, startNew, variableMagnitude) => {
        console.log("-----\nSTARTING NEW - "+startNew+", FOR - "+key);
        var circlesList = new Group();
        
        let circleX = Util.randomInt(space.innerBound[1].x * 0.66, space.innerBound[1].x * 0.25);
        let circleY = Util.randomInt(0, space.innerBound[1].y * 0.25);
        let circleCenter = new Pt({x:circleX, y:circleY});
        
        var circle = Circle.fromCenter(circleCenter, circleSize);
        if(startNew){
            console.log("Added NEW - "+circle);
        } else {
            circle = lastSavedCircle.clone();
            circleCenter = circle[0];
            console.log("Added OLD - "+lastSavedCircle);
        }
        // circlesList.push(circle);
        // console.log("PUSHED FIRST - "+circlesList)

        var multiplier = magnitude/COPIES;
        if (variableMagnitude) {
            multiplier = Num.randomRange(magnitude, magnitude*3)/COPIES;
        }
        
        var lastCenter = circleCenter;
        for(let i=0; i<COPIES; i++){
            circleCenter.add(dir.$multiply(multiplier))
            var newCircle = Circle.fromCenter(circleCenter, circleSize);
            circlesList.push(newCircle);
            console.log("Created - "+i+" - "+newCircle+"\nTO - "+circlesList);
            lastSavedCircle = newCircle.clone();
        }
        console.log("LAST SAVED - "+lastSavedCircle);
        circleMap[key] = circlesList;
        console.log("Saved - "+circleMap[key])
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
    // My function to interpolate between two colors completely, returning an array
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

        for(let i=0; i<COPIES; i++){
            console.log("Printing - "+i+" - "+circleList[i]);
            form.fillOnly(Color.from(colorList[i]).toString("rgba")).circle(circleList[i]);
        }
    };


    space.add({          
        start:( bound ) => { 
            createCircle(KEY_SLANT_TOP, dirSlantUp, true, true);
            createCircle(KEY_HORIZ, dirHoriz, false, true);
            createCircle(KEY_SLANT_BOTTOM, dirSlantUp, false, true);
            console.log("-------------------")
            console.log(circleMap)
        },

        animate: (time, ftime) => {
            console.log("-------------------")
            printCircle(KEY_SLANT_TOP, "rgb(255, 0, 0)", "rgb(0, 0, 255)");
            printCircle(KEY_HORIZ, "rgb(0, 0, 255)", "rgb(0, 255, 0)");
            printCircle(KEY_SLANT_BOTTOM, "rgb(0, 255, 0)", "rgb(0, 255, 255)");
        }
    });
    space.bindMouse().bindTouch().playOnce(200);
    
})();