
/*
 *  Kartograph - a svg mapping library
 *  Copyright (C) 2011-2013  Gregor Aisch
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 */
var $, __type, base, kartograph, log, root, warn;

root = typeof exports !== "undefined" && exports !== null ? exports : this;

kartograph = root.$K = root.Kartograph != null ? root.Kartograph : root.Kartograph = {};

kartograph.version = "0.6.1";

$ = root.jQuery;

kartograph.__verbose = false;

warn = function(s) {
  var e, error, error1;
  try {
    return console.warn.apply(console, arguments);
  } catch (error) {
    e = error;
    try {
      return opera.postError.apply(opera, arguments);
    } catch (error1) {
      e = error1;
      return alert(Array.prototype.join.call(arguments, ' '));
    }
  }
};

log = function(s) {
  var e, error, error1;
  if (kartograph.__verbose) {
    try {
      return console.debug.apply(console, arguments);
    } catch (error) {
      e = error;
      try {
        return opera.postError.apply(opera, arguments);
      } catch (error1) {
        e = error1;
        return alert(Array.prototype.join.call(arguments, ' '));
      }
    }
  }
};

if ((base = String.prototype).trim == null) {
  base.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
  };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
};

__type = (function() {

  /*
  for browser-safe type checking+
  ported from jQuery's $.type
   */
  var classToType, i, len, name, ref;
  classToType = {};
  ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
  for (i = 0, len = ref.length; i < len; i++) {
    name = ref[i];
    classToType["[object " + name + "]"] = name.toLowerCase();
  }
  return function(obj) {
    var strType;
    strType = Object.prototype.toString.call(obj);
    return classToType[strType] || "object";
  };
})();


/*
    kartograph - a svg mapping library
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var BBox;

BBox = (function() {

  /*
  2D bounding box
   */
  function BBox(left, top, width, height) {
    var s;
    if (left == null) {
      left = 0;
    }
    if (top == null) {
      top = 0;
    }
    if (width == null) {
      width = null;
    }
    if (height == null) {
      height = null;
    }
    s = this;
    if (width === null) {
      s.xmin = Number.MAX_VALUE;
      s.xmax = Number.MAX_VALUE * -1;
    } else {
      s.xmin = s.left = left;
      s.xmax = s.right = left + width;
      s.width = width;
    }
    if (height === null) {
      s.ymin = Number.MAX_VALUE;
      s.ymax = Number.MAX_VALUE * -1;
    } else {
      s.ymin = s.top = top;
      s.ymax = s.bottom = height + top;
      s.height = height;
    }
    return;
  }

  BBox.prototype.update = function(x, y) {
    var s;
    if (y == null) {
      y = x[1];
      x = x[0];
    }
    s = this;
    s.xmin = Math.min(s.xmin, x);
    s.ymin = Math.min(s.ymin, y);
    s.xmax = Math.max(s.xmax, x);
    s.ymax = Math.max(s.ymax, y);
    s.left = s.xmin;
    s.top = s.ymin;
    s.right = s.xmax;
    s.bottom = s.ymax;
    s.width = s.xmax - s.xmin;
    s.height = s.ymax - s.ymin;
    return this;
  };

  BBox.prototype.intersects = function(bbox) {
    return bbox.left < s.right && bbox.right > s.left && bbox.top < s.bottom && bbox.bottom > s.top;
  };

  BBox.prototype.inside = function(x, y) {
    var s;
    s = this;
    return x >= s.left && x <= s.right && y >= s.top && y <= s.bottom;
  };

  BBox.prototype.join = function(bbox) {
    var s;
    s = this;
    s.update(bbox.left, bbox.top);
    s.update(bbox.right, bbox.bottom);
    return this;
  };

  return BBox;

})();

BBox.fromXML = function(xml) {
  var h, w, x, y;
  x = Number(xml.getAttribute('x'));
  y = Number(xml.getAttribute('y'));
  w = Number(xml.getAttribute('w'));
  h = Number(xml.getAttribute('h'));
  return new kartograph.BBox(x, y, w, h);
};

kartograph.BBox = BBox;


/*
    kartograph - a svg mapping library
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var CohenSutherland, base;

if (kartograph.geom == null) {
  kartograph.geom = {};
}

if ((base = kartograph.geom).clipping == null) {
  base.clipping = {};
}

CohenSutherland = (function() {
  var BOTTOM, INSIDE, LEFT, RIGHT, TOP;

  function CohenSutherland() {}

  INSIDE = 0;

  LEFT = 1;

  RIGHT = 2;

  BOTTOM = 4;

  TOP = 8;

  CohenSutherland.prototype.compute_out_code = function(bbox, x, y) {
    var code, self;
    self = this;
    code = self.INSIDE;
    if (x < bbox.left) {
      code |= self.LEFT;
    } else if (x > bbox.right) {
      code |= self.RIGHT;
    }
    if (y < bbox.top) {
      code |= self.TOP;
    } else if (y > bbox.bottom) {
      code |= self.BOTTOM;
    }
    return code;
  };

  CohenSutherland.prototype.clip = function(bbox, x0, y0, x1, y1) {
    var accept, code0, code1, cout, self, x, y;
    self = this;
    code0 = self.compute_out_code(bbox, x0, y0);
    code1 = self.compute_out_code(bbox, x1, y1);
    accept = False;
    while (True) {
      if (!(code0 | code1)) {
        accept = True;
        break;
      } else if (code0 & code1) {
        break;
      } else {
        cout = code === 0 ? code1 : code0;
        if (cout & self.TOP) {
          x = x0 + (x1 - x0) * (bbox.top - y0) / (y1 - y0);
          y = bbox.top;
        } else if (cout & self.BOTTOM) {
          x = x0 + (x1 - x0) * (bbox.bottom - y0) / (y1 - y0);
          y = bbox.bottom;
        } else if (cout & self.RIGHT) {
          y = y0 + (y1 - y0) * (bbox.right - x0) / (x1 - x0);
          x = bbox.right;
        } else if (cout & self.LEFT) {
          y = y0 + (y1 - y0) * (bbox.left - x0) / (x1 - x0);
          x = bbox.left;
        }
        if (cout === code0) {
          x0 = x;
          y0 = y;
          code0 = self.compute_out_code(bbox, x0, y0);
        } else {
          x1 = x;
          y1 = y;
          code1 = self.compute_out_code(bbox, x1, y1);
        }
      }
    }
    if (accept) {
      return [x0, y0, x1, y1];
    } else {
      return null;
    }
  };

  return CohenSutherland;

})();

kartograph.geom.clipping.CohenSutherland = CohenSutherland;


/*
    kartograph - a svg mapping library
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var Kartograph;

Kartograph = (function() {
  function Kartograph(container, width, height) {
    var cnt, me;
    me = this;
    me.container = cnt = $(container);
    if (width == null) {
      width = cnt.width();
    }
    if (height == null) {
      height = cnt.height();
    }
    if (height === 0) {
      height = 'auto';
    }
    me.size = {
      h: height,
      w: width
    };
    me.markers = [];
    me.pathById = {};
    me.container.addClass('kartograph');
  }

  Kartograph.prototype.createSVGLayer = function(id) {
    var about, cnt, lid, me, paper, svg, vp;
    me = this;
    if (me._layerCnt == null) {
      me._layerCnt = 0;
    }
    lid = me._layerCnt++;
    vp = me.viewport;
    cnt = me.container;
    paper = Raphael(cnt[0], vp.width, vp.height);
    svg = $(paper.canvas);
    svg.css({
      position: 'absolute',
      top: '0px',
      left: '0px',
      'z-index': lid + 5
    });
    if (cnt.css('position') === 'static') {
      cnt.css({
        position: 'relative',
        height: vp.height + 'px'
      });
    }
    svg.addClass(id);
    about = $('desc', paper.canvas).text();
    $('desc', paper.canvas).text(about.replace('with ', 'with kartograph ' + kartograph.version + ' and '));
    return paper;
  };

  Kartograph.prototype.createHTMLLayer = function(id) {
    var cnt, div, lid, me, vp;
    me = this;
    vp = me.viewport;
    cnt = me.container;
    if (me._layerCnt == null) {
      me._layerCnt = 0;
    }
    lid = me._layerCnt++;
    div = $('<div class="layer ' + id + '" />');
    div.css({
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: vp.width + 'px',
      height: vp.height + 'px',
      'z-index': lid + 5
    });
    cnt.append(div);
    return div;
  };

  Kartograph.prototype.loadMap = function(mapurl, callback, opts) {
    var base1, def, me;
    me = this;
    def = $.Deferred();
    me.clear();
    me.opts = opts != null ? opts : {};
    if ((base1 = me.opts).zoom == null) {
      base1.zoom = 1;
    }
    me.mapLoadCallback = callback;
    me._loadMapDeferred = def;
    me._lastMapUrl = mapurl;
    if (me.cacheMaps && (kartograph.__mapCache[mapurl] != null)) {
      me._mapLoaded(kartograph.__mapCache[mapurl]);
    } else {
      $.ajax({
        url: mapurl,
        dataType: "text",
        success: me._mapLoaded,
        context: me,
        error: function(a, b, c) {
          return warn(a, b, c);
        }
      });
    }
    return def.promise();
  };

  Kartograph.prototype.setMap = function(svg, opts) {
    var base1, me;
    me = this;
    me.opts = opts != null ? opts : {};
    if ((base1 = me.opts).zoom == null) {
      base1.zoom = 1;
    }
    me._lastMapUrl = 'string';
    me._mapLoaded(svg);
  };

  Kartograph.prototype._mapLoaded = function(xml) {
    var $view, AB, err, error, h, halign, me, padding, ratio, ref, ref1, ref2, ref3, valign, vp, w, zoom;
    me = this;
    if (me.cacheMaps) {
      if (kartograph.__mapCache == null) {
        kartograph.__mapCache = {};
      }
      kartograph.__mapCache[me._lastMapUrl] = xml;
    }
    try {
      xml = $(xml);
    } catch (error) {
      err = error;
      warn('something went horribly wrong while parsing svg');
      me._loadMapDeferred.reject('could not parse svg');
      return;
    }
    me.svgSrc = xml;
    $view = $('view', xml);
    if (me.paper == null) {
      w = me.size.w;
      h = me.size.h;
      if (h === 'auto') {
        ratio = $view.attr('w') / $view.attr('h');
        h = w / ratio;
      }
      me.viewport = new BBox(0, 0, w, h);
    }
    vp = me.viewport;
    me.viewAB = AB = kartograph.View.fromXML($view[0]);
    padding = (ref = me.opts.padding) != null ? ref : 0;
    halign = (ref1 = me.opts.halign) != null ? ref1 : 'center';
    valign = (ref2 = me.opts.valign) != null ? ref2 : 'center';
    zoom = (ref3 = me.opts.zoom) != null ? ref3 : 1;
    me.viewBC = new kartograph.View(me.viewAB.asBBox(), vp.width * zoom, vp.height * zoom, padding, halign, valign);
    me.proj = kartograph.Proj.fromXML($('proj', $view)[0]);
    if (me.mapLoadCallback != null) {
      me.mapLoadCallback(me);
    }
    if (me._loadMapDeferred != null) {
      me._loadMapDeferred.resolve(me);
    }
  };

  Kartograph.prototype.addLayer = function(id, opts) {
    var $paths, chunkSize, iter, layer, layer_id, me, moveOn, nextPaths, path_id, ref, rows, src_id, svgLayer, titles;
    if (opts == null) {
      opts = {};
    }

    /*
    add new layer
     */
    me = this;
    if (me.layerIds == null) {
      me.layerIds = [];
    }
    if (me.layers == null) {
      me.layers = {};
    }
    if (me.paper == null) {
      me.paper = me.createSVGLayer();
    }
    src_id = id;
    if (__type(opts) === 'object') {
      layer_id = opts.name;
      path_id = opts.key;
      titles = opts.title;
    } else {
      opts = {};
    }
    if (layer_id == null) {
      layer_id = src_id;
    }
    svgLayer = $('#' + src_id, me.svgSrc);
    if (svgLayer.length === 0) {
      return;
    }
    layer = new MapLayer(layer_id, path_id, me, opts.filter);
    $paths = $('*', svgLayer[0]);
    rows = $paths.length;
    chunkSize = (ref = opts.chunks) != null ? ref : rows;
    iter = 0;
    nextPaths = function() {
      var base, i, j, prop, ref1, ref2, val;
      base = chunkSize * iter;
      for (i = j = 0, ref1 = chunkSize; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
        if (base + i < rows) {
          layer.addPath($paths.get(base + i), titles);
        }
      }
      if (opts.styles != null) {
        ref2 = opts.styles;
        for (prop in ref2) {
          val = ref2[prop];
          layer.style(prop, val);
        }
      }
      iter++;
      if (iter * chunkSize < rows) {
        return setTimeout(nextPaths, 0);
      } else {
        return moveOn();
      }
    };
    moveOn = function() {
      var checkEvents, evt, j, len;
      if (layer.paths.length > 0) {
        me.layers[layer_id] = layer;
        me.layerIds.push(layer_id);
      }
      checkEvents = ['click', 'mouseenter', 'mouseleave', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout'];
      for (j = 0, len = checkEvents.length; j < len; j++) {
        evt = checkEvents[j];
        if (__type(opts[evt]) === 'function') {
          layer.on(evt, opts[evt]);
        }
      }
      if (opts.tooltips != null) {
        layer.tooltips(opts.tooltips);
      }
      if (opts.done != null) {
        return opts.done();
      }
    };
    if (opts.chunks != null) {
      setTimeout(nextPaths, 0);
    } else {
      nextPaths();
    }
    return me;
  };

  Kartograph.prototype.getLayer = function(layer_id) {

    /* returns a map layer */
    var me;
    me = this;
    if (me.layers[layer_id] == null) {
      warn('could not find layer ' + layer_id);
      return null;
    }
    return me.layers[layer_id];
  };

  Kartograph.prototype.getLayerPath = function(layer_id, path_id) {
    var layer, me;
    me = this;
    layer = me.getLayer(layer_id);
    if (layer != null) {
      if (__type(path_id) === 'object') {
        return layer.getPaths(path_id)[0];
      } else {
        return layer.getPath(path_id);
      }
    }
    return null;
  };

  Kartograph.prototype.onLayerEvent = function(event, callback, layerId) {
    var me;
    me = this;
    me.getLayer(layerId).on(event, callback);
    return me;
  };

  Kartograph.prototype.addMarker = function(marker) {
    var me, xy;
    me = this;
    me.markers.push(marker);
    xy = me.viewBC.project(me.viewAB.project(me.proj.project(marker.lonlat.lon, marker.lonlat.lat)));
    return marker.render(xy[0], xy[1], me.container, me.paper);
  };

  Kartograph.prototype.clearMarkers = function() {
    var j, len, marker, me, ref;
    me = this;
    ref = me.markers;
    for (j = 0, len = ref.length; j < len; j++) {
      marker = ref[j];
      marker.clear();
    }
    return me.markers = [];
  };

  Kartograph.prototype.fadeIn = function(opts) {
    var dur, duration, id, layer_id, me, path, paths, ref, ref1, ref2, results;
    if (opts == null) {
      opts = {};
    }
    me = this;
    layer_id = (ref = opts.layer) != null ? ref : me.layerIds[me.layerIds.length - 1];
    duration = (ref1 = opts.duration) != null ? ref1 : 500;
    ref2 = me.layers[layer_id].pathsById;
    results = [];
    for (id in ref2) {
      paths = ref2[id];
      results.push((function() {
        var j, len, results1;
        results1 = [];
        for (j = 0, len = paths.length; j < len; j++) {
          path = paths[j];
          if (__type(duration) === "function") {
            dur = duration(path.data);
          } else {
            dur = duration;
          }
          path.svgPath.attr('opacity', 0);
          results1.push(path.svgPath.animate({
            opacity: 1
          }, dur));
        }
        return results1;
      })());
    }
    return results;
  };


  /*
      end of public API
   */

  Kartograph.prototype.loadCoastline = function() {
    var me;
    me = this;
    return $.ajax({
      url: 'coastline.json',
      success: me.renderCoastline,
      context: me
    });
  };

  Kartograph.prototype.resize = function(w, h) {

    /*
    forces redraw of every layer
     */
    var cnt, halign, id, j, layer, len, me, padding, ref, ref1, ref2, ref3, ref4, sg, valign, vp, zoom;
    me = this;
    cnt = me.container;
    if (w == null) {
      w = cnt.width();
    }
    if (h == null) {
      h = cnt.height();
    }
    me.viewport = vp = new kartograph.BBox(0, 0, w, h);
    if (me.paper != null) {
      me.paper.setSize(vp.width, vp.height);
    }
    vp = me.viewport;
    padding = (ref = me.opts.padding) != null ? ref : 0;
    halign = (ref1 = me.opts.halign) != null ? ref1 : 'center';
    valign = (ref2 = me.opts.valign) != null ? ref2 : 'center';
    zoom = me.opts.zoom;
    me.viewBC = new kartograph.View(me.viewAB.asBBox(), vp.width * zoom, vp.height * zoom, padding, halign, valign);
    ref3 = me.layers;
    for (id in ref3) {
      layer = ref3[id];
      layer.setView(me.viewBC);
    }
    if (me.symbolGroups != null) {
      ref4 = me.symbolGroups;
      for (j = 0, len = ref4.length; j < len; j++) {
        sg = ref4[j];
        sg.onResize();
      }
    }
  };

  Kartograph.prototype.lonlat2xy = function(lonlat) {
    var a, me;
    me = this;
    if (lonlat.length === 2) {
      lonlat = new kartograph.LonLat(lonlat[0], lonlat[1]);
    }
    if (lonlat.length === 3) {
      lonlat = new kartograph.LonLat(lonlat[0], lonlat[1], lonlat[2]);
    }
    a = me.proj.project(lonlat.lon, lonlat.lat, lonlat.alt);
    return me.viewBC.project(me.viewAB.project(a));
  };

  Kartograph.prototype.addSymbolGroup = function(symbolgroup) {
    var me;
    me = this;
    if (me.symbolGroups == null) {
      me.symbolGroups = [];
    }
    return me.symbolGroups.push(symbolgroup);
  };

  Kartograph.prototype.removeSymbols = function(index) {
    var j, len, me, ref, results, sg;
    me = this;
    if (index != null) {
      return me.symbolGroups[index].remove();
    } else {
      ref = me.symbolGroups;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        sg = ref[j];
        results.push(sg.remove());
      }
      return results;
    }
  };

  Kartograph.prototype.clear = function() {
    var id, j, len, me, ref, sg;
    me = this;
    if (me.layers != null) {
      for (id in me.layers) {
        me.layers[id].remove();
      }
      me.layers = {};
      me.layerIds = [];
    }
    if (me.symbolGroups != null) {
      ref = me.symbolGroups;
      for (j = 0, len = ref.length; j < len; j++) {
        sg = ref[j];
        sg.remove();
      }
      me.symbolGroups = [];
    }
    if (me.paper != null) {
      $(me.paper.canvas).remove();
      return me.paper = void 0;
    }
  };

  Kartograph.prototype.loadCSS = function(url, callback) {

    /*
    loads a stylesheet
     */
    var me;
    me = this;
    if ($.browser.msie) {
      return $.ajax({
        url: url,
        dataType: 'text',
        success: function(resp) {
          me.styles = kartograph.parsecss(resp);
          return callback();
        },
        error: function(a, b, c) {
          return warn('error while loading ' + url, a, b, c);
        }
      });
    } else {
      $('body').append('<link rel="stylesheet" href="' + url + '" />');
      return callback();
    }
  };

  Kartograph.prototype.applyCSS = function(el, className) {

    /*
    applies pre-loaded css styles to
    raphael elements
     */
    var classes, j, k, l, len, len1, me, p, props, ref, ref1, sel, selectors;
    me = this;
    if (me.styles == null) {
      return el;
    }
    if (me._pathTypes == null) {
      me._pathTypes = ["path", "circle", "rectangle", "ellipse"];
    }
    if (me._regardStyles == null) {
      me._regardStyles = ["fill", "stroke", "fill-opacity", "stroke-width", "stroke-opacity"];
    }
    for (sel in me.styles) {
      p = sel;
      ref = p.split(',');
      for (j = 0, len = ref.length; j < len; j++) {
        selectors = ref[j];
        p = selectors.split(' ');
        p = p[p.length - 1];
        p = p.split(':');
        if (p.length > 1) {
          continue;
        }
        p = p[0].split('.');
        classes = p.slice(1);
        if (classes.length > 0 && classes.indexOf(className) < 0) {
          continue;
        }
        p = p[0];
        if (me._pathTypes.indexOf(p) >= 0 && p !== el.type) {
          continue;
        }
        props = me.styles[sel];
        ref1 = me._regardStyles;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          k = ref1[l];
          if (props[k] != null) {
            el.attr(k, props[k]);
          }
        }
      }
    }
    return el;
  };

  Kartograph.prototype.style = function(layer, prop, value, duration, delay) {
    var me;
    me = this;
    layer = me.getLayer(layer);
    if (layer != null) {
      return layer.style(prop, value, duration, delay);
    }
  };

  return Kartograph;

})();

