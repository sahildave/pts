Pts.quickStart( "pt", "#000" ); 

(function() {
    var CIRCLE_SIZE = 50;
    var COPIES = 15;
    var MAGNITUDE = 250;

    var COPY_OPACITY_START = 1.0;
    var COPY_OPACITY_END = 0.05;

    var KEY_HORIZ = "circles_horiz";
    var KEY_SLANT_TOP = "circles_slant_top";
    var KEY_SLANT_BOTTOM = "circles_slant_bottom";

    let dirSlantDown = new Pt({x:Num.randomRange(-1, -0.5), y:Num.randomRange(0.5, 1)});
    let dirSlantUp = new Pt({x:Num.randomRange(-1, -0.5), y:Num.randomRange(0.5, 1)});
    let dirHoriz = new Pt({x:Num.randomRange(0.85, 1), y:0});

    var copyOpacityStep = (COPY_OPACITY_END-COPY_OPACITY_START)/COPIES;

    var circleMap = [];
    var lastSavedCircle = [];
    var createCircle = (key, dir, startNew, variableMagnitude) => {
        console.log("-----\nSTARTING NEW - "+startNew);
        var circlesList = [];
        
        let circleX = Util.randomInt(space.innerBound[1].x * 0.66, space.innerBound[1].x * 0.25);
        let circleY = Util.randomInt(0, space.innerBound[1].y * 0.25);
        let circleCenter = new Pt({x:circleX, y:circleY});
        
        let circle = [];
        if(startNew){
            circle = Circle.fromCenter(circleCenter, CIRCLE_SIZE);
            circlesList.push(circle);
        } else {
            circle = lastSavedCircle;
            circleCenter = circle[0];
            console.log("Else - "+lastSavedCircle+", Center - "+circleCenter);
        }

        var multiplier = MAGNITUDE/COPIES;
        if (variableMagnitude) {
            multiplier = Num.randomRange(MAGNITUDE, MAGNITUDE*2)/COPIES;
        }

        for(let i=0; i<COPIES; i++){
            var lastCenter = circleCenter;
            lastCenter.add(dir.$multiply(multiplier))
            var newCircle = Circle.fromCenter(lastCenter, CIRCLE_SIZE);
            circlesList.push(newCircle);
            lastSavedCircle = newCircle;
        }
        console.log("LAST SAVED - "+lastSavedCircle);
        circleMap[key] = circlesList;
        console.log("Saved - "+circleMap[key])
        return circlesList;
    };
    
    var printCircle = (key) => {
        console.log("-----\nPRINTING NEW - "+key);
        var circleList = circleMap[key];
        
        var alpha = 1;
        for(let i=0; i<COPIES; i++){
            alpha = COPY_OPACITY_START + (i-1)*copyOpacityStep;
            console.log("Making - "+i+" - "+circleList[i]+" with Alpha - "+alpha);
            form.fillOnly(Color.from(255, 0, 0, alpha).toString("rgba")).circle(circleList[i]);
        }
    };

    space.add({          
        start:( bound ) => { 
            createCircle(KEY_SLANT_TOP, dirSlantUp, true, true);
            createCircle(KEY_HORIZ, dirHoriz, false, true);
            createCircle(KEY_SLANT_BOTTOM, dirSlantDown, false, true);
        },

        animate: (time, ftime) => {
            printCircle(KEY_SLANT_TOP);
            printCircle(KEY_HORIZ);
            printCircle(KEY_SLANT_BOTTOM);
        }
    });
    space.bindMouse().bindTouch().playOnce(200);
    
})();