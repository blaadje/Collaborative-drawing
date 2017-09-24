var undo = new Group();
var redo = new Group();
var stroke = 10;
var color = "red";

// var id = socket.io.engine.id

$(document).on('keydown', function(e){
    if($(':focus').is('input, select') && (e.keyCode === 13 || e.keyCode === 32))
        e.preventDefault();
});
$(':focus').is('button')

$('#stroke').change(function(){
    stroke = $('#stroke').val();
    io.emit('stroke', stroke);
});
$('#color').change(function(){
    color = $('#color').val();
});
$('#undo').click(function(){
    if (undo.hasChildren()){
        redo.addChild(undo.lastChild);
        redo.visible = false;
    }
    io.emit('undo');
});
$('#redo').click(function(){
    if (redo.hasChildren()){
        undo.addChild(redo.lastChild);
    }
    io.emit('redo', stroke);
});


var circlePath = new Path.Circle({
    radius: 50});

function onMouseMove(event) {
    point = {x:event.point.x,y:event.point.y};
    circlePath.bounds.height = stroke;
    circlePath.bounds.width = stroke;
    circlePath.fillColor = 'rgba(42, 70, 168, 0.61)';
    circlePath.position = point;
    io.emit('cursor', point);
}

function onMouseDown(event) {
    var type = event.type;
    var point = {x:event.middlePoint.x,y:event.middlePoint.y};
	myPath = new Path();
    path = new Point();
    path.add(event.point);
    undo.addChild(myPath);
    myPath.strokeColor = color;
    myPath.strokeWidth = stroke;
    EnvoieOnMouseDraging(point, color, stroke, type);
}

var zoom = 100
var i = 0;
$('#zoom').text(zoom + " %");
$('#default').on('click', function(){
    view.zoom = 1;
    zoom = 100;
    i=0;
    $('#zoom').text(zoom + " %");
})
$('#zoom').text(zoom+' %');
$('#draw').on('mousewheel', function(event){
    if(event.deltaY > 0) {
        zoom = zoom +10 + i;
        $('#zoom').text(zoom + " %");
        i++;
    } else {

        if (zoom < 0){
            zoom = zoom +10 - i;
        }else{
            zoom = zoom -10 + i;
        }
        $('#zoom').text(zoom + " %");
        i--;
    }
})

function traslladar(a,b){
         var center = paper.project.view.center;
         var desX = (a.x - b.x);
         var desY=  (a.y - b.y);
         var newCenter = [center.x + desX , center.y + desY];
         return newCenter;
}

function onMouseUp(event) {
    project.activeLayer.selected = false;
    var type = event.type;
    myPath.simplify(10);
    EnvoieOnMouseDraging(null, null, null, type);
}

function onMouseDrag(event) {
    if(event.modifiers.space){
        path.add(event.point);
        var des = traslladar (event.downPoint ,event.point);
        paper.project.view.center = des;
    }else
    {
        var type = event.type;
        var point = {x:event.middlePoint.x,y:event.middlePoint.y};
        circlePath.fillColor = 'rgba(42, 70, 168, 0.61)';
        circlePath.position = point;
        myPath.add(point);
        view.draw();
        myPath.strokeCap = 'round';
        myPath.strokeJoin = 'round';
        EnvoieOnMouseDraging(point, null, null,type);
    }
}

function EnvoieOnMouseDraging(point, color,stroke, type) {
    var infos = {
            point: point,
            color: color,
            stroke: stroke,
            type: type
        }
    io.emit( 'drawCircle', infos)
};