kartograph.Kartograph = Kartograph;

kartograph.map = function(container, width, height) {

  /* short-hand constructor */
  return new Kartograph(container, width, height);
};

kartograph.__mapCache = {};


/*
    kartograph - a svg mapping library 
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var LatLon, LonLat,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

LonLat = (function() {

  /*
  	represents a Point
   */
  function LonLat(lon, lat, alt) {
    if (alt == null) {
      alt = 0;
    }
    this.lon = Number(lon);
    this.lat = Number(lat);
    this.alt = Number(alt);
  }

  LonLat.prototype.distance = function(ll) {
    var R, a, c, dLat, dLon, deg2rad, lat1, lat2, me;
    me = this;
    R = 6371;
    deg2rad = Math.PI / 180;
    dLat = (ll.lat - me.lat) * deg2rad;
    dLon = (ll.lon - me.lon) * deg2rad;
    lat1 = me.lat * deg2rad;
    lat2 = ll.lat * deg2rad;
    a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return LonLat;

})();

LatLon = (function(superClass) {
  extend(LatLon, superClass);

  function LatLon(lat, lon, alt) {
    if (alt == null) {
      alt = 0;
    }
    LatLon.__super__.constructor.call(this, lon, lat, alt);
  }

  return LatLon;

})(LonLat);

kartograph.LonLat = LonLat;

kartograph.LatLon = LatLon;


/*
    kartograph - a svg mapping library 
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var MapLayer, map_layer_path_uid, resolve,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

MapLayer = (function() {
  function MapLayer(layer_id, path_id, map, filter) {
    var me;
    me = this;
    me.id = layer_id;
    me.path_id = path_id;
    me.paper = map.paper;
    me.view = map.viewBC;
    me.map = map;
    me.filter = filter;
  }

  MapLayer.prototype.addPath = function(svg_path, titles) {
    var base, layerPath, me, name;
    me = this;
    if (me.paths == null) {
      me.paths = [];
    }
    layerPath = new MapLayerPath(svg_path, me.id, me.map, titles);
    if (__type(me.filter) === 'function') {
      if (me.filter(layerPath.data) === false) {
        layerPath.remove();
        return;
      }
    }
    me.paths.push(layerPath);
    if (me.path_id != null) {
      if (me.pathsById == null) {
        me.pathsById = {};
      }
      if ((base = me.pathsById)[name = layerPath.data[me.path_id]] == null) {
        base[name] = [];
      }
      return me.pathsById[layerPath.data[me.path_id]].push(layerPath);
    }
  };

  MapLayer.prototype.hasPath = function(id) {
    var me;
    me = this;
    return (me.pathsById != null) && (me.pathsById[id] != null);
  };

  MapLayer.prototype.getPathsData = function() {

    /* returns a list of all shape data dictionaries */
    var i, len, me, path, pd, ref;
    me = this;
    pd = [];
    ref = me.paths;
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      pd.push(path.data);
    }
    return pd;
  };

  MapLayer.prototype.getPath = function(id) {
    var me;
    me = this;
    if (me.hasPath(id)) {
      return me.pathsById[id][0];
    }
    return null;
  };

  MapLayer.prototype.getPaths = function(query) {
    var i, key, len, match, matches, me, path, ref;
    me = this;
    matches = [];
    if (__type(query) === 'object') {
      ref = me.paths;
      for (i = 0, len = ref.length; i < len; i++) {
        path = ref[i];
        match = true;
        for (key in query) {
          match = match && path.data[key] === query[key];
        }
        if (match) {
          matches.push(path);
        }
      }
    }
    return matches;
  };

  MapLayer.prototype.setView = function(view) {

    /*
     * after resizing of the map, each layer gets a new view
     */
    var i, len, me, path, ref;
    me = this;
    ref = me.paths;
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      path.setView(view);
    }
    return me;
  };

  MapLayer.prototype.remove = function() {

    /*
    removes every path
     */
    var i, len, me, path, ref, results;
    me = this;
    ref = me.paths;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      results.push(path.remove());
    }
    return results;
  };

  MapLayer.prototype.style = function(prop, value, duration, delay) {
    var anim, at, dly, dur, i, key, len, me, path, ref, val;
    me = this;
    if (__type(prop) === "object") {
      for (key in prop) {
        val = prop[key];
        me.style(key, val);
      }
      return me;
    }
    if (duration == null) {
      duration = 0;
    }
    if (delay == null) {
      delay = 0;
    }
    ref = me.paths;
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      val = resolve(value, path.data);
      dur = resolve(duration, path.data);
      dly = resolve(delay, path.data);
      if (dur > 0) {
        at = {};
        at[prop] = val;
        anim = Raphael.animation(at, dur * 1000);
        path.svgPath.animate(anim.delay(dly * 1000));
      } else {
        path.svgPath.attr(prop, val);
      }
    }
    return me;
  };

  MapLayer.prototype.on = function(event, callback) {
    var EventContext, ctx, i, len, me, path, ref;
    me = this;
    EventContext = (function() {
      function EventContext(type, cb, layer) {
        this.type = type;
        this.cb = cb;
        this.layer = layer;
        this.handle = bind(this.handle, this);
      }

      EventContext.prototype.handle = function(e) {
        var path;
        me = this;
        path = me.layer.map.pathById[e.target.getAttribute('id')];
        return me.cb(path.data, path.svgPath, e);
      };

      return EventContext;

    })();
    ctx = new EventContext(event, callback, me);
    ref = me.paths;
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      $(path.svgPath.node).bind(event, ctx.handle);
    }
    return me;
  };

  MapLayer.prototype.tooltips = function(content, delay) {
    var i, len, me, path, ref, setTooltip, tt;
    me = this;
    setTooltip = function(path, tt) {
      var cfg;
      cfg = {
        position: {
          target: 'mouse',
          viewport: $(window),
          adjust: {
            x: 7,
            y: 7
          }
        },
        show: {
          delay: delay != null ? delay : 20
        },
        events: {
          show: function(evt, api) {
            return $('.qtip').filter(function() {
              return this !== api.elements.tooltip.get(0);
            }).hide();
          }
        },
        content: {}
      };
      if (tt != null) {
        if (typeof tt === "string") {
          cfg.content.text = tt;
        } else if ($.isArray(tt)) {
          cfg.content.title = tt[0];
          cfg.content.text = tt[1];
        }
      } else {
        cfg.content.text = 'n/a';
      }
      return $(path.svgPath.node).qtip(cfg);
    };
    ref = me.paths;
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      tt = resolve(content, path.data);
      setTooltip(path, tt);
    }
    return me;
  };

  MapLayer.prototype.sort = function(sortBy) {
    var i, len, lp, me, path, ref;
    me = this;
    me.paths.sort(function(a, b) {
      var av, bv, ref;
      av = sortBy(a.data);
      bv = sortBy(b.data);
      if (av === bv) {
        return 0;
      }
      return (ref = av > bv) != null ? ref : {
        1: -1
      };
    });
    lp = false;
    ref = me.paths;
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      if (lp) {
        path.svgPath.insertAfter(lp.svgPath);
      }
      lp = path;
    }
    return me;
  };

  return MapLayer;

})();

resolve = function(prop, data) {
  if (__type(prop) === 'function') {
    return prop(data);
  }
  return prop;
};

map_layer_path_uid = 0;


/*
    kartograph - a svg mapping library 
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var MapLayerPath;

MapLayerPath = (function() {
  function MapLayerPath(svg_path, layer_id, map, titles) {
    var attr, data, i, j, me, paper, path, ref, title, uid, v, view, vn;
    me = this;
    paper = map.paper;
    view = map.viewBC;
    me.path = path = kartograph.geom.Path.fromSVG(svg_path);
    me.vpath = view.projectPath(path);
    me.svgPath = me.vpath.toSVG(paper);
    if (map.styles == null) {
      if (Raphael.svg) {
        me.svgPath.node.setAttribute('class', layer_id);
      }
    } else {
      map.applyCSS(me.svgPath, layer_id);
    }
    uid = 'path_' + map_layer_path_uid++;
    me.svgPath.node.setAttribute('id', uid);
    map.pathById[uid] = me;
    data = {};
    for (i = j = 0, ref = svg_path.attributes.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      attr = svg_path.attributes[i];
      if (attr.name.substr(0, 5) === "data-") {
        v = attr.value;
        vn = Number(v);
        if (v.trim() !== "" && vn === v && !isNaN(vn)) {
          v = vn;
        }
        data[attr.name.substr(5)] = v;
      }
    }
    me.data = data;
    if (__type(titles) === 'string') {
      title = titles;
    } else if (__type(titles) === 'function') {
      title = titles(data);
    }
    if (title != null) {
      me.svgPath.attr('title', title);
    }
  }

  MapLayerPath.prototype.setView = function(view) {
    var me, path, path_str;
    me = this;
    path = view.projectPath(me.path);
    me.vpath = path;
    if (me.path.type === "path") {
      path_str = path.svgString();
      return me.svgPath.attr({
        path: path_str
      });
    } else if (me.path.type === "circle") {
      return me.svgPath.attr({
        cx: path.x,
        cy: path.y,
        r: path.r
      });
    }
  };

  MapLayerPath.prototype.remove = function() {
    var me;
    me = this;
    return me.svgPath.remove();
  };

  return MapLayerPath;

})();


/*
    kartograph - a svg mapping library 
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */

/*
    This is a reduced version of Danial Wachsstocks jQuery based CSS parser
    Everything is removed but the core css-to-object parsing

    jQuery based CSS parser
    documentation: http://youngisrael-stl.org/wordpress/2009/01/16/jquery-css-parser/
    Version: 1.3
    Copyright (c) 2011 Daniel Wachsstock
    MIT license:
    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
 */
var REbraces, REcomment_string, REfull, REmunged, munge, munged, parsedeclarations, restore, uid;

kartograph.parsecss = function(str, callback) {
  var css, i, k, len, props, ref, ret, v;
  ret = {};
  str = munge(str);
  ref = str.split('`b%');
  for (i = 0, len = ref.length; i < len; i++) {
    css = ref[i];
    css = css.split('%b`');
    if (css.length < 2) {
      continue;
    }
    css[0] = restore(css[0]);
    props = parsedeclarations(css[1]);
    if (ret[css[0]] != null) {
      for (k in props) {
        v = props[k];
        ret[css[0]][k] = v;
      }
    } else {
      ret[css[0]] = props;
    }
  }
  if (__type(callback) === 'function') {
    callback(ret);
  } else {
    return ret;
  }
};

munged = {};

parsedeclarations = function(index) {
  var decl, i, len, parsed, ref, str;
  str = munged[index].replace(/^{|}$/g, '');
  str = munge(str);
  parsed = {};
  ref = str.split(';');
  for (i = 0, len = ref.length; i < len; i++) {
    decl = ref[i];
    decl = decl.split(':');
    if (decl.length < 2) {
      continue;
    }
    parsed[restore(decl[0])] = restore(decl.slice(1).join(':'));
  }
  return parsed;
};

REbraces = /{[^{}]*}/;

REfull = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/;

REcomment_string = /(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;

REmunged = /%\w`(\d+)`\w%/;

uid = 0;

munge = function(str, full) {
  var RE, match, replacement;
  str = str.replace(REcomment_string, function(s, string) {
    var replacement;
    if (!string) {
      return '';
    }
    replacement = '%s`' + (++uid) + '`s%';
    munged[uid] = string.replace(/^\\/, '');
    return replacement;
  });
  RE = full ? REfull : REbraces;
  while (match = RE.exec(str)) {
    replacement = '%b`' + (++uid) + '`b%';
    munged[uid] = match[0];
    str = str.replace(RE, replacement);
  }
  return str;
};

restore = function(str) {
  var match;
  if (str == null) {
    return str;
  }
  while (match = REmunged.exec(str)) {
    str = str.replace(REmunged, munged[match[1]]);
  }
  return str.trim();
};


/*
    kartograph - a svg mapping library
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var Circle, Line, Path, __point_in_polygon,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

if (kartograph.geom == null) {
  kartograph.geom = {};
}

Path = (function() {

  /*
  	represents complex polygons (aka multi-polygons)
   */
  function Path(type, contours, closed) {
    var self;
    if (closed == null) {
      closed = true;
    }
    self = this;
    self.type = type;
    self.contours = contours;
    self.closed = closed;
  }

  Path.prototype.clipToBBox = function(bbox) {
    throw "path clipping is not implemented yet";
  };

  Path.prototype.toSVG = function(paper) {

    /* translates this path to a SVG path string */
    var str;
    str = this.svgString();
    return paper.path(str);
  };

  Path.prototype.svgString = function() {
    var contour, fst, glue, len1, len2, me, o, q, ref, ref1, str, x, y;
    me = this;
    str = "";
    glue = me.closed ? "Z M" : "M";
    ref = me.contours;
    for (o = 0, len1 = ref.length; o < len1; o++) {
      contour = ref[o];
      fst = true;
      str += str === "" ? "M" : glue;
      for (q = 0, len2 = contour.length; q < len2; q++) {
        ref1 = contour[q], x = ref1[0], y = ref1[1];
        if (!fst) {
          str += "L";
        }
        str += x + ',' + y;
        fst = false;
      }
    }
    if (me.closed) {
      str += "Z";
    }
    return str;
  };

  Path.prototype.area = function() {
    var area, cnt, i, len1, me, o, q, ref, ref1;
    me = this;
    if (me.areas != null) {
      return me._area;
    }
    me.areas = [];
    me._area = 0;
    ref = me.contours;
    for (o = 0, len1 = ref.length; o < len1; o++) {
      cnt = ref[o];
      area = 0;
      for (i = q = 0, ref1 = cnt.length - 2; 0 <= ref1 ? q <= ref1 : q >= ref1; i = 0 <= ref1 ? ++q : --q) {
        area += cnt[i][0] * cnt[i + 1][1] - cnt[i + 1][0] * cnt[i][1];
      }
      area *= .5;
      area = area;
      me.areas.push(area);
      me._area += area;
    }
    return me._area;
  };

  Path.prototype.centroid = function() {
    var S, _lengths, a, area, cnt, cnt_orig, cx, cy, diff, dx, dy, i, j, k, l, len, me, o, p0, p1, q, ref, ref1, ref2, ref3, ref4, s, sp, t, total_len, u, v, w, x, x_, y, y_;
    me = this;
    if (me._centroid != null) {
      return me._centroid;
    }
    area = me.area();
    cx = cy = 0;
    for (i = o = 0, ref = me.contours.length - 1; 0 <= ref ? o <= ref : o >= ref; i = 0 <= ref ? ++o : --o) {
      cnt_orig = me.contours[i];
      cnt = [];
      l = cnt_orig.length;
      for (j = q = 0, ref1 = l - 1; 0 <= ref1 ? q <= ref1 : q >= ref1; j = 0 <= ref1 ? ++q : --q) {
        p0 = cnt_orig[j];
        p1 = cnt_orig[(j + 1) % l];
        diff = 0;
        cnt.push(p0);
        if (p0[0] === p1[0]) {
          diff = Math.abs(p0[1] - p1[1]);
        }
        if (p0[1] === p1[1]) {
          diff = Math.abs(p0[0] - p1[0]);
        }
        if (diff > 10) {
          S = Math.floor(diff * 2);
          for (s = t = 1, ref2 = S - 1; 1 <= ref2 ? t <= ref2 : t >= ref2; s = 1 <= ref2 ? ++t : --t) {
            sp = [p0[0] + s / S * (p1[0] - p0[0]), p0[1] + s / S * (p1[1] - p0[1])];
            cnt.push(sp);
          }
        }
      }
      a = me.areas[i];
      x = y = x_ = y_ = 0;
      l = cnt.length;
      _lengths = [];
      total_len = 0;
      for (j = u = 0, ref3 = l - 1; 0 <= ref3 ? u <= ref3 : u >= ref3; j = 0 <= ref3 ? ++u : --u) {
        p0 = cnt[j];
        p1 = cnt[(j + 1) % l];
        dx = p1[0] - p0[0];
        dy = p1[1] - p0[1];
        len = Math.sqrt(dx * dx + dy * dy);
        _lengths.push(len);
        total_len += len;
      }
      for (j = v = 0, ref4 = l - 1; 0 <= ref4 ? v <= ref4 : v >= ref4; j = 0 <= ref4 ? ++v : --v) {
        p0 = cnt[j];
        w = _lengths[j] / total_len;
        x += w * p0[0];
        y += w * p0[1];
      }
      k = a / area;
      cx += x * k;
      cy += y * k;
    }
    me._centroid = [cx, cy];
    return me._centroid;
  };

  Path.prototype.isInside = function(x, y) {
    var bbox, cnt, i, me, o, ref;
    me = this;
    bbox = me._bbox;
    if (x < bbox[0] || x > bbox[2] || y < bbox[1] || y > bbox[3]) {
      return false;
    }
    for (i = o = 0, ref = me.contours.length - 1; 0 <= ref ? o <= ref : o >= ref; i = 0 <= ref ? ++o : --o) {
      cnt = me.contours[i];
      if (__point_in_polygon(cnt, [x, y])) {
        return true;
      }
    }
    return false;
  };

  return Path;

})();

kartograph.geom.Path = Path;

