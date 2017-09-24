var undoServer = new Group();
var redoServer = new Group();
var circlePathServer = new Path.Circle({
    radius: 50});
circlePathServer.bounds.height = 10;
circlePathServer.bounds.width = 10;

function onMouseDownServer(type, color, stroke){
    if (type === "mousedown"){
        myPath2 = new Path();
        undoServer.addChild(myPath2);
        myPath2.strokeColor = color;
        myPath2.strokeWidth = stroke;
    }
}
function onMouseDragServer(point, type ) {
    if (type === "mousedrag"){
        circlePathServer.fillColor = 'rgba(42, 70, 168, 0.61)';
        circlePathServer.position = point;
        myPath2.strokeCap = 'round';
        myPath2.strokeJoin = 'round';
        myPath2.add(point);
        view.draw();
    }
}
function onMouseUpServer(type) {
    if (type === "mouseup"){
        myPath2.simplify();
    }
}

io.on('cursor',function(point){
    circlePathServer.position = point;
    circlePathServer.fillColor = 'rgba(125, 152, 246, 0.57)';
})
io.on('stroke',function(stroke){
    circlePathServer.bounds.height = stroke;
    circlePathServer.bounds.width = stroke;
})
io.on('undo',function(){
    if (undoServer.hasChildren()){
        redoServer.addChild(undoServer.lastChild);
        redoServer.visible = false;
    }
})
io.on('redo',function(stroke){
    if (redoServer.hasChildren()){
        undoServer.addChild(redoServer.lastChild);
    }
})
io.on( 'drawCircle', function(infos) {
     onMouseDownServer(infos.type, infos.color, infos.stroke);
     onMouseDragServer(infos.point,infos.type);
     onMouseUpServer(infos.type);
});
