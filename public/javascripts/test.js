
io.on('connect', function(){

});
tool.maxDistance = 2;
tool.maxDistance = 80;

// Each user has a unique session ID
// We'll use this to keep track of paths

    var sessionId = socket.io.engine.id;
    console.log(sessionId)



// Returns an object specifying a semi-random color
function randomColor() {

  return {
    hue: Math.random() * 360,
    saturation: 0.8,
    brightness: 0.8,
    alpha: 0.5
  };

}

// An object to keep track of each users paths
// We'll use session ID's as keys
paths = {};





// -----------
// User Events
// -----------


// The user started a path
function onMouseDown(event) {

  // Create the new path
  color = randomColor();

  startPath( event.point, color, sessionId );
  console.log(sessionId)
  // Inform the backend
  var point = {
      x: event.middlePoint.x,
      y: event.middlePoint.y
  };
  emit("startPath", point, sessionId);

}

function onMouseDrag(event) {

  var step        = event.delta / 2;
  step.angle     += 90;
  var top         = event.middlePoint + step;
  var bottom      = event.middlePoint - step;

  continuePath( top, bottom, sessionId );


  // Inform the backend
  emit("continuePath", {top: top, bottom: bottom}, sessionId);

}

function onMouseUp(event) {

  endPath(event.point, sessionId);

  // Inform the backend
  emit("endPath", {point: event.point}, sessionId);

}






// -----------------
// Drawing functions
// Use to draw multiple users paths
// -----------------


function startPath( point, color, sessionId ) {

  paths[sessionId] = new Path();
  paths[sessionId].fillColor = color;
  paths[sessionId].add(point);

}

function continuePath(top, bottom, sessionId) {

  var path = paths[sessionId];
test = Object.assign({}, top);
delete test[0]; test.x = test[1]; test.y = test[2]; delete test[1]; delete test[2];
test2 = Object.assign({}, bottom);
delete test2[0]; test2.x = test2[1]; test2.y = test2[2]; delete test2[1]; delete test2[2];

  path.add(test);
   // console.log(top)
  path.insert(0, test2);
  view.draw();
// console.log(test)
// console.log(test2)
  // console.log(bottom)
  // console.log(sessionId)
}

function endPath(point, sessionId) {

  var path = paths[sessionId];

  path.add(point);
  path.closed = true;
  path.smooth();
  view.draw();

  delete paths[sessionId]

}






// -----------------
// Emit
// Use to inform the server of user events
// -----------------


function emit(eventName, data) {

  io.emit(eventName, data, sessionId);

}

io.on( 'startPath', function( data, sessionId ) {

  startPath(data, data.color, sessionId);

});


io.on( 'continuePath', function( data, sessionId ) {

  continuePath(data.top, data.bottom, sessionId);
  view.draw();

});


io.on( 'endPath', function( data, sessionId ) {

  endPath(data, sessionId);
  view.draw();

});