Circle = (function(superClass) {
  extend(Circle, superClass);

  function Circle(x3, y3, r1) {
    this.x = x3;
    this.y = y3;
    this.r = r1;
    Circle.__super__.constructor.call(this, 'circle', null, true);
  }

  Circle.prototype.toSVG = function(paper) {
    var me;
    me = this;
    return paper.circle(me.x, me.y, me.r);
  };

  Circle.prototype.centroid = function() {
    var me;
    me = this;
    return [me.x, me.y];
  };

  Circle.prototype.area = function() {
    var me;
    me = this;
    return Math.PI * me.r * m.r;
  };

  return Circle;

})(Path);

kartograph.geom.Circle = Circle;

Path.fromSVG = function(path) {

  /*
  	loads a path from a SVG path string
   */
  var closed, cmd, contour, contours, cx, cy, len1, o, path_data, path_str, r, res, sep, type;
  contours = [];
  type = path.nodeName;
  res = null;
  if (type === "path") {
    path_str = path.getAttribute('d').trim();
    path_data = Raphael.parsePathString(path_str);
    closed = path_data[path_data.length - 1] === "Z";
    sep = closed ? "Z M" : "M";
    contour = [];
    for (o = 0, len1 = path_data.length; o < len1; o++) {
      cmd = path_data[o];
      if (cmd.length === 0) {
        continue;
      }
      if (cmd[0] === "M") {
        if (contour.length > 2) {
          contours.push(contour);
          contour = [];
        }
        contour.push([cmd[1], cmd[2]]);
      } else if (cmd[0] === "L") {
        contour.push([cmd[1], cmd[2]]);
      } else if (cmd[0] === "Z") {
        if (contour.length > 2) {
          contours.push(contour);
          contour = [];
        }
      }
    }
    if (contour.length >= 2) {
      contours.push(contour);
      contour = [];
    }
    res = new kartograph.geom.Path(type, contours, closed);
  } else if (type === "circle") {
    cx = path.getAttribute("cx");
    cy = path.getAttribute("cy");
    r = path.getAttribute("r");
    res = new kartograph.geom.Circle(cx, cy, r);
  }
  return res;
};

Line = (function() {

  /*
  	represents simple lines
   */
  function Line(points) {
    this.points = points;
  }

  Line.prototype.clipToBBox = function(bbox) {
    var clip, err, error, i, last_in, lines, o, p0x, p0y, p1x, p1y, pts, ref, ref1, ref2, ref3, self, x0, x1, y0, y1;
    self = this;
    clip = new kartograph.geom.clipping.CohenSutherland().clip;
    pts = [];
    lines = [];
    last_in = false;
    for (i = o = 0, ref = self.points.length - 2; 0 <= ref ? o <= ref : o >= ref; i = 0 <= ref ? ++o : --o) {
      ref1 = self.points[i], p0x = ref1[0], p0y = ref1[1];
      ref2 = self.points[i + 1], p1x = ref2[0], p1y = ref2[1];
      try {
        ref3 = clip(bbox, p0x, p0y, p1x, p1y), x0 = ref3[0], y0 = ref3[1], x1 = ref3[2], y1 = ref3[3];
        last_in = true;
        pts.push([x0, y0]);
        if (p1x !== x1 || p1y !== y0 || i === len(self.points) - 2) {
          pts.push([x1, y1]);
        }
      } catch (error) {
        err = error;
        if (last_in && pts.length > 1) {
          lines.push(new Line(pts));
          pts = [];
        }
        last_in = false;
      }
    }
    if (pts.length > 1) {
      lines.push(new Line(pts));
    }
    return lines;
  };

  Line.prototype.toSVG = function() {
    var len1, o, pts, ref, ref1, self, x, y;
    self = this;
    pts = [];
    ref = self.points;
    for (o = 0, len1 = ref.length; o < len1; o++) {
      ref1 = ref[o], x = ref1[0], y = ref1[1];
      pts.push(x + ',' + y);
    }
    return 'M' + pts.join('L');
  };

  return Line;

})();

kartograph.geom.Line = Line;

__point_in_polygon = function(polygon, p) {
  var angle, atan2, dtheta, i, n, o, pi, ref, theta1, theta2, twopi, x1, x2, y1, y2;
  pi = Math.PI;
  atan2 = Math.atan2;
  twopi = pi * 2;
  n = polygon.length;
  angle = 0;
  for (i = o = 0, ref = n - 1; 0 <= ref ? o <= ref : o >= ref; i = 0 <= ref ? ++o : --o) {
    x1 = polygon[i][0] - p[0];
    y1 = polygon[i][1] - p[1];
    x2 = polygon[(i + 1) % n][0] - p[0];
    y2 = polygon[(i + 1) % n][1] - p[1];
    theta1 = atan2(y1, x1);
    theta2 = atan2(y2, x2);
    dtheta = theta2 - theta1;
    while (dtheta > pi) {
      dtheta -= twopi;
    }
    while (dtheta < -pi) {
      dtheta += twopi;
    }
    angle += dtheta;
  }
  return Math.abs(angle) >= pi;
};


/*
    kartograph - a svg mapping library
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var Aitoff, Azimuthal, Balthasart, Behrmann, CEA, CantersModifiedSinusoidalI, Conic, Cylindrical, EckertIV, EquidistantAzimuthal, Equirectangular, GallPeters, GoodeHomolosine, Hatano, HoboDyer, LAEA, LCC, Loximuthal, Mercator, Mollweide, NaturalEarth, Nicolosi, Orthographic, Proj, PseudoConic, PseudoCylindrical, Robinson, Satellite, Sinusoidal, Stereographic, WagnerIV, WagnerV, Winkel3, __proj,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

__proj = kartograph.proj = {};

Function.prototype.bind = function(scope) {
  var _function;
  _function = this;
  return function() {
    return _function.apply(scope, arguments);
  };
};

Proj = (function() {
  Proj.parameters = [];

  Proj.title = "Projection";

  function Proj(opts) {
    var me, ref, ref1;
    me = this;
    me.lon0 = (ref = opts.lon0) != null ? ref : 0;
    me.lat0 = (ref1 = opts.lat0) != null ? ref1 : 0;
    me.PI = Math.PI;
    me.HALFPI = me.PI * .5;
    me.QUARTERPI = me.PI * .25;
    me.RAD = me.PI / 180;
    me.DEG = 180 / me.PI;
    me.lam0 = me.rad(this.lon0);
    me.phi0 = me.rad(this.lat0);
    me.minLat = -90;
    me.maxLat = 90;
  }

  Proj.prototype.rad = function(a) {
    return a * this.RAD;
  };

  Proj.prototype.deg = function(a) {
    return a * this.DEG;
  };

  Proj.prototype.plot = function(polygon, truncate) {
    var ignore, j, lat, len, lon, points, ref, ref1, vis, x, y;
    if (truncate == null) {
      truncate = true;
    }
    points = [];
    ignore = true;
    for (j = 0, len = polygon.length; j < len; j++) {
      ref = polygon[j], lon = ref[0], lat = ref[1];
      vis = this._visible(lon, lat);
      if (vis) {
        ignore = false;
      }
      ref1 = this.project(lon, lat), x = ref1[0], y = ref1[1];
      if (!vis && truncate) {
        points.push(this._truncate(x, y));
      } else {
        points.push([x, y]);
      }
    }
    if (ignore) {
      return null;
    } else {
      return [points];
    }
  };

  Proj.prototype.sea = function() {
    var j, l, l0, lat, lon, o, p, q, ref, ref1, ref2, ref3, s, t;
    s = this;
    p = s.project.bind(this);
    o = [];
    l0 = s.lon0;
    s.lon0 = 0;
    for (lon = j = -180; j <= 180; lon = ++j) {
      o.push(p(lon, s.maxLat));
    }
    for (lat = l = ref = s.maxLat, ref1 = s.minLat; ref <= ref1 ? l <= ref1 : l >= ref1; lat = ref <= ref1 ? ++l : --l) {
      o.push(p(180, lat));
    }
    for (lon = q = 180; q >= -180; lon = --q) {
      o.push(p(lon, s.minLat));
    }
    for (lat = t = ref2 = s.minLat, ref3 = s.maxLat; ref2 <= ref3 ? t <= ref3 : t >= ref3; lat = ref2 <= ref3 ? ++t : --t) {
      o.push(p(-180, lat));
    }
    s.lon0 = l0;
    return o;
  };

  Proj.prototype.world_bbox = function() {
    var bbox, j, len, p, s, sea;
    p = this.project.bind(this);
    sea = this.sea();
    bbox = new kartograph.BBox();
    for (j = 0, len = sea.length; j < len; j++) {
      s = sea[j];
      bbox.update(s[0], s[1]);
    }
    return bbox;
  };

  Proj.prototype.toString = function() {
    var me;
    me = this;
    return '[Proj: ' + me.name + ']';
  };

  return Proj;

})();

Proj.fromXML = function(xml) {

  /*
  reconstructs a projection from xml description
   */
  var attr, i, id, j, opts, proj, ref;
  id = xml.getAttribute('id');
  opts = {};
  for (i = j = 0, ref = xml.attributes.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    attr = xml.attributes[i];
    if (attr.name !== "id") {
      opts[attr.name] = attr.value;
    }
  }
  proj = new kartograph.proj[id](opts);
  proj.name = id;
  return proj;
};

kartograph.Proj = Proj;

Cylindrical = (function(superClass) {

  /*
  Base class for cylindrical projections
   */
  extend(Cylindrical, superClass);

  Cylindrical.parameters = ['lon0', 'flip'];

  Cylindrical.title = "Cylindrical Projection";

  function Cylindrical(opts) {
    var me, ref, ref1;
    if (opts == null) {
      opts = {};
    }
    me = this;
    me.flip = Number((ref = opts.flip) != null ? ref : 0);
    if (me.flip === 1) {
      opts.lon0 = (ref1 = -opts.lon0) != null ? ref1 : 0;
    }
    Cylindrical.__super__.constructor.call(this, opts);
  }

  Cylindrical.prototype._visible = function(lon, lat) {
    return true;
  };

  Cylindrical.prototype.clon = function(lon) {
    lon -= this.lon0;
    if (lon < -180) {
      lon += 360;
    } else if (lon > 180) {
      lon -= 360;
    }
    return lon;
  };

  Cylindrical.prototype.ll = function(lon, lat) {
    if (this.flip === 1) {
      return [-lon, -lat];
    } else {
      return [lon, lat];
    }
  };

  return Cylindrical;

})(Proj);

Equirectangular = (function(superClass) {

  /*
  Equirectangular Projection aka Lonlat aka Plate Carree
   */
  extend(Equirectangular, superClass);

  function Equirectangular() {
    return Equirectangular.__super__.constructor.apply(this, arguments);
  }

  Equirectangular.title = "Equirectangular Projection";

  Equirectangular.prototype.project = function(lon, lat) {
    var ref;
    ref = this.ll(lon, lat), lon = ref[0], lat = ref[1];
    lon = this.clon(lon);
    return [lon * Math.cos(this.phi0) * 1000, lat * -1 * 1000];
  };

  return Equirectangular;

})(Cylindrical);

__proj['lonlat'] = Equirectangular;

CEA = (function(superClass) {
  extend(CEA, superClass);

  CEA.parameters = ['lon0', 'lat1', 'flip'];

  CEA.title = "Cylindrical Equal Area";

  function CEA(opts) {
    var ref;
    CEA.__super__.constructor.call(this, opts);
    this.lat1 = (ref = opts.lat1) != null ? ref : 0;
    this.phi1 = this.rad(this.lat1);
  }


  /*
  Cylindrical Equal Area Projection
   */

  CEA.prototype.project = function(lon, lat) {
    var lam, phi, ref, x, y;
    ref = this.ll(lon, lat), lon = ref[0], lat = ref[1];
    lam = this.rad(this.clon(lon));
    phi = this.rad(lat * -1);
    x = lam * Math.cos(this.phi1);
    y = Math.sin(phi) / Math.cos(this.phi1);
    return [x * 1000, y * 1000];
  };

  return CEA;

})(Cylindrical);

__proj['cea'] = CEA;

GallPeters = (function(superClass) {

  /*
  Gall-Peters Projection
   */
  extend(GallPeters, superClass);

  GallPeters.title = "Gall-Peters Projection";

  GallPeters.parameters = ['lon0', 'flip'];

  function GallPeters(opts) {
    opts.lat1 = 45;
    GallPeters.__super__.constructor.call(this, opts);
  }

  return GallPeters;

})(CEA);

__proj['gallpeters'] = GallPeters;

HoboDyer = (function(superClass) {

  /*
  Hobo-Dyer Projection
   */
  extend(HoboDyer, superClass);

  HoboDyer.title = "Hobo-Dyer Projection";

  HoboDyer.parameters = ['lon0', 'flip'];

  function HoboDyer(opts) {
    opts.lat1 = 37.7;
    HoboDyer.__super__.constructor.call(this, opts);
  }

  return HoboDyer;

})(CEA);

__proj['hobodyer'] = HoboDyer;

Behrmann = (function(superClass) {

  /*
  Behrmann Projection
   */
  extend(Behrmann, superClass);

  Behrmann.title = "Behrmann Projection";

  Behrmann.parameters = ['lon0', 'flip'];

  function Behrmann(opts) {
    opts.lat1 = 30;
    Behrmann.__super__.constructor.call(this, opts);
  }

  return Behrmann;

})(CEA);

__proj['behrmann'] = Behrmann;

Balthasart = (function(superClass) {

  /*
  Balthasart Projection
   */
  extend(Balthasart, superClass);

  Balthasart.title = "Balthasart Projection";

  Balthasart.parameters = ['lon0', 'flip'];

  function Balthasart(opts) {
    opts.lat1 = 50;
    Balthasart.__super__.constructor.call(this, opts);
  }

  return Balthasart;

})(CEA);

__proj['balthasart'] = Balthasart;

Mercator = (function(superClass) {

  /*
   * you're not really into maps..
   */
  extend(Mercator, superClass);

  Mercator.title = "Mercator Projection";

  function Mercator(opts) {
    Mercator.__super__.constructor.call(this, opts);
    this.minLat = -85;
    this.maxLat = 85;
  }

  Mercator.prototype.project = function(lon, lat) {
    var lam, math, phi, ref, s, x, y;
    s = this;
    ref = s.ll(lon, lat), lon = ref[0], lat = ref[1];
    math = Math;
    lam = s.rad(s.clon(lon));
    phi = s.rad(lat * -1);
    x = lam * 1000;
    y = math.log((1 + math.sin(phi)) / math.cos(phi)) * 1000;
    return [x, y];
  };

  return Mercator;

})(Cylindrical);

__proj['mercator'] = Mercator;

PseudoCylindrical = (function(superClass) {

  /*
  Base class for pseudo cylindrical projections
   */
  extend(PseudoCylindrical, superClass);

  function PseudoCylindrical() {
    return PseudoCylindrical.__super__.constructor.apply(this, arguments);
  }

  PseudoCylindrical.title = "Pseudo-Cylindrical Projection";

  return PseudoCylindrical;

})(Cylindrical);

NaturalEarth = (function(superClass) {

  /*
  Natural Earth Projection
  see here http://www.shadedrelief.com/NE_proj/
   */
  extend(NaturalEarth, superClass);

  NaturalEarth.title = "Natural Earth Projection";

  function NaturalEarth(opts) {
    var s;
    NaturalEarth.__super__.constructor.call(this, opts);
    s = this;
    s.A0 = 0.8707;
    s.A1 = -0.131979;
    s.A2 = -0.013791;
    s.A3 = 0.003971;
    s.A4 = -0.001529;
    s.B0 = 1.007226;
    s.B1 = 0.015085;
    s.B2 = -0.044475;
    s.B3 = 0.028874;
    s.B4 = -0.005916;
    s.C0 = s.B0;
    s.C1 = 3 * s.B1;
    s.C2 = 7 * s.B2;
    s.C3 = 9 * s.B3;
    s.C4 = 11 * s.B4;
    s.EPS = 1e-11;
    s.MAX_Y = 0.8707 * 0.52 * Math.PI;
    return;
  }

  NaturalEarth.prototype.project = function(lon, lat) {
    var lplam, lpphi, phi2, phi4, ref, s, x, y;
    s = this;
    ref = s.ll(lon, lat), lon = ref[0], lat = ref[1];
    lplam = s.rad(s.clon(lon));
    lpphi = s.rad(lat * -1);
    phi2 = lpphi * lpphi;
    phi4 = phi2 * phi2;
    x = lplam * (s.A0 + phi2 * (s.A1 + phi2 * (s.A2 + phi4 * phi2 * (s.A3 + phi2 * s.A4)))) * 180 + 500;
    y = lpphi * (s.B0 + phi2 * (s.B1 + phi4 * (s.B2 + s.B3 * phi2 + s.B4 * phi4))) * 180 + 270;
    return [x, y];
  };

  return NaturalEarth;

})(PseudoCylindrical);

__proj['naturalearth'] = NaturalEarth;

Robinson = (function(superClass) {

  /*
  Robinson Projection
   */
  extend(Robinson, superClass);

  Robinson.title = "Robinson Projection";

  function Robinson(opts) {
    var s;
    Robinson.__super__.constructor.call(this, opts);
    s = this;
    s.X = [1, -5.67239e-12, -7.15511e-05, 3.11028e-06, 0.9986, -0.000482241, -2.4897e-05, -1.33094e-06, 0.9954, -0.000831031, -4.4861e-05, -9.86588e-07, 0.99, -0.00135363, -5.96598e-05, 3.67749e-06, 0.9822, -0.00167442, -4.4975e-06, -5.72394e-06, 0.973, -0.00214869, -9.03565e-05, 1.88767e-08, 0.96, -0.00305084, -9.00732e-05, 1.64869e-06, 0.9427, -0.00382792, -6.53428e-05, -2.61493e-06, 0.9216, -0.00467747, -0.000104566, 4.8122e-06, 0.8962, -0.00536222, -3.23834e-05, -5.43445e-06, 0.8679, -0.00609364, -0.0001139, 3.32521e-06, 0.835, -0.00698325, -6.40219e-05, 9.34582e-07, 0.7986, -0.00755337, -5.00038e-05, 9.35532e-07, 0.7597, -0.00798325, -3.59716e-05, -2.27604e-06, 0.7186, -0.00851366, -7.0112e-05, -8.63072e-06, 0.6732, -0.00986209, -0.000199572, 1.91978e-05, 0.6213, -0.010418, 8.83948e-05, 6.24031e-06, 0.5722, -0.00906601, 0.000181999, 6.24033e-06, 0.5322, 0, 0, 0];
    s.Y = [0, 0.0124, 3.72529e-10, 1.15484e-09, 0.062, 0.0124001, 1.76951e-08, -5.92321e-09, 0.124, 0.0123998, -7.09668e-08, 2.25753e-08, 0.186, 0.0124008, 2.66917e-07, -8.44523e-08, 0.248, 0.0123971, -9.99682e-07, 3.15569e-07, 0.31, 0.0124108, 3.73349e-06, -1.1779e-06, 0.372, 0.0123598, -1.3935e-05, 4.39588e-06, 0.434, 0.0125501, 5.20034e-05, -1.00051e-05, 0.4968, 0.0123198, -9.80735e-05, 9.22397e-06, 0.5571, 0.0120308, 4.02857e-05, -5.2901e-06, 0.6176, 0.0120369, -3.90662e-05, 7.36117e-07, 0.6769, 0.0117015, -2.80246e-05, -8.54283e-07, 0.7346, 0.0113572, -4.08389e-05, -5.18524e-07, 0.7903, 0.0109099, -4.86169e-05, -1.0718e-06, 0.8435, 0.0103433, -6.46934e-05, 5.36384e-09, 0.8936, 0.00969679, -6.46129e-05, -8.54894e-06, 0.9394, 0.00840949, -0.000192847, -4.21023e-06, 0.9761, 0.00616525, -0.000256001, -4.21021e-06, 1, 0, 0, 0];
    s.NODES = 18;
    s.FXC = 0.8487;
    s.FYC = 1.3523;
    s.C1 = 11.45915590261646417544;
    s.RC1 = 0.08726646259971647884;
    s.ONEEPS = 1.000001;
    s.EPS = 1e-8;
    return;
  }

  Robinson.prototype._poly = function(arr, offs, z) {
    return arr[offs] + z * (arr[offs + 1] + z * (arr[offs + 2] + z * arr[offs + 3]));
  };

  Robinson.prototype.project = function(lon, lat) {
    var i, lplam, lpphi, phi, ref, s, x, y;
    s = this;
    ref = s.ll(lon, lat), lon = ref[0], lat = ref[1];
    lon = s.clon(lon);
    lplam = s.rad(lon);
    lpphi = s.rad(lat * -1);
    phi = Math.abs(lpphi);
    i = Math.floor(phi * s.C1);
    if (i >= s.NODES) {
      i = s.NODES - 1;
    }
    phi = s.deg(phi - s.RC1 * i);
    i *= 4;
    x = 1000 * s._poly(s.X, i, phi) * s.FXC * lplam;
    y = 1000 * s._poly(s.Y, i, phi) * s.FYC;
    if (lpphi < 0.0) {
      y = -y;
    }
    return [x, y];
  };

  return Robinson;

})(PseudoCylindrical);

