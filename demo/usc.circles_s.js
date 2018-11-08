// Source code licensed under Apache License 2.0. 
// Copyright © 2017 William Ngan. (https://github.com/williamngan/pts)

window.demoDescription = "An example of using quickStart function to create this in 5 lines of code";

//// Demo code starts (anonymous function wrapper is optional) ---
Pts.quickStart( "pt", "#000" ); 

(function() {
    var CIRCLE_SIZE = 50;
    var COPIES = 20;
    var MAGNITUDE = 500;

    var COPY_OPACITY_START = 1.0;
    var COPY_OPACITY_END = 0.05;

    var KEY_HORIZ = "circles_horiz";
    var KEY_SLANT_TOP = "circles_slant_top";
    var KEY_SLANT_BOTTOM = "circles_slant_bottom";

    // let dirSlantDown = new Pt({x:Num.randomRange(0.5,1), y:Num.randomRange(-1, -0.5)});
    // let dirSlantUp = new Pt({x:Num.randomRange(-1, -0.5), y:Num.randomRange(0.5, 1)});
    // let dirHoriz = new Pt({x:Num.randomRange(-1,-0.5), y:0});


    let dirSlantDown = new Pt({x:0.75, y:-0.75});
    let dirSlantUp = new Pt({x:-0.75, y:0.75});
    let dirHoriz = new Pt({x:-0.75, y:0});

    var copyOpacityStep = (COPY_OPACITY_END-COPY_OPACITY_START)/COPIES;

    var circleMap = [];
    // function to create random lines
    var createCircle = (key, dir) => {
        var circlesList = [];
        let circleX = Util.randomInt(space.innerBound[1].x * 0.5, space.innerBound[1].x * 0.25);
        let circleY = Util.randomInt(space.innerBound[1].y * 0.5, space.innerBound[1].y * 0.25);
        let circleCenter = new Pt({x:circleX, y:circleY});
        let circle = Circle.fromCenter(circleCenter, CIRCLE_SIZE);
        circlesList.push(circle);

        for(let i=1; i<COPIES; i++){
            var lastCenter = circleCenter;
            lastCenter.add(dir.$multiply(MAGNITUDE/COPIES))
            var newCircle = Circle.fromCenter(lastCenter, CIRCLE_SIZE);
            circlesList.push(newCircle);
        }
        circleMap[key] = circlesList;
        return circlesList;
    };
    
    var printCircle = (key) => {
        var circleList = circleMap[key];
        
        var alpha = 1;
        for(let i=0; i<COPIES; i++){
            alpha = COPY_OPACITY_START + (i-1)*copyOpacityStep;
            console.log("Making - "+circleList[i]);
            form.fillOnly(Color.from(255, 0, 0, alpha).toString("rgba")).circle(circleList[i]);
        }
    };

    space.add({          
        start:( bound ) => { 
            createCircle(KEY_HORIZ, dirHoriz);
            createCircle(KEY_SLANT_TOP, dirSlantUp);
            createCircle(KEY_SLANT_BOTTOM, dirSlantDown);
        },

        animate: (time, ftime) => {
            printCircle(KEY_HORIZ);
            printCircle(KEY_SLANT_TOP);
            printCircle(KEY_SLANT_BOTTOM);
            // var circleHorizList = circleMap[KEY_HORIZ];
            
            // var alpha = 1;
            // for(let i=0; i<COPIES; i++){
            //     if(alpha >0.3) 
            //         alpha = alpha*0.8;
            //     console.log("Making - "+circleHorizList[i]);
            //     form.fillOnly(Color.from(255, 0, 0, alpha).toString("rgba")).circle(circleHorizList[i]);
            // }
        }
    });
    space.bindMouse().bindTouch().playOnce(200);
    
})();