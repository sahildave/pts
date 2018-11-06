// Source code licensed under Apache License 2.0. 
// Copyright © 2017 William Ngan. (https://github.com/williamngan/pts)
window.demoDescription = "Fitting four circles inside and outside of four triangles, which are connected to the pointer.";
//// Demo code starts (anonymous function wrapper is optional) ---
(function() {
	var run = Pts.quickStart("#pt", "#fe3");
	run((time, ftime) => {
		var width = space.width;
		var height = space.height;
		var third_width = (width / 3);
		var third_height = height / 3;
		var p1 = new Pt({
			x: third_width,
			y: third_height
		})
		var p2 = new Pt({
			x: (5 * width) / 9,
			y: third_height
		})
		var p3 = new Pt({
			x: 2 * third_width,
			y: third_height
		})
		var p4 = new Pt({
			x: 2 * third_width,
			y: 2 * third_height
		})
		var p5 = new Pt({
			x: third_width,
			y: 2 * third_height
		})
		var p6 = new Pt({
			x: third_width,
			y: (5 * height) / 9
		})
		var pointer = space.pointer;
		if (pointer.x > 2 * third_width) {
			pointer.x = 2 * third_width;
		} else if (pointer.x < third_width) {
			pointer.x = third_width;
		}
		if (pointer.y > 2 * third_height) {
			pointer.y = 2 * third_height;
		} else if (pointer.y < third_height) {
			pointer.y = third_height;
		}
		var alpha = ((Num.cycle(time % 3000 / 3000)) / 2) + 0.4;
		alpha = 1;
		form.fill(Color.from(0, 0, 255, alpha).toString("rgba")).stroke("rgba(0,0,0)").polygon([p1, p2, pointer, p6]);
		form.fill(Color.from(255, 255, 255, alpha).toString("rgba")).stroke("rgba(0,0,0)").polygon([p2, p3, p4, pointer]);
		form.fill(Color.from(0, 255, 0, alpha).toString("rgba")).stroke("rgba(0,0,0)").polygon([pointer, p4, p5, p6]);
		form.fill("#123").point(space.pointer, 5);
		// form.fontWidthEstimate(true);
		// var group1 = Group.fromPtArray([p1, p2]);
		// var group2 = Group.fromPtArray([p2, pointer]);
		// var group3 = Group.fromPtArray([pointer, p4]);
		// var headerResize = Typography.fontSizeToBox( group1, 0.8, true );
		// form.fillOnly("#123").font( headerResize( group1 ) ).textBox( group1, "U", "top");
		// form.fillOnly("#123").font( headerResize( group2 ) ).textBox( group2, "S", "right");
		// form.fillOnly("#123").font( headerResize( group3 ) ).textBox( group3, "C", "left");
		// var curve = Polygon.convexHull( [p1, p2, pointer, p6] );
		// curve.insert( curve.slice(0, 3), curve.length );
		// form.strokeOnly("#123", 10).polygon( Curve.bspline( curve, 50) );
		// var curve2 = Polygon.convexHull( [p2, p3, p4, pointer] );
		// curve2.insert( curve2.slice(0, 3), curve2.length );
		// form.strokeOnly("#123", 10).polygon( Curve.bspline( curve2, 50) );
		// var curve3 = Polygon.convexHull( [pointer, p4, p5, p6 ] );
		// curve3.insert( curve3.slice(0, 3), curve3.length );
		// form.strokeOnly("#123", 10).polygon( Curve.bspline( curve3, 50) );
		// U
		var uGroupTop = Group.fromPtArray([p1, p2]);
		var uGroupBottom = Group.fromPtArray([p6, pointer]);
		var uPointsTop = Group.fromPtArray([uGroupTop.interpolate(0.25), uGroupTop.interpolate(0.75)]);
		var uPointsBottom = Group.fromPtArray([uGroupBottom.interpolate(0.25), uGroupBottom.interpolate(0.75)]);
		var uGroupMidLeft = Group.fromPtArray([uPointsTop[0], uPointsBottom[0]]);
		var uGroupMidRight = Group.fromPtArray([uPointsTop[1], uPointsBottom[1]]);
		var uPointsCenter = Group.fromPtArray([uGroupMidLeft.interpolate(0.75), uGroupMidRight.interpolate(0.75)]);
		// form.fill("#123").point(uPointsTop[0]).point(uPointsTop[1]);
		// form.fill("#123").point(uPointsBottom[0]).point(uPointsBottom[1]);
		// form.fill("#123").point(uPointsCenter[0]).point(uPointsCenter[1]);
		var uGroup = Group.fromPtArray([uPointsTop[0], uPointsTop[1], uPointsCenter[1], uPointsCenter[0]]);
		form.fillOnly("rgb(255,0,0)").polygon(uGroup);
		// S
		var sGroupRight = Group.fromPtArray([p3, p4]);
		var sGroupLeft = Group.fromPtArray([p2, pointer]);
		var sPointsRight = Group.fromPtArray([sGroupRight.interpolate(0.25), sGroupRight.interpolate(0.5), sGroupRight.interpolate(0.75)]);
		var sPointsLeft = Group.fromPtArray([sGroupLeft.interpolate(0.25), sGroupLeft.interpolate(0.5), sGroupLeft.interpolate(0.75)]);
		var sPointsMidStart = Group.fromPtArray([sPointsLeft[0], sPointsRight[0]]);
		var sPointsMidCenter = Group.fromPtArray([sPointsLeft[1], sPointsRight[1]]);
		var sPointsMidEnd = Group.fromPtArray([sPointsLeft[2], sPointsRight[2]]);
		var sPointsShapeMid = Group.fromPtArray([sPointsMidStart.interpolate(0.33)]);
		var sPointsShapeCenter = Group.fromPtArray([sPointsMidCenter.interpolate(0.33), sPointsMidCenter.interpolate(0.66)]);
		var sPointsShapeEnd = Group.fromPtArray([sPointsMidEnd.interpolate(0.66)]);
		// form.fill("#123").point(p2).point(p3).point(sPointsRight[0]).point(sPointsShapeMid[0]);
		// form.fill("#123").point(sPointsShapeCenter[0]).point(sPointsShapeCenter[1]);
		// form.fill("#123").point(sPointsShapeEnd[0]).point(sPointsMidEnd[0]);
		var sGroup = Group.fromPtArray([p2, p3, sPointsRight[0], sPointsShapeMid[0], sPointsShapeCenter[0], sPointsShapeCenter[1], sPointsShapeEnd[0], sPointsMidEnd[0]]);
		form.fillOnly("rgb(255,0,0)").polygon(sGroup);
		// C
		var cGroupRight = Group.fromPtArray([pointer, p4]);
		var cGroupLeft = Group.fromPtArray([p6, p5]);
		var cPointsRight = Group.fromPtArray([cGroupRight.interpolate(0.25), cGroupRight.interpolate(0.75)]);
		var cPointsLeft = Group.fromPtArray([cGroupLeft.interpolate(0.25), cGroupLeft.interpolate(0.75)]);
		var cGroupMidTop = Group.fromPtArray([cPointsLeft[0], cPointsRight[0]]);
		var cGroupMidBottom = Group.fromPtArray([cPointsLeft[1], cPointsRight[1]]);
		var cPointsCenter = Group.fromPtArray([cGroupMidTop.interpolate(0.33), cGroupMidBottom.interpolate(0.33)]);
		// form.fill("#123").point(cGroupMidTop[0]).point(cGroupMidTop[1]);
		// form.fill("#123").point(cGroupMidBottom[0]).point(cGroupMidBottom[1]);
		// form.fill("#123").point(cPointsCenter[0]).point(cPointsCenter[1]);
		var cGroup = Group.fromPtArray([cPointsCenter[0], cGroupMidTop[1], cGroupMidBottom[1], cPointsCenter[1]]);
		form.fillOnly("rgb(255,0,0)").polygon(cGroup);
		form.fill("#123").font(12, "bold").text(new Pt({
			x: 0,
			y: 50
		}), uPointsTop[0] + "," + uPointsTop[1] + "," + uPointsCenter[1] + "," + uPointsCenter[0]);
		form.fill("#123").font(12, "bold").text(new Pt({
			x: 0,
			y: 100
		}), sPointsLeft);
		form.fill("#123").font(12, "bold").text(new Pt({
			x: 0,
			y: 150
		}), sPointsMidStart);
		form.fill("#123").font(12, "bold").text(new Pt({
			x: 0,
			y: 200
		}), sPointsMidCenter);
		form.fill("#123").font(12, "bold").text(new Pt({
			x: 0,
			y: 250
		}), sPointsMidEnd);
	});
})();
/*


fontSizeToBox( box:GroupLike, ratio:number=1, byHeight:boolean=true ): (GroupLike) => number {
    let i = byHeight ? 1 : 0;
    let h = (box[1][i] - box[0][i]);
    let f = ratio * h;
    return function( b:GroupLike ) {
      let nh = (b[1][i] - b[0][i]) / h;
      return f * nh;
    };
  }

  */