__proj['robinson'] = Robinson;

EckertIV = (function(superClass) {

  /*
  Eckert IV Projection
   */
  extend(EckertIV, superClass);

  EckertIV.title = "Eckert IV Projection";

  function EckertIV(opts) {
    var me;
    EckertIV.__super__.constructor.call(this, opts);
    me = this;
    me.C_x = .42223820031577120149;
    me.C_y = 1.32650042817700232218;
    me.RC_y = .75386330736002178205;
    me.C_p = 3.57079632679489661922;
    me.RC_p = .28004957675577868795;
    me.EPS = 1e-7;
    me.NITER = 6;
  }

  EckertIV.prototype.project = function(lon, lat) {
    var V, c, i, lplam, lpphi, me, p, ref, s, x, y;
    me = this;
    ref = me.ll(lon, lat), lon = ref[0], lat = ref[1];
    lplam = me.rad(me.clon(lon));
    lpphi = me.rad(lat * -1);
    p = me.C_p * Math.sin(lpphi);
    V = lpphi * lpphi;
    lpphi *= 0.895168 + V * (0.0218849 + V * 0.00826809);
    i = me.NITER;
    while (i > 0) {
      c = Math.cos(lpphi);
      s = Math.sin(lpphi);
      V = (lpphi + s * (c + 2) - p) / (1 + c * (c + 2) - s * s);
      lpphi -= V;
      if (Math.abs(V) < me.EPS) {
        break;
      }
      i -= 1;
    }
    if (i === 0) {
      x = me.C_x * lplam;
      y = lpphi < 0 ? -me.C_y : me.C_y;
    } else {
      x = me.C_x * lplam * (1 + Math.cos(lpphi));
      y = me.C_y * Math.sin(lpphi);
    }
    return [x, y];
  };

  return EckertIV;

})(PseudoCylindrical);

__proj['eckert4'] = EckertIV;

Sinusoidal = (function(superClass) {

  /*
  Sinusoidal Projection
   */
  extend(Sinusoidal, superClass);

  function Sinusoidal() {
    return Sinusoidal.__super__.constructor.apply(this, arguments);
  }

  Sinusoidal.title = "Sinusoidal Projection";

  Sinusoidal.prototype.project = function(lon, lat) {
    var lam, me, phi, ref, x, y;
    me = this;
    ref = me.ll(lon, lat), lon = ref[0], lat = ref[1];
    lam = me.rad(me.clon(lon));
    phi = me.rad(lat * -1);
    x = 1032 * lam * Math.cos(phi);
    y = 1032 * phi;
    return [x, y];
  };

  return Sinusoidal;

})(PseudoCylindrical);

__proj['sinusoidal'] = Sinusoidal;

Mollweide = (function(superClass) {

  /*
  Mollweide Projection
   */
  extend(Mollweide, superClass);

  Mollweide.title = "Mollweide Projection";

  function Mollweide(opts, p, cx, cy, cp) {
    var me, p2, r, sp;
    if (p == null) {
      p = 1.5707963267948966;
    }
    if (cx == null) {
      cx = null;
    }
    if (cy == null) {
      cy = null;
    }
    if (cp == null) {
      cp = null;
    }
    Mollweide.__super__.constructor.call(this, opts);
    me = this;
    me.MAX_ITER = 10;
    me.TOLERANCE = 1e-7;
    if (p != null) {
      p2 = p + p;
      sp = Math.sin(p);
      r = Math.sqrt(Math.PI * 2.0 * sp / (p2 + Math.sin(p2)));
      me.cx = 2 * r / Math.PI;
      me.cy = r / sp;
      me.cp = p2 + Math.sin(p2);
    } else if ((cx != null) && (cy != null) && (typeof cz !== "undefined" && cz !== null)) {
      me.cx = cx;
      me.cy = cy;
      me.cp = cp;
    } else {
      warn('kartograph.proj.Mollweide: either p or cx,cy,cp must be defined');
    }
  }

  Mollweide.prototype.project = function(lon, lat) {
    var abs, i, k, lam, math, me, phi, ref, v, x, y;
    me = this;
    ref = me.ll(lon, lat), lon = ref[0], lat = ref[1];
    math = Math;
    abs = math.abs;
    lam = me.rad(me.clon(lon));
    phi = me.rad(lat);
    k = me.cp * math.sin(phi);
    i = me.MAX_ITER;
    while (i !== 0) {
      v = (phi + math.sin(phi) - k) / (1 + math.cos(phi));
      phi -= v;
      if (abs(v) < me.TOLERANCE) {
        break;
      }
      i -= 1;
    }
    if (i === 0) {
      phi = phi >= 0 ? me.HALFPI : -me.HALFPI;
    } else {
      phi *= 0.5;
    }
    x = 1000 * me.cx * lam * math.cos(phi);
    y = 1000 * me.cy * math.sin(phi);
    return [x, y * -1];
  };

  return Mollweide;

})(PseudoCylindrical);

__proj['mollweide'] = Mollweide;

WagnerIV = (function(superClass) {

  /*
  Wagner IV Projection
   */
  extend(WagnerIV, superClass);

  WagnerIV.title = "Wagner IV Projection";

  function WagnerIV(opts) {
    WagnerIV.__super__.constructor.call(this, opts, 1.0471975511965976);
  }

  return WagnerIV;

})(Mollweide);

__proj['wagner4'] = WagnerIV;

WagnerV = (function(superClass) {

  /*
  Wagner V Projection
   */
  extend(WagnerV, superClass);

  WagnerV.title = "Wagner V Projection";

  function WagnerV(opts) {
    WagnerV.__super__.constructor.call(this, opts, null, 0.90977, 1.65014, 3.00896);
  }

  return WagnerV;

})(Mollweide);

__proj['wagner5'] = WagnerV;

Loximuthal = (function(superClass) {
  var maxLat, minLat;

  extend(Loximuthal, superClass);

  function Loximuthal() {
    return Loximuthal.__super__.constructor.apply(this, arguments);
  }

  minLat = -89;

  maxLat = 89;

  Loximuthal.parameters = ['lon0', 'lat0', 'flip'];

  Loximuthal.title = "Loximuthal Projection (equidistant)";

  Loximuthal.prototype.project = function(lon, lat) {
    var lam, math, me, phi, ref, x, y;
    me = this;
    ref = me.ll(lon, lat), lon = ref[0], lat = ref[1];
    math = Math;
    lam = me.rad(me.clon(lon));
    phi = me.rad(lat);
    if (phi === me.phi0) {
      x = lam * math.cos(me.phi0);
    } else {
      x = lam * (phi - me.phi0) / (math.log(math.tan(me.QUARTERPI + phi * 0.5)) - math.log(math.tan(me.QUARTERPI + me.phi0 * 0.5)));
    }
    x *= 1000;
    y = 1000 * (phi - me.phi0);
    return [x, y * -1];
  };

  return Loximuthal;

})(PseudoCylindrical);

__proj['loximuthal'] = Loximuthal;

CantersModifiedSinusoidalI = (function(superClass) {

  /*
  Canters, F. (2002) Small-scale Map projection Design. p. 218-219.
  Modified Sinusoidal, equal-area.
  
  implementation borrowed from
  http://cartography.oregonstate.edu/temp/AdaptiveProjection/src/projections/Canters1.js
   */
  var C1, C3, C3x3, C5, C5x5;

  extend(CantersModifiedSinusoidalI, superClass);

  function CantersModifiedSinusoidalI() {
    return CantersModifiedSinusoidalI.__super__.constructor.apply(this, arguments);
  }

  CantersModifiedSinusoidalI.title = "Canters Modified Sinusoidal I";

  CantersModifiedSinusoidalI.parameters = ['lon0'];

  C1 = 1.1966;

  C3 = -0.1290;

  C3x3 = 3 * C3;

  C5 = -0.0076;

  C5x5 = 5 * C5;

  CantersModifiedSinusoidalI.prototype.project = function(lon, lat) {
    var me, ref, x, y, y2, y4;
    me = this;
    ref = me.ll(lon, lat), lon = ref[0], lat = ref[1];
    lon = me.rad(me.clon(lon));
    lat = me.rad(lat);
    y2 = lat * lat;
    y4 = y2 * y2;
    x = 1000 * lon * Math.cos(lat) / (C1 + C3x3 * y2 + C5x5 * y4);
    y = 1000 * lat * (C1 + C3 * y2 + C5 * y4);
    return [x, y * -1];
  };

  return CantersModifiedSinusoidalI;

})(PseudoCylindrical);

__proj['canters1'] = CantersModifiedSinusoidalI;

Hatano = (function(superClass) {
  var CN, CS, EPS, FXC, FYCN, FYCS, NITER, ONETOL, RCN, RCS, RXC, RYCN, RYCS;

  extend(Hatano, superClass);

  Hatano.title = "Hatano Projection";

  NITER = 20;

  EPS = 1e-7;

  ONETOL = 1.000001;

  CN = 2.67595;

  CS = 2.43763;

  RCN = 0.37369906014686373063;

  RCS = 0.41023453108141924738;

  FYCN = 1.75859;

  FYCS = 1.93052;

  RYCN = 0.56863737426006061674;

  RYCS = 0.51799515156538134803;

  FXC = 0.85;

  RXC = 1.17647058823529411764;

  function Hatano(opts) {
    Hatano.__super__.constructor.call(this, opts);
  }

  Hatano.prototype.project = function(lon, lat) {
    var c, i, j, lam, me, phi, ref, ref1, th1, x, y;
    me = this;
    ref = me.ll(lon, lat), lon = ref[0], lat = ref[1];
    lam = me.rad(me.clon(lon));
    phi = me.rad(lat);
    c = Math.sin(phi) * (phi < 0.0 ? CS : CN);
    for (i = j = ref1 = NITER; j >= 1; i = j += -1) {
      th1 = (phi + Math.sin(phi) - c) / (1.0 + Math.cos(phi));
      phi -= th1;
      if (Math.abs(th1) < EPS) {
        break;
      }
    }
    x = 1000 * FXC * lam * Math.cos(phi *= 0.5);
    y = 1000 * Math.sin(phi) * (phi < 0.0 ? FYCS : FYCN);
    return [x, y * -1];
  };

  return Hatano;

})(PseudoCylindrical);

__proj['hatano'] = Hatano;

GoodeHomolosine = (function(superClass) {
  extend(GoodeHomolosine, superClass);

  GoodeHomolosine.title = "Goode Homolosine Projection";

  GoodeHomolosine.parameters = ['lon0'];

  function GoodeHomolosine(opts) {
    var me;
    GoodeHomolosine.__super__.constructor.call(this, opts);
    me = this;
    me.lat1 = 41.737;
    me.p1 = new Mollweide();
    me.p0 = new Sinusoidal();
  }

  GoodeHomolosine.prototype.project = function(lon, lat) {
    var me, ref;
    me = this;
    ref = me.ll(lon, lat), lon = ref[0], lat = ref[1];
    lon = me.clon(lon);
    if (Math.abs(lat) > me.lat1) {
      return me.p1.project(lon, lat);
    } else {
      return me.p0.project(lon, lat);
    }
  };

  return GoodeHomolosine;

})(PseudoCylindrical);

__proj['goodehomolosine'] = GoodeHomolosine;

Nicolosi = (function(superClass) {
  var EPS;

  extend(Nicolosi, superClass);

  Nicolosi.title = "Nicolosi Globular Projection";

  Nicolosi.parameters = ['lon0'];

  EPS = 1e-10;

  function Nicolosi(opts) {
    Nicolosi.__super__.constructor.call(this, opts);
    this.r = this.HALFPI * 100;
  }

  Nicolosi.prototype._visible = function(lon, lat) {
    var me;
    me = this;
    lon = me.clon(lon);
    return lon > -90 && lon < 90;
  };

  Nicolosi.prototype.project = function(lon, lat) {
    var c, d, lam, m, me, n, phi, r2, ref, sp, tb, x, y;
    me = this;
    ref = me.ll(lon, lat), lon = ref[0], lat = ref[1];
    lam = me.rad(me.clon(lon));
    phi = me.rad(lat);
    if (Math.abs(lam) < EPS) {
      x = 0;
      y = phi;
    } else if (Math.abs(phi) < EPS) {
      x = lam;
      y = 0;
    } else if (Math.abs(Math.abs(lam) - me.HALFPI) < EPS) {
      x = lam * Math.cos(phi);
      y = me.HALFPI * Math.sin(phi);
    } else if (Math.abs(Math.abs(phi) - me.HALFPI) < EPS) {
      x = 0;
      y = phi;
    } else {
      tb = me.HALFPI / lam - lam / me.HALFPI;
      c = phi / me.HALFPI;
      sp = Math.sin(phi);
      d = (1 - c * c) / (sp - c);
      r2 = tb / d;
      r2 *= r2;
      m = (tb * sp / d - 0.5 * tb) / (1.0 + r2);
      n = (sp / r2 + 0.5 * d) / (1.0 + 1.0 / r2);
      x = Math.cos(phi);
      x = Math.sqrt(m * m + x * x / (1.0 + r2));
      x = me.HALFPI * (m + (lam < 0 ? -x : x));
      y = Math.sqrt(n * n - (sp * sp / r2 + d * sp - 1.0) / (1.0 + 1.0 / r2));
      y = me.HALFPI * (n + (phi < 0 ? y : -y));
    }
    return [x * 100, y * -100];
  };

  Nicolosi.prototype.sea = function() {
    var j, math, out, phi, r;
    out = [];
    r = this.r;
    math = Math;
    for (phi = j = 0; j <= 360; phi = ++j) {
      out.push([math.cos(this.rad(phi)) * r, math.sin(this.rad(phi)) * r]);
    }
    return out;
  };

  Nicolosi.prototype.world_bbox = function() {
    var r;
    r = this.r;
    return new kartograph.BBox(-r, -r, r * 2, r * 2);
  };

  return Nicolosi;

})(PseudoCylindrical);

__proj['nicolosi'] = Nicolosi;

Azimuthal = (function(superClass) {

  /*
  Base class for azimuthal projections
   */
  extend(Azimuthal, superClass);

  Azimuthal.parameters = ['lon0', 'lat0'];

  Azimuthal.title = "Azimuthal Projection";

  function Azimuthal(opts, rad) {
    var me;
    if (rad == null) {
      rad = 1000;
    }
    Azimuthal.__super__.constructor.call(this, opts);
    me = this;
    me.r = rad;
    me.elevation0 = me.to_elevation(me.lat0);
    me.azimuth0 = me.to_azimuth(me.lon0);
  }

  Azimuthal.prototype.to_elevation = function(lat) {
    var me;
    me = this;
    return ((lat + 90) / 180) * me.PI - me.HALFPI;
  };

  Azimuthal.prototype.to_azimuth = function(lon) {
    var me;
    me = this;
    return ((lon + 180) / 360) * me.PI * 2 - me.PI;
  };

  Azimuthal.prototype._visible = function(lon, lat) {
    var azimuth, cosc, elevation, math, me;
    me = this;
    math = Math;
    elevation = me.to_elevation(lat);
    azimuth = me.to_azimuth(lon);
    cosc = math.sin(elevation) * math.sin(me.elevation0) + math.cos(me.elevation0) * math.cos(elevation) * math.cos(azimuth - me.azimuth0);
    return cosc >= 0.0;
  };

  Azimuthal.prototype._truncate = function(x, y) {
    var math, r, theta, x1, y1;
    math = Math;
    r = this.r;
    theta = math.atan2(y - r, x - r);
    x1 = r + r * math.cos(theta);
    y1 = r + r * math.sin(theta);
    return [x1, y1];
  };

  Azimuthal.prototype.sea = function() {
    var j, math, out, phi, r;
    out = [];
    r = this.r;
    math = Math;
    for (phi = j = 0; j <= 360; phi = ++j) {
      out.push([r + math.cos(this.rad(phi)) * r, r + math.sin(this.rad(phi)) * r]);
    }
    return out;
  };

  Azimuthal.prototype.world_bbox = function() {
    var r;
    r = this.r;
    return new kartograph.BBox(0, 0, r * 2, r * 2);
  };

  return Azimuthal;

})(Proj);

Orthographic = (function(superClass) {

  /*
  Orthographic Azimuthal Projection
  
  implementation taken from http://www.mccarroll.net/snippets/svgworld/
   */
  extend(Orthographic, superClass);

  function Orthographic() {
    return Orthographic.__super__.constructor.apply(this, arguments);
  }

  Orthographic.title = "Orthographic Projection";

  Orthographic.prototype.project = function(lon, lat) {
    var azimuth, elevation, math, me, x, xo, y, yo;
    me = this;
    math = Math;
    elevation = me.to_elevation(lat);
    azimuth = me.to_azimuth(lon);
    xo = me.r * math.cos(elevation) * math.sin(azimuth - me.azimuth0);
    yo = -me.r * (math.cos(me.elevation0) * math.sin(elevation) - math.sin(me.elevation0) * math.cos(elevation) * math.cos(azimuth - me.azimuth0));
    x = me.r + xo;
    y = me.r + yo;
    return [x, y];
  };

  return Orthographic;

})(Azimuthal);

__proj['ortho'] = Orthographic;

