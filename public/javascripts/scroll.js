var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

 var SimplePanAndZoom, StableZoom, drawGrid, example1, example2, _ref;
    SimplePanAndZoom = (function() {
      function SimplePanAndZoom() {}

      SimplePanAndZoom.prototype.changeZoom = function(oldZoom, delta) {
        var factor;
        factor = 1.05;
        if (delta > 0) {
          return oldZoom * factor;
        }
        if (delta < 0) {
          return oldZoom / factor;
        }
        return oldZoom;
      };

      SimplePanAndZoom.prototype.changeCenter = function(oldCenter, deltaX, deltaY, factor) {
        var offset;
        offset = new paper.Point(deltaX, -deltaY);
        offset = offset.multiply(factor);
        return oldCenter.add(offset);
      };

      return SimplePanAndZoom;

    })();
       StableZoom = (function(_super) {
      __extends(StableZoom, _super);

      function StableZoom() {
        _ref = StableZoom.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      StableZoom.prototype.changeZoom = function(oldZoom, delta, c, p) {
        var a, beta, newZoom, pc;
        newZoom = StableZoom.__super__.changeZoom.call(this, oldZoom, delta);
        beta = oldZoom / newZoom;
        pc = p.subtract(c);
        a = p.subtract(pc.multiply(beta)).subtract(c);
        return [newZoom, a];
      };

      return StableZoom;

    })(SimplePanAndZoom);
 panAndZoom = new StableZoom();

      $("#draw").mousewheel(function(event) {
        var mousePosition, newZoom, offset, viewPosition, _ref1;
          mousePosition = new paper.Point(event.offsetX, event.offsetY);
          viewPosition = view.viewToProject(mousePosition);
          _ref1 = panAndZoom.changeZoom(view.zoom, event.deltaY, view.center, viewPosition), newZoom = _ref1[0], offset = _ref1[1];
          view.zoom = newZoom;
          view.center = view.center.add(offset);
          event.preventDefault();
          return view.draw();

      });
