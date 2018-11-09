Pts.quickStart( "pt", "#f4f4f4" ); 

(function() {
    var CIRCLE_BASE_RADIUS = 25;
    var BASE_MAGNITUDE = 250;
    var COPIES = 150;

    var COPY_OPACITY_START = 1.0;
    var COPY_OPACITY_END = 0.01;

    var KEY_HORIZ = "circles_horiz";
    var KEY_SLANT_TOP = "circles_slant_top";
    var KEY_SLANT_BOTTOM = "circles_slant_bottom";

    // let dirSlantDown = new Pt({x:Num.randomRange(-1, -0.5), y:Num.randomRange(0.5, 1)});
    // let dirSlantUp = new Pt({x:Num.randomRange(-1, -0.2), y:Num.randomRange(0.2, 1)});
    // let dirHoriz = new Pt({x:Num.randomRange(0.85, 1), y:0});

    let dirSlantDown = new Pt({x:-0.75, y:0.75});
    let dirSlantUp = new Pt({x:-0.75, y:0.75});
    let dirHoriz = new Pt({x:0.75, y:0});

    let colorMasterList = [ "rgb(255, 0, 0)", "rgb(0, 0, 255)","rgb(0, 255, 0)",
                            "rgb(255, 255, 0)", "rgb(0, 255, 255)","rgb(255, 0, 255)",
                            "rgb(255, 255, 255)", "rgb(0, 0, 0)"]

    var colorFirst = colorMasterList[Util.randomInt(8)];
    var colorSecond = colorMasterList[Util.randomInt(8)];
    var colorThird = colorMasterList[Util.randomInt(8)];
    var colorFourth = colorMasterList[Util.randomInt(8)];
    space.background = colorMasterList[Util.randomInt(8)];

    let circleX, circleY, circleCenter;
    var circleSize = Num.randomRange(CIRCLE_BASE_RADIUS, CIRCLE_BASE_RADIUS*3);
    var copyOpacityStep = (COPY_OPACITY_END-COPY_OPACITY_START)/COPIES;

    var magnitude = Num.randomRange(circleSize*2, circleSize*4);
    var magnitudeMultiplier =  magnitude/COPIES;

    var circleMap = [];
    var lastSavedCircle = [];
    var createCircle = (key, dir, startNew, magnitudeMultiplier) => {
        // console.log("-----\nSTARTING NEW - "+startNew+", FOR - "+key);
        var circlesList = new Group();
        var returnList = new Group();
        // if(fromMouse) circleCenter = space.pointer;
        
        var circle = Circle.fromCenter(circleCenter, circleSize);
        var lastCenter = circleCenter.clone();
        if(startNew){
            lastSavedCircle = [];
            console.log("Added NEW - "+circleCenter);
        } else {
            circle = lastSavedCircle.clone();
            lastCenter = circle[0];
            // console.log("Added OLD - "+lastSavedCircle);
        }
        // circlesList.push(circle);
        // console.log("PUSHED FIRST - "+circlesList)

        for(let i=0; i<COPIES; i++){
            lastCenter.add(dir.$multiply(magnitudeMultiplier))
            var newCircle = Circle.fromCenter(lastCenter, circleSize);
            circlesList.push(newCircle);
            // console.log("Created - "+i+" - "+newCircle);
            lastSavedCircle = newCircle.clone();
        }
        // console.log("LAST SAVED - "+lastSavedCircle);
        circleMap[key] = circlesList;
        // console.log("Saved - "+circleMap[key])
        returnList.push(circlesList[0]);
        returnList.push(circlesList[Math.floor((COPIES-1)/2)]);
        returnList.push(circlesList[COPIES-1]);
        return returnList;
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
        // console.log("-----\nPRINTING NEW - "+key);
        var circleList = circleMap[key];
        
        var colorList = interpolateColors(startColor, endColor, COPIES);

        for(let i=0; i<COPIES; i++){
            // console.log("Printing - "+i+" - "+circleList[i]);
            form.fillOnly(Color.from(colorList[i]).toString("rgba")).circle(circleList[i]);
        }
    };

    var centerCircles = [];
    space.add({  
        start:( bound ) => { 
            circleX = Num.randomRange(space.innerBound[1].x * 0.33, space.innerBound[1].x * 0.66);
            circleY = Num.randomRange(space.innerBound[1].y * 0.25, space.innerBound[1].y * 0.33);
            circleCenter = new Pt({x:circleX, y:circleY});
            console.log(circleCenter)
            // magnitudeMultiplier = magnitude/COPIES;
            magnitudeMultiplier = Num.randomRange(magnitude, magnitude*3)/COPIES;
        },

        animate: (time, ftime) => {

            let ln = space.pointer.$subtract( space.center.$add(0.1) );
            // let dir = ln.$unit();
            let mag = ln.magnitude();
            let mag2 = space.size.magnitude();
            
            
            createCircle(KEY_SLANT_TOP, dirSlantUp, true,  (magnitudeMultiplier+(mag*2*magnitudeMultiplier)/mag2));
            centerCircles = createCircle(KEY_HORIZ, dirHoriz, false, (magnitudeMultiplier+(mag*10*magnitudeMultiplier)/mag2));
            createCircle(KEY_SLANT_BOTTOM, dirSlantUp, false,  (magnitudeMultiplier+(mag*2*magnitudeMultiplier)/mag2));
            
            var centerPoint = centerCircles[1][0];

            // let mag = ln.magnitude();
            // let mag2 = space.size.magnitude();

            // // create a grid of lines
            // let lines = Create.gridPts( space.innerBound, 20, 10 ).map( (p) => {
            // let dist = p.$subtract( centerPoint ).magnitude() / mag2;
            //     return new Group(p, p.$add( dir.$multiply( dist*(20 + mag/5) ) )) 
            // });

            // form.strokeOnly("#fe3").line( [centerPoint, space.pointer] );
            // form.strokeOnly("#000").lines( lines );

            printCircle(KEY_SLANT_TOP, colorFirst, colorSecond);
            printCircle(KEY_HORIZ, colorSecond, colorThird);
            printCircle(KEY_SLANT_BOTTOM, colorThird, space.background);

        }
    });
    space.bindMouse().bindTouch().play();
    // space.bindMouse().bindTouch().playOnce(200);

    
})();