LAEA = (function(superClass) {

  /*
  Lambert Azimuthal Equal-Area Projection
  
  implementation taken from
  Snyder, Map projections - A working manual
   */
  extend(LAEA, superClass);

  LAEA.title = "Lambert Azimuthal Equal-Area Projection";

  function LAEA(opts) {
    LAEA.__super__.constructor.call(this, opts);
    this.scale = Math.sqrt(2) * 0.5;
  }

  LAEA.prototype.project = function(lon, lat) {
    var cos, k, lam, math, phi, sin, x, xo, y, yo;
    phi = this.rad(lat);
    lam = this.rad(lon);
    math = Math;
    sin = math.sin;
    cos = math.cos;
    if (false && math.abs(lon - this.lon0) === 180) {
      xo = this.r * 2;
      yo = 0;
    } else {
      k = math.pow(2 / (1 + sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0)), .5);
      k *= this.scale;
      xo = this.r * k * cos(phi) * sin(lam - this.lam0);
      yo = -this.r * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
    }
    x = this.r + xo;
    y = this.r + yo;
    return [x, y];
  };

  return LAEA;

})(Azimuthal);

__proj['laea'] = LAEA;

Stereographic = (function(superClass) {

  /*
  Stereographic projection
  
  implementation taken from
  Snyder, Map projections - A working manual
   */
  extend(Stereographic, superClass);

  function Stereographic() {
    return Stereographic.__super__.constructor.apply(this, arguments);
  }

  Stereographic.title = "Stereographic Projection";

  Stereographic.prototype.project = function(lon, lat) {
    var cos, k, k0, lam, math, phi, sin, x, xo, y, yo;
    phi = this.rad(lat);
    lam = this.rad(lon);
    math = Math;
    sin = math.sin;
    cos = math.cos;
    k0 = 0.5;
    k = 2 * k0 / (1 + sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0));
    xo = this.r * k * cos(phi) * sin(lam - this.lam0);
    yo = -this.r * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
    x = this.r + xo;
    y = this.r + yo;
    return [x, y];
  };

  return Stereographic;

})(Azimuthal);

__proj['stereo'] = Stereographic;

Satellite = (function(superClass) {

  /*
  General perspective projection, aka Satellite projection
  
  implementation taken from
  Snyder, Map projections - A working manual
  
  up .. angle the camera is turned away from north (clockwise)
  tilt .. angle the camera is tilted
   */
  extend(Satellite, superClass);

  Satellite.parameters = ['lon0', 'lat0', 'tilt', 'dist', 'up'];

  Satellite.title = "Satellite Projection";

  function Satellite(opts) {
    var j, l, lat, lon, ref, ref1, ref2, xmax, xmin, xy;
    Satellite.__super__.constructor.call(this, {
      lon0: 0,
      lat0: 0
    });
    this.dist = (ref = opts.dist) != null ? ref : 3;
    this.up = this.rad((ref1 = opts.up) != null ? ref1 : 0);
    this.tilt = this.rad((ref2 = opts.tilt) != null ? ref2 : 0);
    this.scale = 1;
    xmin = Number.MAX_VALUE;
    xmax = Number.MAX_VALUE * -1;
    for (lat = j = 0; j <= 179; lat = ++j) {
      for (lon = l = 0; l <= 360; lon = ++l) {
        xy = this.project(lon - 180, lat - 90);
        xmin = Math.min(xy[0], xmin);
        xmax = Math.max(xy[0], xmax);
      }
    }
    this.scale = (this.r * 2) / (xmax - xmin);
    Satellite.__super__.constructor.call(this, opts);
    return;
  }

  Satellite.prototype.project = function(lon, lat, alt) {
    var A, H, cos, cos_c, cos_tilt, cos_up, k, lam, math, phi, r, ra, sin, sin_tilt, sin_up, x, xo, xt, y, yo, yt;
    if (alt == null) {
      alt = 0;
    }
    phi = this.rad(lat);
    lam = this.rad(lon);
    math = Math;
    sin = math.sin;
    cos = math.cos;
    r = this.r;
    ra = r * (alt + 6371) / 3671;
    cos_c = sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0);
    k = (this.dist - 1) / (this.dist - cos_c);
    k = (this.dist - 1) / (this.dist - cos_c);
    k *= this.scale;
    xo = ra * k * cos(phi) * sin(lam - this.lam0);
    yo = -ra * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
    cos_up = cos(this.up);
    sin_up = sin(this.up);
    cos_tilt = cos(this.tilt);
    sin_tilt = sin(this.tilt);
    H = ra * (this.dist - 1);
    A = ((yo * cos_up + xo * sin_up) * sin(this.tilt / H)) + cos_tilt;
    xt = (xo * cos_up - yo * sin_up) * cos(this.tilt / A);
    yt = (yo * cos_up + xo * sin_up) / A;
    x = r + xt;
    y = r + yt;
    return [x, y];
  };

  Satellite.prototype._visible = function(lon, lat) {
    var azimuth, cosc, elevation, math;
    elevation = this.to_elevation(lat);
    azimuth = this.to_azimuth(lon);
    math = Math;
    cosc = math.sin(elevation) * math.sin(this.elevation0) + math.cos(this.elevation0) * math.cos(elevation) * math.cos(azimuth - this.azimuth0);
    return cosc >= (1.0 / this.dist);
  };

  Satellite.prototype.sea = function() {
    var j, math, out, phi, r;
    out = [];
    r = this.r;
    math = Math;
    for (phi = j = 0; j <= 360; phi = ++j) {
      out.push([r + math.cos(this.rad(phi)) * r, r + math.sin(this.rad(phi)) * r]);
    }
    return out;
  };

  return Satellite;

})(Azimuthal);

__proj['satellite'] = Satellite;

EquidistantAzimuthal = (function(superClass) {

  /*
  Equidistant projection
  
  implementation taken from
  Snyder, Map projections - A working manual
   */
  extend(EquidistantAzimuthal, superClass);

  function EquidistantAzimuthal() {
    return EquidistantAzimuthal.__super__.constructor.apply(this, arguments);
  }

  EquidistantAzimuthal.title = "Equidistant Azimuthal Projection";

  EquidistantAzimuthal.prototype.project = function(lon, lat) {
    var c, cos, cos_c, k, lam, math, me, phi, sin, x, xo, y, yo;
    me = this;
    phi = me.rad(lat);
    lam = me.rad(lon);
    math = Math;
    sin = math.sin;
    cos = math.cos;
    cos_c = sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0);
    c = math.acos(cos_c);
    k = 0.325 * c / sin(c);
    xo = this.r * k * cos(phi) * sin(lam - this.lam0);
    yo = -this.r * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
    x = this.r + xo;
    y = this.r + yo;
    return [x, y];
  };

  EquidistantAzimuthal.prototype._visible = function(lon, lat) {
    return true;
  };

  return EquidistantAzimuthal;

})(Azimuthal);

__proj['equi'] = EquidistantAzimuthal;

Aitoff = (function(superClass) {

  /*
  Aitoff projection
  
  implementation taken from
  Snyder, Map projections - A working manual
   */
  var COSPHI1;

  extend(Aitoff, superClass);

  Aitoff.title = "Aitoff Projection";

  Aitoff.parameters = ['lon0'];

  COSPHI1 = 0.636619772367581343;

  function Aitoff(opts) {
    var me;
    me = this;
    opts.lat0 = 0;
    Aitoff.__super__.constructor.call(this, opts);
    me.lam0 = 0;
  }

  Aitoff.prototype.project = function(lon, lat) {
    var c, d, lam, me, phi, ref, x, y;
    me = this;
    ref = me.ll(lon, lat), lon = ref[0], lat = ref[1];
    lon = me.clon(lon);
    lam = me.rad(lon);
    phi = me.rad(lat);
    c = 0.5 * lam;
    d = Math.acos(Math.cos(phi) * Math.cos(c));
    if (d !== 0) {
      y = 1.0 / Math.sin(d);
      x = 2.0 * d * Math.cos(phi) * Math.sin(c) * y;
      y *= d * Math.sin(phi);
    } else {
      x = y = 0;
    }
    if (me.winkel) {
      x = (x + lam * COSPHI1) * 0.5;
      y = (y + phi) * 0.5;
    }
    return [x * 1000, y * -1000];
  };

  Aitoff.prototype._visible = function(lon, lat) {
    return true;
  };

  return Aitoff;

})(PseudoCylindrical);

__proj['aitoff'] = Aitoff;

Winkel3 = (function(superClass) {
  extend(Winkel3, superClass);

  Winkel3.title = "Winkel Tripel Projection";

  function Winkel3(opts) {
    Winkel3.__super__.constructor.call(this, opts);
    this.winkel = true;
  }

  return Winkel3;

})(Aitoff);

__proj['winkel3'] = Winkel3;

Conic = (function(superClass) {
  extend(Conic, superClass);

  Conic.title = "Conic Projection";

  Conic.parameters = ['lon0', 'lat0', 'lat1', 'lat2'];

  function Conic(opts) {
    var ref, ref1, self;
    self = this;
    Conic.__super__.constructor.call(this, opts);
    self.lat1 = (ref = opts.lat1) != null ? ref : 30;
    self.phi1 = self.rad(self.lat1);
    self.lat2 = (ref1 = opts.lat2) != null ? ref1 : 50;
    self.phi2 = self.rad(self.lat2);
  }

  Conic.prototype._visible = function(lon, lat) {
    var self;
    self = this;
    return lat > self.minLat && lat < self.maxLat;
  };

  Conic.prototype._truncate = function(x, y) {
    return [x, y];
  };

  Conic.prototype.clon = function(lon) {
    lon -= this.lon0;
    if (lon < -180) {
      lon += 360;
    } else if (lon > 180) {
      lon -= 360;
    }
    return lon;
  };

  return Conic;

})(Proj);

LCC = (function(superClass) {

  /*
  Lambert Conformal Conic Projection (spherical)
   */
  extend(LCC, superClass);

  LCC.title = "Lambert Conformal Conic Projection";

  function LCC(opts) {
    var abs, c, cos, cosphi, log, m, n, pow, ref, secant, self, sin, sinphi, tan;
    self = this;
    LCC.__super__.constructor.call(this, opts);
    m = Math;
    ref = [m.sin, m.cos, m.abs, m.log, m.tan, m.pow], sin = ref[0], cos = ref[1], abs = ref[2], log = ref[3], tan = ref[4], pow = ref[5];
    self.n = n = sinphi = sin(self.phi1);
    cosphi = cos(self.phi1);
    secant = abs(self.phi1 - self.phi2) >= 1e-10;
    if (secant) {
      n = log(cosphi / cos(self.phi2)) / log(tan(self.QUARTERPI + 0.5 * self.phi2) / tan(self.QUARTERPI + 0.5 * self.phi1));
    }
    self.c = c = cosphi * pow(tan(self.QUARTERPI + .5 * self.phi1), n) / n;
    if (abs(abs(self.phi0) - self.HALFPI) < 1e-10) {
      self.rho0 = 0.0;
    } else {
      self.rho0 = c * pow(tan(self.QUARTERPI + .5 * self.phi0), -n);
    }
    self.minLat = -60;
    self.maxLat = 85;
  }

  LCC.prototype.project = function(lon, lat) {
    var abs, cos, lam, lam_, log, m, n, phi, pow, ref, rho, self, sin, tan, x, y;
    self = this;
    phi = self.rad(lat);
    lam = self.rad(self.clon(lon));
    m = Math;
    ref = [m.sin, m.cos, m.abs, m.log, m.tan, m.pow], sin = ref[0], cos = ref[1], abs = ref[2], log = ref[3], tan = ref[4], pow = ref[5];
    n = self.n;
    if (abs(abs(phi) - self.HALFPI) < 1e-10) {
      rho = 0.0;
    } else {
      rho = self.c * pow(tan(self.QUARTERPI + 0.5 * phi), -n);
    }
    lam_ = lam * n;
    x = 1000 * rho * sin(lam_);
    y = 1000 * (self.rho0 - rho * cos(lam_));
    return [x, y * -1];
  };

  return LCC;

})(Conic);

__proj['lcc'] = LCC;

PseudoConic = (function(superClass) {
  extend(PseudoConic, superClass);

  function PseudoConic() {
    return PseudoConic.__super__.constructor.apply(this, arguments);
  }

  return PseudoConic;

})(Conic);


/*
    kartograph - a svg mapping library 
    Copyright (C) 2011  Gregor Aisch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more detailme.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var View;

View = (function() {

  /*
  	2D coordinate transfomation
   */
  function View(bbox, width, height, padding, halign, valign) {
    var me;
    me = this;
    me.bbox = bbox;
    me.width = width;
    me.padding = padding != null ? padding : 0;
    me.halign = halign != null ? halign : 'center';
    me.valign = valign != null ? valign : 'center';
    me.height = height;
    me.scale = Math.min((width - padding * 2) / bbox.width, (height - padding * 2) / bbox.height);
  }

  View.prototype.project = function(x, y) {
    var bbox, h, me, s, w, xf, yf;
    if (y == null) {
      y = x[1];
      x = x[0];
    }
    me = this;
    s = me.scale;
    bbox = me.bbox;
    h = me.height;
    w = me.width;
    xf = me.halign === "center" ? (w - bbox.width * s) * 0.5 : me.halign === "left" ? me.padding * s : w - (bbox.width - me.padding) * s;
    yf = me.valign === "center" ? (h - bbox.height * s) * 0.5 : me.valign === "top" ? me.padding * s : 0;
    x = (x - bbox.left) * s + xf;
    y = (y - bbox.top) * s + yf;
    return [x, y];
  };

  View.prototype.projectPath = function(path) {
    var bbox, cont, contours, i, j, len, len1, me, new_path, pcont, r, ref, ref1, ref2, ref3, x, y;
    me = this;
    if (path.type === "path") {
      contours = [];
      bbox = [99999, 99999, -99999, -99999];
      ref = path.contours;
      for (i = 0, len = ref.length; i < len; i++) {
        pcont = ref[i];
        cont = [];
        for (j = 0, len1 = pcont.length; j < len1; j++) {
          ref1 = pcont[j], x = ref1[0], y = ref1[1];
          ref2 = me.project(x, y), x = ref2[0], y = ref2[1];
          cont.push([x, y]);
          bbox[0] = Math.min(bbox[0], x);
          bbox[1] = Math.min(bbox[1], y);
          bbox[2] = Math.max(bbox[2], x);
          bbox[3] = Math.max(bbox[3], y);
        }
        contours.push(cont);
      }
      new_path = new kartograph.geom.Path(path.type, contours, path.closed);
      new_path._bbox = bbox;
      return new_path;
    } else if (path.type === "circle") {
      ref3 = me.project(path.x, path.y), x = ref3[0], y = ref3[1];
      r = path.r * me.scale;
      return new kartograph.geom.Circle(x, y, r);
    }
  };

  View.prototype.asBBox = function() {
    var me;
    me = this;
    return new kartograph.BBox(0, 0, me.width, me.height);
  };

  return View;

})();

View.fromXML = function(xml) {

  /*
  	constructs a view from XML
   */
  var bbox, bbox_xml, h, pad, w;
  w = Number(xml.getAttribute('w'));
  h = Number(xml.getAttribute('h'));
  pad = Number(xml.getAttribute('padding'));
  bbox_xml = xml.getElementsByTagName('bbox')[0];
  bbox = BBox.fromXML(bbox_xml);
  return new kartograph.View(bbox, w, h, pad);
};

kartograph.View = View;


/*
    kartograph - a svg mapping library
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
kartograph.Kartograph.prototype.dotgrid = function(opts) {
  var anim, data, data_col, data_key, delay, dly, dotgrid, dotstyle, ds, dur, f, g, gridsize, i, id, j, k, l, layer, layer_id, len, len1, len2, len3, m, me, n, path, pathData, paths, pd, ref, ref1, ref10, ref11, ref12, ref13, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, row, size, sizes, x, y;
  me = this;
  layer_id = (ref = opts.layer) != null ? ref : me.layerIds[me.layerIds.length - 1];
  if (!me.layers.hasOwnProperty(layer_id)) {
    warn('dotgrid error: layer "' + layer_id + '" not found');
    return;
  }
  layer = me.layers[layer_id];
  data = opts.data;
  data_col = opts.value;
  data_key = opts.key;
  pathData = {};
  if ((data_key != null) && __type(data) === "array") {
    for (i = 0, len = data.length; i < len; i++) {
      row = data[i];
      id = row[data_key];
      pathData[String(id)] = row;
    }
  } else {
    for (id in data) {
      row = data[id];
      pathData[String(id)] = row;
    }
  }
  dotstyle = (ref1 = opts.style) != null ? ref1 : {
    fill: 'black',
    stroke: 'none'
  };
  sizes = opts.size;
  gridsize = (ref2 = opts.gridsize) != null ? ref2 : 15;
  dotgrid = layer.dotgrid != null ? layer.dotgrid : layer.dotgrid = {
    gridsize: gridsize,
    grid: []
  };
  if (dotgrid.gridsize !== gridsize) {
    ref3 = dotgrid.grid;
    for (j = 0, len1 = ref3.length; j < len1; j++) {
      g = ref3[j];
      if (g.shape != null) {
        g.shape.remove();
        g.shape = null;
      }
    }
  }
  if (gridsize > 0) {
    if (dotgrid.grid.length === 0) {
      for (x = k = 0, ref4 = me.viewport.width, ref5 = gridsize; ref5 > 0 ? k <= ref4 : k >= ref4; x = k += ref5) {
        for (y = l = 0, ref6 = me.viewport.height, ref7 = gridsize; ref7 > 0 ? l <= ref6 : l >= ref6; y = l += ref7) {
          g = {
            x: x + (Math.random() - 0.5) * gridsize * 0.2,
            y: y + (Math.random() - 0.5) * gridsize * 0.2,
            pathid: false
          };
          f = false;
          ref8 = layer.pathsById;
          for (id in ref8) {
            paths = ref8[id];
            for (m = 0, len2 = paths.length; m < len2; m++) {
              path = paths[m];
              if (path.vpath.isInside(g.x, g.y)) {
                f = true;
                pd = (ref9 = pathData[id]) != null ? ref9 : null;
                size = sizes(pd);
                g.pathid = id;
                g.shape = layer.paper.circle(g.x, g.y, 1);
                break;
              }
            }
            if (f) {
              break;
            }
          }
          dotgrid.grid.push(g);
        }
      }
    }
    ref10 = dotgrid.grid;
    for (n = 0, len3 = ref10.length; n < len3; n++) {
      g = ref10[n];
      if (g.pathid) {
        pd = (ref11 = pathData[g.pathid]) != null ? ref11 : null;
        size = sizes(pd);
        dur = (ref12 = opts.duration) != null ? ref12 : 0;
        delay = (ref13 = opts.delay) != null ? ref13 : 0;
        if (__type(delay) === "function") {
          dly = delay(pd);
        } else {
          dly = delay;
        }
        if (dur > 0 && Raphael.svg) {
          anim = Raphael.animation({
            r: size * 0.5
          }, dur);
          g.shape.animate(anim.delay(dly));
        } else {
          g.shape.attr({
            r: size * 0.5
          });
        }
        if (__type(dotstyle) === "function") {
          ds = dotstyle(pd);
        } else {
          ds = dotstyle;
        }
        g.shape.attr(ds);
      }
    }
  }
};


/*
    kartograph - a svg mapping library
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var BlurFilter, Filter, GlowFilter, filter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

filter = kartograph.filter != null ? kartograph.filter : kartograph.filter = {};

filter.__knownFilter = {};

filter.__patternFills = 0;

MapLayer.prototype.SVG = function(el, attr) {
  var key, val;
  if (typeof el === "string") {
    el = window.document.createElementNS("http://www.w3.org/2000/svg", el);
  }
  if (attr) {
    for (key in attr) {
      val = attr[key];
      el.setAttribute(key, val);
    }
  }
  return el;
};

kartograph.Kartograph.prototype.addFilter = function(id, type, params) {
  var doc, fltr, me;
  if (params == null) {
    params = {};
  }
  me = this;
  doc = window.document;
  if (kartograph.filter[type] != null) {
    fltr = new kartograph.filter[type](params).getFilter(id);
  } else {
    throw 'unknown filter type ' + type;
  }
  return me.paper.defs.appendChild(fltr);
};

MapLayer.prototype.applyFilter = function(filter_id) {
  var me;
  me = this;
  return $('.' + me.id, me.paper.canvas).attr({
    filter: 'url(#' + filter_id + ')'
  });
};

MapLayer.prototype.applyTexture = function(url, filt, defCol) {
  var i, len, lp, me, ref, results;
  if (filt == null) {
    filt = false;
  }
  if (defCol == null) {
    defCol = '#000';
  }
  me = this;
  filter.__patternFills += 1;
  ref = me.paths;
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    lp = ref[i];
    if (!filt || filt(lp.data)) {
      results.push(lp.svgPath.attr({
        fill: 'url(' + url + ')'
      }));
    } else {
      results.push(lp.svgPath.attr('fill', defCol));
    }
  }
  return results;
};

Filter = (function() {

  /* base class for all svg filter */
  function Filter(params1) {
    this.params = params1 != null ? params1 : {};
  }

  Filter.prototype.getFilter = function(id) {
    var fltr, me;
    me = this;
    fltr = me.SVG('filter', {
      id: id
    });
    me.buildFilter(fltr);
    return fltr;
  };

  Filter.prototype._getFilter = function() {
    throw "not implemented";
  };

  Filter.prototype.SVG = function(el, attr) {
    var key, val;
    if (typeof el === "string") {
      el = window.document.createElementNS("http://www.w3.org/2000/svg", el);
    }
    if (attr) {
      for (key in attr) {
        val = attr[key];
        el.setAttribute(key, val);
      }
    }
    return el;
  };

  return Filter;

})();

