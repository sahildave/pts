Pts.quickStart( "pt", "#f4f4f4" ); 

(function() {
    var CIRCLE_BASE_RADIUS = 25;
    var BASE_MAGNITUDE = 250;
    var COPIES = 150;

    var COPY_OPACITY_START = 1.0;
    var COPY_OPACITY_END = 0.01;
    var copyOpacityStep = (COPY_OPACITY_END-COPY_OPACITY_START)/COPIES;

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
    // space.background = colorMasterList[Util.randomInt(8)];

    let circleX, circleY, circleCenter, baseCircleSize, circleSize;
    let magnitude, magnitudeMultiplier;

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
            // console.log("Added NEW - "+circleCenter);
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

    function animateBG(space, time) {
        var bg = Color.hsl( 360, 1, 1 );
        var timer = (Num.cycle(time%3000/3000));
        let pointerMagnitude = space.pointer.$divide(space.size);
        let colorHSL = bg.$multiply( Pt.make( 4, 1 ).to(   pointerMagnitude.x, 
                                                    pointerMagnitude.y/2 + pointerMagnitude.x/2, 
                                                    pointerMagnitude.y ));
        var colorRGB = Color.HSLtoRGB( colorHSL ).toString("rgb");
        space.background = colorRGB;
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

    space.add({  
        start:( bound ) => { 
            circleX = space.innerBound[1].x * 0.5;
            // circleX = Num.randomRange(space.innerBound[1].x * 0.33, space.innerBound[1].x * 0.66);
            circleY = space.innerBound[1].y * 0.33;
            // circleY = Num.randomRange(space.innerBound[1].y * 0.25, space.innerBound[1].y * 0.33);
            circleCenter = new Pt({x:circleX, y:circleY});
            baseCircleSize = Num.randomRange(CIRCLE_BASE_RADIUS, CIRCLE_BASE_RADIUS*3);
            magnitude = Num.randomRange(baseCircleSize*2, baseCircleSize*4);
            magnitudeMultiplier = Num.randomRange(magnitude, magnitude*3)/COPIES;
   
        },

        animate: (time, ftime) => {
            animateBG(space, time);
            var refPoint = new Pt({x:circleX, y:space.center.y});
            let refLine = space.pointer.$subtract( refPoint.$add(0.1) );
            let refMag = refLine.magnitude();
            let spaceMag = space.size.magnitude();
            // var newDir = dirSlantUp.clone().to({x: (dirSlantUp.x + refLine.x/(2.5*spaceMag)), y:dirSlantUp.y});
            var newDir = dirSlantUp;

            var timer = (Num.cycle(time%3000/3000) * 0.3);
            circleSize = baseCircleSize + (baseCircleSize * timer);
            // form.fill("#fff").font(24, "bold").text(new Pt({ x: 0, y: 50}), time); 
            // form.fill("#fff").font(24, "bold").text(new Pt({ x: 0, y: 100}), timer); 
            var topCircles = createCircle(KEY_SLANT_TOP, newDir, true,  (magnitudeMultiplier+(refMag*1*magnitudeMultiplier)/spaceMag));
            var centerCircles = createCircle(KEY_HORIZ, dirHoriz, false, (magnitudeMultiplier+(refMag*2*magnitudeMultiplier)/spaceMag));
            var bottomCircles = createCircle(KEY_SLANT_BOTTOM, newDir, false,  (magnitudeMultiplier+(refMag*1*magnitudeMultiplier)/spaceMag));
            
            printCircle(KEY_SLANT_TOP, colorFirst, colorSecond);
            printCircle(KEY_HORIZ, colorSecond, colorThird);
            printCircle(KEY_SLANT_BOTTOM, colorThird, colorFourth);

            // console.log(Circle.toRect(bottomCircles[0]));
            // console.log(Circle.toRect(bottomCircles[2]));

            var uCoordinatesTop = new Pt({x: Circle.toRect(topCircles[2])[0].x,    y: Circle.toRect(topCircles[0])[0].y});
            var uCoordinatesBottom = new Pt({x: Circle.toRect(topCircles[2])[1].x, y: Circle.toRect(topCircles[0])[1].y});
            var cCoordinatesTop = new Pt({x: Circle.toRect(bottomCircles[0])[0].x, y: Circle.toRect(bottomCircles[2])[0].y});
            var cCoordinatesBottom = new Pt({x: Circle.toRect(bottomCircles[0])[1].x, y: Circle.toRect(bottomCircles[2])[1].y});
            // console.log(cCoordinatesTop);
            // console.log(cCoordinatesBottom);

            var uRect = Group.fromPtArray([uCoordinatesTop.$multiply(timer), uCoordinatesBottom.$multiply(timer)]);
            var uFontSize = Typography.fontSizeToBox( uRect, 0.75 )(uRect);
            console.log(uRect);
            // var uFont = new Font(50);
            console.log("U Font - "+baseCircleSize+", "+uFontSize);
            form.font(uFontSize).fill(colorFirst).alignText("left").textBox( uRect, "U", "top", "..." );

            var cRect = Group.fromPtArray([cCoordinatesTop, cCoordinatesBottom]);
            var cFontSize = Typography.fontSizeToBox( cRect, 0.75 )(cRect);
            // var cFont = new Font(350);
            // console.log("C Font - "+cFont);
            form.font(cFontSize).fill(colorFourth).alignText("right").textBox( cRect, "C", "bottom", "..." );

            // form.point(uCoordinatesTop);
            // form.point(uCoordinatesBottom);
            // form.point(cCoordinatesTop);
            // form.point(cCoordinatesBottom);
        }
    });
    space.bindMouse().bindTouch().play();
    // space.bindMouse().bindTouch().playOnce(200);

    
})();