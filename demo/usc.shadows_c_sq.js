// Source code licensed under Apache License 2.0. 
// Copyright © 2017 William Ngan. (https://github.com/williamngan/pts)

window.demoDescription = "An example of using quickStart function to create this in 5 lines of code";

//// Demo code starts (anonymous function wrapper is optional) ---
Pts.quickStart( "pt", "#000" ); 

(function() {
    var RECT_SIZE = 250;
    var CIRCLE_SIZE = 150;
    var COPIES = 20;
    var COPY_FACTOR = 1.1;

    var randRect = [];
    var randRectsList = [];
    var randCircle = [];
    var randCirclesList = [];
    let randDir = new Pt();

    // function to create random lines
    var createLines = () => {
        let randDirX = Num.randomRange(-1,1);
        let randDirY = Num.randomRange(-1,1);
        randDir.to({x:randDirX, y:randDirY});
        let randRectX = Util.randomInt(space.innerBound[1].x * 0.5, space.innerBound[1].x * 0.25);
        let randRectY = Util.randomInt(space.innerBound[1].y * 0.5, space.innerBound[1].y * 0.25);
        let randRectCenter = new Pt({x:randRectX, y:randRectY});
        randRect = Rectangle.fromCenter(randRectCenter, Util.randomInt(RECT_SIZE, 250));
        console.log("1 - "+randDir);
        var lastRect = randRect;
        for(let i=1; i<COPIES; i++){
            // console.log("1 - "+lastRect);
            var newRect = Rectangle.fromCenter(randRectCenter, Rectangle.size(lastRect));
            console.log("2 - "+ Rectangle.corners(randRect)[1]);
            Geom.scale(newRect, COPY_FACTOR, Rectangle.corners(newRect)[1]);
            // console.log("3 - "+newRect +" == " + COPY_FACTOR);

            randRectsList.push(newRect);
            lastRect = newRect;
            // console.log("-----")
        }
        // console.log("4 - "+randRectsList);

        let randCircleX = Util.randomInt(space.innerBound[1].x * 0.5, space.innerBound[1].x * 0.25);
        let randCircleY = Util.randomInt(space.innerBound[1].y * 0.5, space.innerBound[1].y * 0.25);
        let randCircleCenter = new Pt({x:randCircleX, y:randCircleY});
        randCircle = Circle.fromCenter(randCircleCenter, CIRCLE_SIZE);

        var lastCircle = randCircle;
        var lastRadius = CIRCLE_SIZE;
        for(let i=1; i<COPIES; i++){
            // console.log("1 - "+lastRect);
            var lastCenter = randCircleCenter;
            lastCenter.add(randDir.$multiply(i*2.5))
            var newCircle = Circle.fromCenter(lastCenter, lastRadius);
            // console.log("2 - "+ newRect);
            // console.log("3 - "+newRect +" == " + COPY_FACTOR);
            randCirclesList.push(newCircle);
            lastCircle = newCircle;
            // lastRadius = lastRadius*COPY_FACTOR;
            // console.log("-----")
        }
    };
    
    space.add({ 
        start:( bound ) => { createLines();},

        animate: (time, ftime) => {
            // form.fill("#fff").font(12, "bold").text(new Pt({ x: 0, y: 50}), randRect); 
            // form.fill("#fff").font(12, "bold").text(new Pt({ x: 0, y: 150}), randCircleX+", "+randCircleY+" == "+randCircle); 

            

            var grp = Rectangle.corners(randRect);
            var alpha = 1;
            console.log("3--- "+randCirclesList);
            for(let i=1; i<COPIES; i++){
                var newGrp = grp.moveBy(randDir.$multiply(i*2.5));
                alpha = alpha*0.8;
                form.fillOnly(Color.from(255, 0, 0, alpha).toString("rgba")).polygon(newGrp);
                form.fillOnly(Color.from(0, 255, 0, alpha).toString("rgba")).circle(randCirclesList[i-1]);
            }

            // var grp2 = Circle.corners(randCircle);
            // console.log("1--- "+grp2)
            // var alpha2 = 1;
            // for(let i=1; i<COPIES; i++){
            //     var newGrp = grp2.moveBy(randDir.$multiply(i*2.5));
            //     console.log("2--- "+newGrp)
            //     alpha2 = alpha2*0.8;
            //     form.fillOnly(Color.from(255, 0, 0, alpha2).toString("rgba")).polygon(newGrp);
            // }



            // form.strokeOnly("999", 2).rects(randRectsList);
            form.fillOnly("#000").rect(randRect);
            form.fillOnly("#000").circle(randCircle);

        }
    });
    space.bindMouse().bindTouch().play();
    
})();