BlurFilter = (function(superClass) {
  extend(BlurFilter, superClass);

  function BlurFilter() {
    return BlurFilter.__super__.constructor.apply(this, arguments);
  }


  /* simple gaussian blur filter */

  BlurFilter.prototype.buildFilter = function(fltr) {
    var SVG, blur, me;
    me = this;
    SVG = me.SVG;
    blur = SVG('feGaussianBlur', {
      stdDeviation: me.params.size || 4,
      result: 'blur'
    });
    return fltr.appendChild(blur);
  };

  return BlurFilter;

})(Filter);

filter.blur = BlurFilter;

GlowFilter = (function(superClass) {
  extend(GlowFilter, superClass);

  function GlowFilter() {
    return GlowFilter.__super__.constructor.apply(this, arguments);
  }


  /* combined class for outer and inner glow filter */

  GlowFilter.prototype.buildFilter = function(fltr) {
    var alpha, blur, color, inner, knockout, me, ref, ref1, ref2, ref3, ref4, ref5, rgb, strength;
    me = this;
    blur = (ref = me.params.blur) != null ? ref : 4;
    strength = (ref1 = me.params.strength) != null ? ref1 : 1;
    color = (ref2 = me.params.color) != null ? ref2 : '#D1BEB0';
    if (typeof color === 'string') {
      color = chroma.hex(color);
    }
    rgb = color.rgb;
    inner = (ref3 = me.params.inner) != null ? ref3 : false;
    knockout = (ref4 = me.params.knockout) != null ? ref4 : false;
    alpha = (ref5 = me.params.alpha) != null ? ref5 : 1;
    if (inner) {
      me.innerGlow(fltr, blur, strength, rgb, alpha, knockout);
    } else {
      me.outerGlow(fltr, blur, strength, rgb, alpha, knockout);
    }
  };

  GlowFilter.prototype.outerGlow = function(fltr, _blur, _strength, rgb, alpha, knockout) {
    var SVG, blur, comp, mat, me, merge, morph;
    me = this;
    SVG = me.SVG;
    mat = SVG('feColorMatrix', {
      "in": 'SourceGraphic',
      type: 'matrix',
      values: '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0',
      result: 'mask'
    });
    fltr.appendChild(mat);
    if (_strength > 0) {
      morph = SVG('feMorphology', {
        "in": 'mask',
        radius: _strength,
        operator: 'dilate',
        result: 'mask'
      });
      fltr.appendChild(morph);
    }
    mat = SVG('feColorMatrix', {
      "in": 'mask',
      type: 'matrix',
      values: '0 0 0 0 ' + (rgb[0] / 255) + ' 0 0 0 0 ' + (rgb[1] / 255) + ' 0 0 0 0 ' + (rgb[2] / 255) + '  0 0 0 1 0',
      result: 'r0'
    });
    fltr.appendChild(mat);
    blur = SVG('feGaussianBlur', {
      "in": 'r0',
      stdDeviation: _blur,
      result: 'r1'
    });
    fltr.appendChild(blur);
    comp = SVG('feComposite', {
      operator: 'out',
      "in": 'r1',
      in2: 'mask',
      result: 'comp'
    });
    fltr.appendChild(comp);
    merge = SVG('feMerge');
    if (!knockout) {
      merge.appendChild(SVG('feMergeNode', {
        'in': 'SourceGraphic'
      }));
    }
    merge.appendChild(SVG('feMergeNode', {
      'in': 'r1'
    }));
    return fltr.appendChild(merge);
  };

  GlowFilter.prototype.innerGlow = function(fltr, _blur, _strength, rgb, alpha, knockout) {
    var SVG, blur, comp, mat, me, merge, morph;
    me = this;
    SVG = me.SVG;
    log('innerglow');
    mat = SVG('feColorMatrix', {
      "in": 'SourceGraphic',
      type: 'matrix',
      values: '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 500 0',
      result: 'mask'
    });
    fltr.appendChild(mat);
    morph = SVG('feMorphology', {
      "in": 'mask',
      radius: _strength,
      operator: 'erode',
      result: 'r1'
    });
    fltr.appendChild(morph);
    blur = SVG('feGaussianBlur', {
      "in": 'r1',
      stdDeviation: _blur,
      result: 'r2'
    });
    fltr.appendChild(blur);
    mat = SVG('feColorMatrix', {
      type: 'matrix',
      "in": 'r2',
      values: '1 0 0 0 ' + (rgb[0] / 255) + ' 0 1 0 0 ' + (rgb[1] / 255) + ' 0 0 1 0 ' + (rgb[2] / 255) + ' 0 0 0 -1 1',
      result: 'r3'
    });
    fltr.appendChild(mat);
    comp = SVG('feComposite', {
      operator: 'in',
      "in": 'r3',
      in2: 'mask',
      result: 'comp'
    });
    fltr.appendChild(comp);
    merge = SVG('feMerge');
    if (!knockout) {
      merge.appendChild(SVG('feMergeNode', {
        'in': 'SourceGraphic'
      }));
    }
    merge.appendChild(SVG('feMergeNode', {
      'in': 'comp'
    }));
    return fltr.appendChild(merge);
  };

  return GlowFilter;

})(Filter);

filter.glow = GlowFilter;


/*
    kartograph - a svg mapping library
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
kartograph.Kartograph.prototype.addGeoPath = function(points, cmds, className) {
  var me, path, path_str;
  if (cmds == null) {
    cmds = [];
  }
  if (className == null) {
    className = '';
  }

  /* converts a set of */
  me = this;
  path_str = me.getGeoPathStr(points, cmds);
  path = me.paper.path(path_str);
  if (className !== '') {
    path.node.setAttribute('class', className);
  }
  return path;
};

kartograph.Kartograph.prototype.getGeoPathStr = function(points, cmds) {
  var cmd, i, me, path_str, pt, ref, xy;
  if (cmds == null) {
    cmds = [];
  }

  /* converts a set of */
  me = this;
  if (type(cmds) === 'string') {
    cmds = cmds.split("");
  }
  if (cmds.length === 0) {
    cmds.push('M');
  }
  path_str = '';
  for (i in points) {
    pt = points[i];
    cmd = (ref = cmds[i]) != null ? ref : 'L';
    xy = me.lonlat2xy(pt);
    if (isNaN(xy[0]) || isNaN(xy[1])) {
      continue;
    }
    path_str += cmd + xy[0] + ',' + xy[1];
  }
  return path_str;
};

kartograph.Kartograph.prototype.addGeoPolygon = function(points, className) {

  /* converts a set of */
  var cmds, i, me;
  me = this;
  cmds = ['M'];
  for (i in points) {
    cmds.push('L');
  }
  cmds.push('Z');
  return me.addGeoPath(points, cmds, className);
};


/*
    kartograph - a svg mapping library 
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var PanAndZoomControl,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PanAndZoomControl = (function() {
  function PanAndZoomControl(map) {
    this.zoomOut = bind(this.zoomOut, this);
    this.zoomIn = bind(this.zoomIn, this);
    var c, div, mdown, me, mup, zc, zcm, zcp;
    me = this;
    me.map = map;
    c = map.container;
    div = function(className, childNodes) {
      var child, d, i, len;
      if (childNodes == null) {
        childNodes = [];
      }
      d = $('<div class="' + className + '" />');
      for (i = 0, len = childNodes.length; i < len; i++) {
        child = childNodes[i];
        d.append(child);
      }
      return d;
    };
    mdown = function(evt) {
      return $(evt.target).addClass('md');
    };
    mup = function(evt) {
      return $(evt.target).removeClass('md');
    };
    zcp = div('plus');
    zcp.mousedown(mdown);
    zcp.mouseup(mup);
    zcp.click(me.zoomIn);
    zcm = div('minus');
    zcm.mousedown(mdown);
    zcm.mouseup(mup);
    zcm.click(me.zoomOut);
    zc = div('zoom-control', [zcp, zcm]);
    c.append(zc);
  }

  PanAndZoomControl.prototype.zoomIn = function(evt) {
    var me;
    me = this;
    me.map.opts.zoom += 1;
    return me.map.resize();
  };

  PanAndZoomControl.prototype.zoomOut = function(evt) {
    var me;
    me = this;
    me.map.opts.zoom -= 1;
    if (me.map.opts.zoom < 1) {
      me.map.opts.zoom = 1;
    }
    return me.map.resize();
  };

  return PanAndZoomControl;

})();


/*
    kartograph - a svg mapping library 
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var LinearScale, LogScale, QuantileScale, Scale, SqrtScale,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Scale = (function() {

  /* scales map values to [0..1] */
  function Scale(domain, prop, filter) {
    var i, me, val, values;
    if (domain == null) {
      domain = [0, 1];
    }
    if (prop == null) {
      prop = null;
    }
    if (filter == null) {
      filter = null;
    }
    this.rangedScale = bind(this.rangedScale, this);
    this.scale = bind(this.scale, this);
    me = this;
    values = [];
    for (i in domain) {
      if (__type(filter) === "function") {
        if (filter(domain[i]) === false) {
          continue;
        }
      }
      if (prop != null) {
        if (__type(prop) === "function") {
          val = prop(domain[i]);
        } else {
          val = domain[i][prop];
        }
      } else {
        val = domain[i];
      }
      if (!isNaN(val)) {
        values.push(val);
      }
    }
    values = values.sort(function(a, b) {
      return a - b;
    });
    me.values = values;
    me._range = [0, 1];
    me.rangedScale.range = (function(_this) {
      return function(_r) {
        me._range = _r;
        return me.rangedScale;
      };
    })(this);
  }

  Scale.prototype.scale = function(x) {
    return x;
  };

  Scale.prototype.rangedScale = function(x) {
    var me, r;
    me = this;
    x = me.scale(x);
    r = me._range;
    return x * (r[1] - r[0]) + r[0];
  };

  return Scale;

})();

LinearScale = (function(superClass) {
  extend(LinearScale, superClass);

  function LinearScale() {
    this.scale = bind(this.scale, this);
    return LinearScale.__super__.constructor.apply(this, arguments);
  }


  /* liniear scale */

  LinearScale.prototype.scale = function(x) {
    var me, vals;
    me = this;
    vals = me.values;
    return (x - vals[0]) / (vals[vals.length - 1] - vals[0]);
  };

  return LinearScale;

})(Scale);

LogScale = (function(superClass) {
  extend(LogScale, superClass);

  function LogScale() {
    this.scale = bind(this.scale, this);
    return LogScale.__super__.constructor.apply(this, arguments);
  }


  /* logatithmic scale */

  LogScale.prototype.scale = function(x) {
    var log, me, vals;
    me = this;
    vals = me.values;
    log = Math.log;
    return (log(x) - log(vals[0])) / (log(vals[vals.length - 1]) - log(vals[0]));
  };

  return LogScale;

})(Scale);

SqrtScale = (function(superClass) {
  extend(SqrtScale, superClass);

  function SqrtScale() {
    this.scale = bind(this.scale, this);
    return SqrtScale.__super__.constructor.apply(this, arguments);
  }


  /* square root scale */

  SqrtScale.prototype.scale = function(x) {
    var me, vals;
    me = this;
    vals = me.values;
    return Math.sqrt((x - vals[0]) / (vals[vals.length - 1] - vals[0]));
  };

  return SqrtScale;

})(Scale);

QuantileScale = (function(superClass) {
  extend(QuantileScale, superClass);

  function QuantileScale() {
    this.scale = bind(this.scale, this);
    return QuantileScale.__super__.constructor.apply(this, arguments);
  }


  /* quantiles scale */

  QuantileScale.prototype.scale = function(x) {
    var i, k, me, nv, v, vals;
    me = this;
    vals = me.values;
    k = vals.length - 1;
    for (i in vals) {
      v = vals[Number(i)];
      nv = vals[Number(i) + 1];
      if (x === v) {
        return i / k;
      }
      if (i < k && x > v && x < nv) {
        return i / k + (x - v) / (nv - v);
      }
    }
  };

  return QuantileScale;

})(Scale);

kartograph.scale = {};

kartograph.scale.identity = function(s) {
  return new Scale(domain, prop, filter).rangedScale;
};

kartograph.scale.linear = function(domain, prop, filter) {
  return new LinearScale(domain, prop, filter).rangedScale;
};

kartograph.scale.log = function(domain, prop, filter) {
  return new LogScale(domain, prop, filter).rangedScale;
};

kartograph.scale.sqrt = function(domain, prop, filter) {
  return new SqrtScale(domain, prop, filter).rangedScale;
};

kartograph.scale.quantile = function(domain, prop, filter) {
  return new QuantileScale(domain, prop, filter).rangedScale;
};


/*
    kartograph - a svg mapping library
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var Symbol;

Symbol = (function() {

  /* base class for all symbols */
  var me;

  me = null;

  function Symbol(opts) {
    me = this;
    me.location = opts.location;
    me.data = opts.data;
    me.map = opts.map;
    me.layers = opts.layers;
    me.key = opts.key;
    me.x = opts.x;
    me.y = opts.y;
  }

  Symbol.prototype.init = function() {
    return me;
  };

  Symbol.prototype.overlaps = function(symbol) {
    return false;
  };

  Symbol.prototype.update = function(opts) {

    /* once the data has changed */
    return me;
  };

  Symbol.prototype.nodes = function() {
    return [];
  };

  Symbol.prototype.clear = function() {
    return me;
  };

  return Symbol;

})();

kartograph.Symbol = Symbol;


/*
    kartograph - a svg mapping library
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var SymbolGroup,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

SymbolGroup = (function() {

  /* symbol groups
  
  Usage:
  new $K.SymbolGroup(options);
  map.addSymbols(options)
   */
  var me;

  me = null;

  function SymbolGroup(opts) {
    this._initTooltips = bind(this._initTooltips, this);
    this._noverlap = bind(this._noverlap, this);
    this._kMeans = bind(this._kMeans, this);
    var SymbolType, d, i, id, k, l, layer, len, len1, len2, len3, nid, o, optional, p, ref, ref1, required, t, u;
    me = this;
    required = ['data', 'location', 'type', 'map'];
    optional = ['filter', 'tooltip', 'click', 'delay', 'sortBy', 'clustering', 'aggregate', 'clusteringOpts', 'mouseenter', 'mouseleave'];
    for (k = 0, len = required.length; k < len; k++) {
      p = required[k];
      if (opts[p] != null) {
        me[p] = opts[p];
      } else {
        throw "SymbolGroup: missing argument '" + p + "'";
      }
    }
    for (o = 0, len1 = optional.length; o < len1; o++) {
      p = optional[o];
      if (opts[p] != null) {
        me[p] = opts[p];
      }
    }
    SymbolType = me.type;
    if (SymbolType == null) {
      warn('could not resolve symbol type', me.type);
      return;
    }
    ref = SymbolType.props;
    for (t = 0, len2 = ref.length; t < len2; t++) {
      p = ref[t];
      if (opts[p] != null) {
        me[p] = opts[p];
      }
    }
    me.layers = {
      mapcanvas: me.map.paper
    };
    ref1 = SymbolType.layers;
    for (u = 0, len3 = ref1.length; u < len3; u++) {
      l = ref1[u];
      nid = SymbolGroup._layerid++;
      id = 'sl_' + nid;
      if (l.type === 'svg') {
        layer = me.map.createSVGLayer(id);
      } else if (l.type === 'html') {
        layer = me.map.createHTMLLayer(id);
      }
      me.layers[l.id] = layer;
    }
    me.symbols = [];
    for (i in me.data) {
      d = me.data[i];
      if (__type(me.filter) === "function") {
        if (me.filter(d, i)) {
          me.add(d, i);
        }
      } else {
        me.add(d, i);
      }
    }
    me.layout();
    me.render();
    me.map.addSymbolGroup(me);
  }

  SymbolGroup.prototype.add = function(data, key) {

    /* adds a new symbol to this group */
    var SymbolType, k, len, ll, p, ref, sprops, symbol;
    me = this;
    SymbolType = me.type;
    ll = me._evaluate(me.location, data, key);
    if (__type(ll) === 'array') {
      ll = new kartograph.LonLat(ll[0], ll[1]);
    }
    sprops = {
      layers: me.layers,
      location: ll,
      data: data,
      key: key != null ? key : me.symbols.length,
      map: me.map
    };
    ref = SymbolType.props;
    for (k = 0, len = ref.length; k < len; k++) {
      p = ref[k];
      if (me[p] != null) {
        sprops[p] = me._evaluate(me[p], data, key);
      }
    }
    symbol = new SymbolType(sprops);
    me.symbols.push(symbol);
    return symbol;
  };

  SymbolGroup.prototype.layout = function() {
    var k, layer_id, len, ll, path, path_id, ref, ref1, s, xy;
    ref = me.symbols;
    for (k = 0, len = ref.length; k < len; k++) {
      s = ref[k];
      ll = s.location;
      if (__type(ll) === 'string') {
        ref1 = ll.split('.'), layer_id = ref1[0], path_id = ref1[1];
        path = me.map.getLayerPath(layer_id, path_id);
        if (path != null) {
          xy = me.map.viewBC.project(path.path.centroid());
        } else {
          warn('could not find layer path ' + layer_id + '.' + path_id);
          continue;
        }
      } else {
        xy = me.map.lonlat2xy(ll);
      }
      s.x = xy[0];
      s.y = xy[1];
    }
    if (me.clustering === 'k-means') {
      me._kMeans();
    } else if (me.clustering === 'noverlap') {
      me._noverlap();
    }
    return me;
  };

  SymbolGroup.prototype.render = function() {
    var k, len, len1, node, o, ref, ref1, ref2, s, sortBy, sortDir;
    me = this;
    if (me.sortBy) {
      sortDir = 'asc';
      if (__type(me.sortBy) === "string") {
        me.sortBy = me.sortBy.split(' ', 2);
        sortBy = me.sortBy[0];
        sortDir = (ref = me.sortBy[1]) != null ? ref : 'asc';
      }
      me.symbols = me.symbols.sort(function(a, b) {
        var m, va, vb;
        if (__type(me.sortBy) === "function") {
          va = me.sortBy(a.data, a);
          vb = me.sortBy(b.data, b);
        } else {
          va = a[sortBy];
          vb = b[sortBy];
        }
        if (va === vb) {
          return 0;
        }
        m = sortDir === 'asc' ? 1 : -1;
        if (va > vb) {
          return 1 * m;
        } else {
          return -1 * m;
        }
      });
    }
    ref1 = me.symbols;
    for (k = 0, len = ref1.length; k < len; k++) {
      s = ref1[k];
      s.render();
      ref2 = s.nodes();
      for (o = 0, len1 = ref2.length; o < len1; o++) {
        node = ref2[o];
        node.symbol = s;
      }
    }
    if (__type(me.tooltip) === "function") {
      me._initTooltips();
    }
    $.each(['click', 'mouseenter', 'mouseleave'], function(i, evt) {
      var len2, ref3, results, t;
      if (__type(me[evt]) === "function") {
        ref3 = me.symbols;
        results = [];
        for (t = 0, len2 = ref3.length; t < len2; t++) {
          s = ref3[t];
          results.push((function() {
            var len3, ref4, results1, u;
            ref4 = s.nodes();
            results1 = [];
            for (u = 0, len3 = ref4.length; u < len3; u++) {
              node = ref4[u];
              results1.push($(node)[evt]((function(_this) {
                return function(e) {
                  var tgt;
                  tgt = e.target;
                  while (!tgt.symbol) {
                    tgt = $(tgt).parent().get(0);
                  }
                  e.stopPropagation();
                  return me[evt](tgt.symbol.data, tgt.symbol, e);
                };
              })(this)));
            }
            return results1;
          }).call(this));
        }
        return results;
      }
    });
    return me;
  };

  SymbolGroup.prototype.tooltips = function(cb) {
    me = this;
    me.tooltips = cb;
    me._initTooltips();
    return me;
  };

  SymbolGroup.prototype.remove = function(filter) {
    var error, error1, id, k, kept, layer, len, ref, ref1, results, s;
    me = this;
    kept = [];
    ref = me.symbols;
    for (k = 0, len = ref.length; k < len; k++) {
      s = ref[k];
      if ((filter != null) && !filter(s.data)) {
        kept.push(s);
        continue;
      }
      try {
        s.clear();
      } catch (error1) {
        error = error1;
        warn('error: symbolgroup.remove');
      }
    }
    if (filter == null) {
      ref1 = me.layers;
      results = [];
      for (id in ref1) {
        layer = ref1[id];
        if (id !== "mapcanvas") {
          results.push(layer.remove());
        } else {
          results.push(void 0);
        }
      }
      return results;
    } else {
      return me.symbols = kept;
    }
  };

  SymbolGroup.prototype._evaluate = function(prop, data, key) {

    /* evaluates a property function or returns a static value */
    var val;
    if (__type(prop) === 'function') {
      return val = prop(data, key);
    } else {
      return val = prop;
    }
  };

  SymbolGroup.prototype._kMeans = function() {

    /*
    layouts symbols in this group, eventually adds new 'grouped' symbols
    map.addSymbols({
        layout: "k-means",
        aggregate: function(data) {
            // compresses a list of data objects into a single one
            // typically you want to calculate the mean position, sum value or something here
        }
    })
     */
    var SymbolType, cluster, d, i, k, len, len1, len2, len3, mean, means, o, out, p, ref, ref1, ref2, s, size, sprops, t, u;
    me = this;
    if (me.osymbols == null) {
      me.osymbols = me.symbols;
    }
    SymbolType = me.type;
    if (me.clusteringOpts != null) {
      size = me.clusteringOpts.size;
    }
    if (size == null) {
      size = 64;
    }
    cluster = kmeans().iterations(16).size(size);
    ref = me.osymbols;
    for (k = 0, len = ref.length; k < len; k++) {
      s = ref[k];
      cluster.add({
        x: s.x,
        y: s.y
      });
    }
    means = cluster.means();
    out = [];
    for (o = 0, len1 = means.length; o < len1; o++) {
      mean = means[o];
      if (mean.size === 0) {
        continue;
      }
      d = [];
      ref1 = mean.indices;
      for (t = 0, len2 = ref1.length; t < len2; t++) {
        i = ref1[t];
        d.push(me.osymbols[i].data);
      }
      d = me.aggregate(d);
      sprops = {
        layers: me.layers,
        location: false,
        data: d,
        map: me.map
      };
      ref2 = SymbolType.props;
      for (u = 0, len3 = ref2.length; u < len3; u++) {
        p = ref2[u];
        if (me[p] != null) {
          sprops[p] = me._evaluate(me[p], d);
        }
      }
      s = new SymbolType(sprops);
      s.x = mean.x;
      s.y = mean.y;
      out.push(s);
    }
    return me.symbols = out;
  };

  SymbolGroup.prototype._noverlap = function() {
    var SymbolType, b0, b1, d, dx, dy, i, intersects, iterations, k, l, l0, l1, len, len1, len2, maxRatio, o, out, p, q, r, r0, r1, rad0, rad1, ref, ref1, ref2, ref3, ref4, s, s0, s1, sprops, symbols, t, t0, t1, tolerance, u, v, w, x, y, z;
    me = this;
    if (me.osymbols == null) {
      me.osymbols = me.symbols;
    }
    iterations = 3;
    SymbolType = me.type;
    if (indexOf.call(SymbolType.props, 'radius') < 0) {
      warn('noverlap layout only available for symbols with property "radius"');
      return;
    }
    symbols = me.osymbols.slice();
    if (me.clusteringOpts != null) {
      tolerance = me.clusteringOpts.tolerance;
      maxRatio = me.clusteringOpts.maxRatio;
    }
    if (tolerance == null) {
      tolerance = 0.05;
    }
    if (maxRatio == null) {
      maxRatio = 0.8;
    }
    for (i = k = 0, ref = iterations - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      symbols.sort(function(a, b) {
        return b.radius - a.radius;
      });
      l = symbols.length;
      out = [];
      for (p = o = 0, ref1 = l - 3; 0 <= ref1 ? o <= ref1 : o >= ref1; p = 0 <= ref1 ? ++o : --o) {
        s0 = symbols[p];
        if (!s0) {
          continue;
        }
        rad0 = s0.radius * (1 - tolerance);
        l0 = s0.x - rad0;
        r0 = s0.x + rad0;
        t0 = s0.y - rad0;
        b0 = s0.y + rad0;
        intersects = [];
        for (q = t = ref2 = p + 1, ref3 = l - 2; ref2 <= ref3 ? t <= ref3 : t >= ref3; q = ref2 <= ref3 ? ++t : --t) {
          s1 = symbols[q];
          if (!s1) {
            continue;
          }
          rad1 = s1.radius;
          l1 = s1.x - rad1;
          r1 = s1.x + rad1;
          t1 = s1.y - rad1;
          b1 = s1.y + rad1;
          if (rad1 / s0.radius < maxRatio) {
            if (!(r0 < l1 || r1 < l0) && !(b0 < t1 || b1 < t0)) {
              dx = s1.x - s0.x;
              dy = s1.y - s0.y;
              if (dx * dx + dy * dy < (rad0 + rad1) * (rad0 + rad1)) {
                intersects.push(q);
              }
            }
          }
        }
        if (intersects.length > 0) {
          d = [s0.data];
          r = s0.radius * s0.radius;
          for (u = 0, len = intersects.length; u < len; u++) {
            i = intersects[u];
            d.push(symbols[i].data);
            r += symbols[i].radius * symbols[i].radius;
          }
          d = me.aggregate(d);
          sprops = {
            layers: me.layers,
            location: false,
            data: d,
            map: me.map
          };
          ref4 = SymbolType.props;
          for (v = 0, len1 = ref4.length; v < len1; v++) {
            p = ref4[v];
            if (me[p] != null) {
              sprops[p] = me._evaluate(me[p], d);
            }
          }
          s = new SymbolType(sprops);
          w = s0.radius * s0.radius / r;
          x = s0.x * w;
          y = s0.y * w;
          for (z = 0, len2 = intersects.length; z < len2; z++) {
            i = intersects[z];
            s1 = symbols[i];
            w = s1.radius * s1.radius / r;
            x += s1.x * w;
            y += s1.y * w;
            symbols[i] = void 0;
          }
          s.x = x;
          s.y = y;
          symbols[p] = void 0;
          out.push(s);
        } else {
          out.push(s0);
        }
      }
      symbols = out;
    }
    return me.symbols = symbols;
  };

  SymbolGroup.prototype._initTooltips = function() {
    var cfg, k, len, len1, node, o, ref, ref1, s, tooltips, tt;
    me = this;
    tooltips = me.tooltip;
    ref = me.symbols;
    for (k = 0, len = ref.length; k < len; k++) {
      s = ref[k];
      cfg = {
        position: {
          target: 'mouse',
          viewport: $(window),
          adjust: {
            x: 7,
            y: 7
          }
        },
        show: {
          delay: 20
        },
        content: {},
        events: {
          show: function(evt, api) {
            return $('.qtip').filter(function() {
              return this !== api.elements.tooltip.get(0);
            }).hide();
          }
        }
      };
      tt = tooltips(s.data, s.key);
      if (__type(tt) === "string") {
        cfg.content.text = tt;
      } else if (__type(tt) === "array") {
        cfg.content.title = tt[0];
        cfg.content.text = tt[1];
      }
      ref1 = s.nodes();
      for (o = 0, len1 = ref1.length; o < len1; o++) {
        node = ref1[o];
        $(node).qtip(cfg);
      }
    }
  };

  SymbolGroup.prototype.onResize = function() {
    var k, len, ref, s;
    me = this;
    me.layout();
    ref = me.symbols;
    for (k = 0, len = ref.length; k < len; k++) {
      s = ref[k];
      s.update();
    }
  };

  SymbolGroup.prototype.update = function(opts, duration, easing) {
    var k, len, len1, o, p, ref, ref1, s;
    me = this;
    if (opts == null) {
      opts = {};
    }
    ref = me.symbols;
    for (k = 0, len = ref.length; k < len; k++) {
      s = ref[k];
      ref1 = me.type.props;
      for (o = 0, len1 = ref1.length; o < len1; o++) {
        p = ref1[o];
        if (opts[p] != null) {
          s[p] = me._evaluate(opts[p], s.data);
        } else if (me[p] != null) {
          s[p] = me._evaluate(me[p], s.data);
        }
      }
      s.update(duration, easing);
    }
    return me;
  };

  return SymbolGroup;

})();

SymbolGroup._layerid = 0;

kartograph.SymbolGroup = SymbolGroup;

kartograph.Kartograph.prototype.addSymbols = function(opts) {
  opts.map = this;
  return new SymbolGroup(opts);
};


/*
    Copyright (c) 2010, SimpleGeo and Stamen Design
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
        * Redistributions of source code must retain the above copyright
          notice, this list of conditions and the following disclaimer.
        * Redistributions in binary form must reproduce the above copyright
          notice, this list of conditions and the following disclaimer in the
          documentation and/or other materials provided with the distribution.
        * Neither the name of SimpleGeo nor the
          names of its contributors may be used to endorse or promote products
          derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL SIMPLEGEO BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// k-means clustering
function kmeans() {
  var kmeans = {},
      points = [],
      iterations = 1,
      size = 1;

  kmeans.size = function(x) {
    if (!arguments.length) return size;
    size = x;
    return kmeans;
  };

  kmeans.iterations = function(x) {
    if (!arguments.length) return iterations;
    iterations = x;
    return kmeans;
  };

  kmeans.add = function(x) {
    points.push(x);
    return kmeans;
  };

  kmeans.means = function() {
    var means = [],
        seen = {},
        n = Math.min(size, points.length);

    // Initialize k random (unique!) means.
    for (var i = 0, m = 2 * n; i < m; i++) {
      var p = points[~~(Math.random() * points.length)], id = p.x + "/" + p.y;
      if (!(id in seen)) {
        seen[id] = 1;
        if (means.push({x: p.x, y: p.y}) >= n) break;
      }
    }
    n = means.length;

    // For each iteration, create a kd-tree of the current means.
    for (var j = 0; j < iterations; j++) {
      var kd = kdtree().points(means);

      // Clear the state.
      for (var i = 0; i < n; i++) {
        var mean = means[i];
        mean.sumX = 0;
        mean.sumY = 0;
        mean.size = 0;
        mean.points = [];
        mean.indices = [];
      }

      // Find the mean closest to each point.
      for (var i = 0; i < points.length; i++) {
        var point = points[i], mean = kd.find(point);
        mean.sumX += point.x;
        mean.sumY += point.y;
        mean.size++;
        mean.points.push(point);
        mean.indices.push(i);
      }

      // Compute the new means.
      for (var i = 0; i < n; i++) {
        var mean = means[i];
        if (!mean.size) continue; // overlapping mean
        mean.x = mean.sumX / mean.size;
        mean.y = mean.sumY / mean.size;
      }
    }

    return means;
  };

  return kmeans;
}

// kd-tree
function kdtree() {
  var kdtree = {},
      axes = ["x", "y"],
      root,
      points = [];

  kdtree.axes = function(x) {
    if (!arguments.length) return axes;
    axes = x;
    return kdtree;
  };

  kdtree.points = function(x) {
    if (!arguments.length) return points;
    points = x;
    root = null;
    return kdtree;
  };

  kdtree.find = function(x) {
    return find(kdtree.root(), x, root).point;
  };

  kdtree.root = function(x) {
    return root || (root = node(points, 0));
  };

  function node(points, depth) {
    if (!points.length) return;
    var axis = axes[depth % axes.length], median = points.length >> 1;
    points.sort(order(axis)); // could use random sample to speed up here
    return {
      axis: axis,
      point: points[median],
      left: node(points.slice(0, median), depth + 1),
      right: node(points.slice(median + 1), depth + 1)
    };
  }

  function distance(a, b) {
    var sum = 0;
    for (var i = 0; i < axes.length; i++) {
      var axis = axes[i], d = a[axis] - b[axis];
      sum += d * d;
    }
    return sum;
  }

  function order(axis) {
    return function(a, b) {
      a = a[axis];
      b = b[axis];
      return a < b ? -1 : a > b ? 1 : 0;
    };
  }

  function find(node, point, best) {
    if (distance(node.point, point) < distance(best.point, point)) best = node;
    if (node.left) best = find(node.left, point, best);
    if (node.right) {
      var d = node.point[node.axis] - point[node.axis];
      if (d * d < distance(best.point, point)) best = find(node.right, point, best);
    }
    return best;
  }

  return kdtree;
}
;

kartograph.dorlingLayout = function(symbolgroup, iterations) {
  var A, B, apply, d, ds, dx, dy, f, i, j, k, nodes, r, rd, ref, rs;
  if (iterations == null) {
    iterations = 40;
  }
  nodes = [];
  $.each(symbolgroup.symbols, function(i, s) {
    return nodes.push({
      i: i,
      x: s.path.attrs.cx,
      y: s.path.attrs.cy,
      r: s.path.attrs.r
    });
  });
  nodes.sort(function(a, b) {
    return b.r - a.r;
  });
  apply = function() {
    var k, len, n;
    for (k = 0, len = nodes.length; k < len; k++) {
      n = nodes[k];
      symbolgroup.symbols[n.i].path.attr({
        cx: n.x,
        cy: n.y
      });
    }
  };
  for (r = k = 1, ref = iterations; 1 <= ref ? k <= ref : k >= ref; r = 1 <= ref ? ++k : --k) {
    for (i in nodes) {
      for (j in nodes) {
        if (j > i) {
          A = nodes[i];
          B = nodes[j];
          if (A.x + A.r < B.x - B.r || A.x - A.r > B.x + B.r) {
            continue;
          }
          if (A.y + A.r < B.y - B.r || A.y - A.r > B.y + B.r) {
            continue;
          }
          dx = A.x - B.x;
          dy = A.y - B.y;
          ds = dx * dx + dy * dy;
          rd = A.r + B.r;
          rs = rd * rd;
          if (ds < rs) {
            d = Math.sqrt(ds);
            f = 10 / d;
            A.x += dx * f * (1 - (A.r / rd));
            A.y += dy * f * (1 - (A.r / rd));
            B.x -= dx * f * (1 - (B.r / rd));
            B.y -= dy * f * (1 - (B.r / rd));
          }
        }
      }
    }
  }
  return apply();
};


/*
    kartograph - a svg mapping library
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var Bubble,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Bubble = (function(superClass) {
  extend(Bubble, superClass);

  function Bubble(opts) {
    this.nodes = bind(this.nodes, this);
    this.clear = bind(this.clear, this);
    this.update = bind(this.update, this);
    this.render = bind(this.render, this);
    this.overlaps = bind(this.overlaps, this);
    var me, ref, ref1;
    me = this;
    Bubble.__super__.constructor.call(this, opts);
    me.radius = (ref = opts.radius) != null ? ref : 4;
    me.style = opts.style;
    me.attrs = opts.attrs;
    me.title = opts.title;
    me["class"] = (ref1 = opts["class"]) != null ? ref1 : 'bubble';
  }

  Bubble.prototype.overlaps = function(bubble) {
    var dx, dy, me, r1, r2, ref, ref1, x1, x2, y1, y2;
    me = this;
    ref = [me.x, me.y, me.radius], x1 = ref[0], y1 = ref[1], r1 = ref[2];
    ref1 = [bubble.x, bubble.y, bubble.radius], x2 = ref1[0], y2 = ref1[1], r2 = ref1[2];
    if (x1 - r1 > x2 + r2 || x1 + r1 < x2 - r2 || y1 - r1 > y2 + r2 || y1 + r1 < y2 - r2) {
      return false;
    }
    dx = x1 - x2;
    dy = y1 - y2;
    if (dx * dx + dy * dy > (r1 + r2) * (r1 + r2)) {
      return false;
    }
    return true;
  };

  Bubble.prototype.render = function(layers) {
    var me;
    me = this;
    if (me.path == null) {
      me.path = me.layers.mapcanvas.circle(me.x, me.y, me.radius);
    }
    me.update();
    me.map.applyCSS(me.path);
    return me;
  };

  Bubble.prototype.update = function(duration, easing) {
    var attrs, me, path;
    if (duration == null) {
      duration = false;
    }
    if (easing == null) {
      easing = 'expo-out';
    }
    me = this;
    path = me.path;
    attrs = {
      cx: me.x,
      cy: me.y,
      r: me.radius
    };
    if (me.attrs != null) {
      attrs = $.extend(attrs, me.attrs);
    }
    if (!duration) {
      path.attr(attrs);
    } else {
      path.animate(attrs, duration, easing);
    }
    if (path.node != null) {
      if (me.style != null) {
        path.node.setAttribute('style', me.style);
      }
      if (me["class"] != null) {
        path.node.setAttribute('class', me["class"]);
      }
    }
    if (me.title != null) {
      path.attr('title', me.title);
    }
    return me;
  };

  Bubble.prototype.clear = function() {
    var me;
    me = this;
    me.path.remove();
    return me;
  };

  Bubble.prototype.nodes = function() {
    var me;
    me = this;
    return [me.path.node];
  };

  return Bubble;

})(Symbol);

Bubble.props = ['radius', 'style', 'class', 'title', 'attrs'];

Bubble.layers = [];

kartograph.Bubble = Bubble;


/*
    kartograph - a svg mapping library 
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var Icon,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Icon = (function(superClass) {
  extend(Icon, superClass);

  function Icon(opts) {
    var me, ref, ref1, ref2, ref3, ref4;
    me = this;
    Icon.__super__.constructor.call(this, opts);
    me.icon = (ref = opts.icon) != null ? ref : '';
    me.offset = (ref1 = opts.offset) != null ? ref1 : [0, 0];
    me.iconsize = (ref2 = opts.iconsize) != null ? ref2 : [10, 10];
    me["class"] = (ref3 = opts["class"]) != null ? ref3 : '';
    me.title = (ref4 = opts.title) != null ? ref4 : '';
  }

  Icon.prototype.render = function(layers) {
    var cont, me;
    me = this;
    cont = me.map.container;
    me.img = $('<img />');
    me.img.attr({
      src: me.icon,
      title: me.title,
      alt: me.title,
      width: me.iconsize[0],
      height: me.iconsize[1]
    });
    me.img.addClass(me["class"]);
    me.img.css({
      position: 'absolute',
      'z-index': 1000,
      cursor: 'pointer'
    });
    me.img[0].symbol = me;
    cont.append(me.img);
    return me.update();
  };

  Icon.prototype.update = function() {
    var me;
    me = this;
    return me.img.css({
      left: (me.x + me.offset[0]) + 'px',
      top: (me.y + me.offset[1]) + 'px'
    });
  };

  Icon.prototype.clear = function() {
    var me;
    me = this;
    me.img.remove();
    return me;
  };

  Icon.prototype.nodes = function() {
    var me;
    me = this;
    return [me.img];
  };

  return Icon;

})(kartograph.Symbol);

Icon.props = ['icon', 'offset', 'class', 'title', 'iconsize'];

Icon.layers = [];

kartograph.Icon = Icon;


/*
    kartograph - a svg mapping library
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var HtmlLabel, SvgLabel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SvgLabel = (function(superClass) {
  extend(SvgLabel, superClass);

  function SvgLabel(opts) {
    var me, ref, ref1, ref2, ref3;
    me = this;
    SvgLabel.__super__.constructor.call(this, opts);
    me.text = (ref = opts.text) != null ? ref : '';
    me.style = (ref1 = opts.style) != null ? ref1 : '';
    me["class"] = (ref2 = opts["class"]) != null ? ref2 : '';
    me.offset = (ref3 = opts.offset) != null ? ref3 : [0, 0];
  }

  SvgLabel.prototype.render = function(layers) {
    var lbl, me;
    me = this;
    me.lbl = lbl = me.layers.mapcanvas.text(me.x, me.y, me.text);
    me.update();
    return me;
  };

  SvgLabel.prototype.update = function() {
    var me;
    me = this;
    me.lbl.attr({
      x: me.x + me.offset[0],
      y: me.y + me.offset[1]
    });
    me.lbl.node.setAttribute('style', me.style);
    return me.lbl.node.setAttribute('class', me["class"]);
  };

  SvgLabel.prototype.clear = function() {
    var me;
    me = this;
    me.lbl.remove();
    return me;
  };

  SvgLabel.prototype.nodes = function() {
    var me;
    me = this;
    return [me.lbl.node];
  };

  return SvgLabel;

})(kartograph.Symbol);

SvgLabel.props = ['text', 'style', 'class', 'offset'];

SvgLabel.layers = [];

kartograph.Label = SvgLabel;

HtmlLabel = (function(superClass) {
  extend(HtmlLabel, superClass);

  function HtmlLabel(opts) {
    var me, ref, ref1, ref2;
    me = this;
    HtmlLabel.__super__.constructor.call(this, opts);
    me.text = (ref = opts.text) != null ? ref : '';
    me.style = (ref1 = opts.style) != null ? ref1 : '';
    me["class"] = (ref2 = opts["class"]) != null ? ref2 : '';
  }

  HtmlLabel.prototype.render = function(layers) {
    var l, lbl, me;
    me = this;
    l = $('<div>' + me.text + '</div>');
    l.css({
      width: '50px',
      position: 'absolute',
      left: '-25px',
      'text-align': 'center'
    });
    me.lbl = lbl = $('<div class="label" />');
    lbl.append(l);
    me.layers.lbl.append(lbl);
    l.css({
      height: l.height() + 'px',
      top: (l.height() * -.4) + 'px'
    });
    me.update();
    return me;
  };

  HtmlLabel.prototype.update = function() {
    var me;
    me = this;
    return me.lbl.css({
      position: 'absolute',
      left: me.x + 'px',
      top: me.y + 'px'
    });
  };

  HtmlLabel.prototype.clear = function() {
    var me;
    me = this;
    me.lbl.remove();
    return me;
  };

  HtmlLabel.prototype.nodes = function() {
    var me;
    me = this;
    return [me.lbl[0]];
  };

  return HtmlLabel;

})(kartograph.Symbol);

HtmlLabel.props = ['text', 'style', 'class'];

HtmlLabel.layers = [
  {
    id: 'lbl',
    type: 'html'
  }
];

kartograph.HtmlLabel = HtmlLabel;


/*
    kartograph - a svg mapping library
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var LabeledBubble,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

LabeledBubble = (function(superClass) {
  extend(LabeledBubble, superClass);

  function LabeledBubble(opts) {
    this.nodes = bind(this.nodes, this);
    this.clear = bind(this.clear, this);
    this.update = bind(this.update, this);
    this.render = bind(this.render, this);
    var me, ref, ref1;
    me = this;
    LabeledBubble.__super__.constructor.call(this, opts);
    me.labelattrs = (ref = opts.labelattrs) != null ? ref : {};
    me.buffer = opts.buffer;
    me.center = (ref1 = opts.center) != null ? ref1 : true;
  }

  LabeledBubble.prototype.render = function(layers) {
    var me;
    me = this;
    if ((me.title != null) && String(me.title).trim() !== '') {
      if (me.buffer) {
        me.bufferlabel = me.layers.mapcanvas.text(me.x, me.y, me.title);
      }
      me.label = me.layers.mapcanvas.text(me.x, me.y, me.title);
    }
    LabeledBubble.__super__.render.call(this, layers);
    return me;
  };

  LabeledBubble.prototype.update = function(duration, easing) {
    var attrs, me, vp, x, y;
    if (duration == null) {
      duration = false;
    }
    if (easing == null) {
      easing = 'expo-out';
    }
    me = this;
    LabeledBubble.__super__.update.call(this, duration, easing);
    if (me.label != null) {
      vp = me.map.viewport;
      attrs = $.extend({}, me.labelattrs);
      x = me.x;
      y = me.y;
      if (me.center) {
        y -= 0;
      } else if (x > vp.width * 0.5) {
        attrs['text-anchor'] = 'end';
        x -= me.radius + 5;
      } else if (x < vp.width * 0.5) {
        attrs['text-anchor'] = 'start';
        x += me.radius + 5;
      }
      attrs['x'] = x;
      attrs['y'] = y;
      if (me.buffer) {
        me.bufferlabel.attr(attrs);
        me.bufferlabel.attr({
          stroke: '#fff',
          fill: '#fff',
          'stroke-linejoin': 'round',
          'stroke-linecap': 'round',
          'stroke-width': 6
        });
      }
      me.label.attr(attrs);
      me.label.toFront();
    }
    return me;
  };

  LabeledBubble.prototype.clear = function() {
    var me;
    me = this;
    return LabeledBubble.__super__.clear.apply(this, arguments);
  };

  LabeledBubble.prototype.nodes = function() {
    var me, nodes;
    me = this;
    nodes = LabeledBubble.__super__.nodes.apply(this, arguments);
    if (me.label) {
      nodes.push(me.label.node);
    }
    if (me.bufferlabel) {
      nodes.push(me.bufferlabel.node);
    }
    return nodes;
  };

  return LabeledBubble;

})(Bubble);

LabeledBubble.props = ['radius', 'style', 'class', 'title', 'labelattrs', 'buffer', 'center', 'attrs'];

LabeledBubble.layers = [];

kartograph.LabeledBubble = LabeledBubble;


/*
    kartograph - a svg mapping library
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */
var PieChart, drawPieChart,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PieChart = (function(superClass) {

  /*
  usage:
  new SymbolMap({
      map: map,
      radius: 10
      data: [25,75],
      colors: ['red', 'blue'],
      titles: ['red pie', 'blue pie']
  })
   */
  var me;

  extend(PieChart, superClass);

  me = null;

  function PieChart(opts) {
    var base, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
    me = this;
    PieChart.__super__.constructor.call(this, opts);
    me.radius = (ref = opts.radius) != null ? ref : 4;
    me.styles = (ref1 = opts.styles) != null ? ref1 : '';
    me.colors = (ref2 = opts.colors) != null ? ref2 : ['#3cc', '#c3c', '#33c', '#cc3'];
    me.titles = (ref3 = opts.titles) != null ? ref3 : ['', '', '', '', ''];
    me.values = (ref4 = opts.values) != null ? ref4 : [];
    me.border = (ref5 = opts.border) != null ? ref5 : false;
    me.borderWidth = (ref6 = opts.borderWidth) != null ? ref6 : 2;
    me["class"] = (ref7 = opts["class"]) != null ? ref7 : 'piechart';
    if ((base = Raphael.fn).pieChart == null) {
      base.pieChart = drawPieChart;
    }
  }

  PieChart.prototype.overlaps = function(bubble) {
    var dx, dy, r1, r2, ref, ref1, x1, x2, y1, y2;
    ref = [me.x, me.y, me.radius], x1 = ref[0], y1 = ref[1], r1 = ref[2];
    ref1 = [bubble.x, bubble.y, bubble.radius], x2 = ref1[0], y2 = ref1[1], r2 = ref1[2];
    if (x1 - r1 > x2 + r2 || x1 + r1 < x2 - r2 || y1 - r1 > y2 + r2 || y1 + r1 < y2 - r2) {
      return false;
    }
    dx = x1 - x2;
    dy = y1 - y2;
    if (dx * dx + dy * dy > (r1 + r2) * (r1 + r2)) {
      return false;
    }
    return true;
  };

  PieChart.prototype.render = function(layers) {
    var bg;
    me = this;
    if (me.border != null) {
      bg = me.layers.mapcanvas.circle(me.x, me.y, me.radius + me.borderWidth).attr({
        stroke: 'none',
        fill: me.border
      });
    }
    me.chart = me.layers.mapcanvas.pieChart(me.x, me.y, me.radius, me.values, me.titles, me.colors, "none");
    me.chart.push(bg);
    return me;
  };

  PieChart.prototype.update = function(opts) {
    var path;
    return;
    me.path.attr({
      x: me.x,
      y: me.y,
      r: me.radius
    });
    path = me.path;
    path.node.setAttribute('style', me.styles[0]);
    path.node.setAttribute('class', me["class"]);
    if (me.title != null) {
      path.attr('title', me.titles[0]);
    }
    return me;
  };

  PieChart.prototype.clear = function() {
    var k, len, p, ref;
    me = this;
    ref = me.chart;
    for (k = 0, len = ref.length; k < len; k++) {
      p = ref[k];
      p.remove();
    }
    return me;
  };

  PieChart.prototype.nodes = function() {
    var el, k, len, ref, results;
    ref = me.chart;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      el = ref[k];
      results.push(el.node);
    }
    return results;
  };

  return PieChart;

})(Symbol);

PieChart.props = ['radius', 'values', 'styles', 'class', 'titles', 'colors', 'border', 'borderWidth'];

PieChart.layers = [];

kartograph.PieChart = PieChart;


/*
pie chart extension for RaphaelJS
 */

drawPieChart = function(cx, cy, r, values, labels, colors, stroke) {
  var angle, chart, i, k, len, paper, process, rad, sector, total, v;
  if (isNaN(cx) || isNaN(cy) || isNaN(r)) {
    return [];
  }
  paper = this;
  rad = Math.PI / 180;
  chart = paper.set();
  sector = function(cx, cy, r, startAngle, endAngle, params) {
    var x1, x2, y1, y2;
    x1 = cx + r * Math.cos(-startAngle * rad);
    x2 = cx + r * Math.cos(-endAngle * rad);
    y1 = cy + r * Math.sin(-startAngle * rad);
    y2 = cy + r * Math.sin(-endAngle * rad);
    return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
  };
  angle = -270;
  total = 0;
  process = function(j) {
    var angleplus, color, delta, ms, p, popangle, value;
    value = values[j];
    angleplus = 360 * value / total;
    popangle = angle + (angleplus * 0.5);
    color = colors[j];
    ms = 500;
    delta = 30;
    p = sector(cx, cy, r, angle, angle + angleplus, {
      fill: color,
      stroke: stroke,
      'stroke-width': 1
    });
    p.mouseover(function() {
      p.stop().animate({
        transform: "s1.1 1.1 " + cx + " " + cy
      }, ms, "elastic");
    });
    p.mouseout(function() {
      p.stop().animate({
        transform: ""
      }, ms, "elastic");
    });
    angle += angleplus;
    chart.push(p);
  };
  for (k = 0, len = values.length; k < len; k++) {
    v = values[k];
    total += v;
  }
  for (i in values) {
    process(i);
  }
  return chart;
};


/*
    kartograph - a svg mapping library 
    Copyright (C) 2011,2012  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
 */


drawStackedBars = function (cx, cy, w, h, values, labels, colors, stroke) {
    var paper = this,
        chart = this.set();
    function bar(x, y, w, h, params) {
        return paper.rect(x,y,w,h).attr(params);
    }
    var yo = 0,
        total = 0,
        process = function (j) {
            var value = values[j],
                bh = h * value / total,
                x = cx - w*0.5,
                y = cy + h*0.5 - yo,
                bw = w,
                color = colors[j],
                ms = 500,
                delta = 30,
                p = bar(x, y-bh, bw, bh, {fill: color, stroke: stroke, "stroke-width": 1});
            
            yo += bh;
            
            p.mouseover(function () {
                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
            }).mouseout(function () {
                p.stop().animate({transform: ""}, ms, "elastic");
                
            });
            chart.push(p);
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};

;
var StackedBarChart,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

StackedBarChart = (function(superClass) {
  extend(StackedBarChart, superClass);


  /*
  usage:
  new SymbolMap({
      map: map,
      radius: 10
      data: [25,75],
      colors: ['red', 'blue'],
      titles: ['red pie', 'blue pie']
  })
   */

  function StackedBarChart(opts) {
    var base, me, ref, ref1, ref2, ref3, ref4, ref5, ref6;
    me = this;
    StackedBarChart.__super__.constructor.call(this, opts);
    me.styles = (ref = opts.styles) != null ? ref : '';
    me.colors = (ref1 = opts.colors) != null ? ref1 : [];
    me.titles = (ref2 = opts.titles) != null ? ref2 : ['', '', '', '', ''];
    me.values = (ref3 = opts.values) != null ? ref3 : [];
    me.width = (ref4 = opts.width) != null ? ref4 : 17;
    me.height = (ref5 = opts.height) != null ? ref5 : 30;
    me["class"] = (ref6 = opts["class"]) != null ? ref6 : 'barchart';
    if ((base = Raphael.fn).drawStackedBarChart == null) {
      base.drawStackedBarChart = drawStackedBars;
    }
  }

  StackedBarChart.prototype.overlaps = function(bubble) {
    var dx, dy, me, r1, r2, ref, ref1, x1, x2, y1, y2;
    me = this;
    ref = [me.x, me.y, me.radius], x1 = ref[0], y1 = ref[1], r1 = ref[2];
    ref1 = [bubble.x, bubble.y, bubble.radius], x2 = ref1[0], y2 = ref1[1], r2 = ref1[2];
    if (x1 - r1 > x2 + r2 || x1 + r1 < x2 - r2 || y1 - r1 > y2 + r2 || y1 + r1 < y2 - r2) {
      return false;
    }
    dx = x1 - x2;
    dy = y1 - y2;
    if (dx * dx + dy * dy > (r1 + r2) * (r1 + r2)) {
      return false;
    }
    return true;
  };

  StackedBarChart.prototype.render = function(layers) {
    var bg, h, me, w, x, y;
    me = this;
    w = me.width;
    h = me.height;
    x = me.x;
    y = me.y;
    bg = me.layers.mapcanvas.rect(x - w * 0.5 - 2, y - h * 0.5 - 2, w + 4, h + 4).attr({
      stroke: 'none',
      fill: '#fff'
    });
    me.chart = me.layers.mapcanvas.drawStackedBarChart(me.x, me.y, me.width, me.height, me.values, me.titles, me.colors, "none");
    me.chart.push(bg);
    return me;
  };

  StackedBarChart.prototype.update = function() {
    var me, path;
    me = this;
    return;
    me.path.attr({
      x: me.x,
      y: me.y,
      r: me.radius
    });
    path = me.path;
    path.node.setAttribute('style', me.styles[0]);
    path.node.setAttribute('class', me["class"]);
    if (me.title != null) {
      path.attr('title', me.titles[0]);
    }
    return me;
  };

  StackedBarChart.prototype.clear = function() {
    var i, len, me, p, ref;
    me = this;
    ref = me.chart;
    for (i = 0, len = ref.length; i < len; i++) {
      p = ref[i];
      p.remove();
    }
    me.chart = [];
    return me;
  };

  StackedBarChart.prototype.nodes = function() {
    var el, i, len, me, ref, results;
    me = this;
    ref = me.chart;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      el = ref[i];
      results.push(el.node);
    }
    return results;
  };

  return StackedBarChart;

})(kartograph.Symbol);

StackedBarChart.props = ['values', 'styles', 'class', 'titles', 'colors', 'width', 'height'];

StackedBarChart.layers = [];

kartograph.StackedBarChart = StackedBarChart;
