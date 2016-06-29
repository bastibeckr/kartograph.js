
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

(function() {
  var $, Azimuthal, BBox, Bubble, Circle, CohenSutherland, HtmlLabel, K, Kartograph, LabeledBubble, LatLon, Line, LonLat, MapLayer, MapLayerPath, Path, Proj, REbraces, REcomment_string, REfull, REmunged, Satellite, SvgLabel, Symbol, SymbolGroup, View, __area, __is_clockwise, __point_in_polygon, __type, base1, base2, geom, kartograph, log, map_layer_path_uid, munge, munged, parsedeclarations, proj, resolve, restore, root, uid, warn,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = root.$K = root.kartograph != null ? root.kartograph : root.kartograph = {};

  kartograph.version = "0.8.7";

  $ = root.jQuery;

  kartograph.__verbose = false;

  warn = function(s) {
    var e, error1, error2;
    try {
      return console.warn.apply(console, arguments);
    } catch (error1) {
      e = error1;
      try {
        return opera.postError.apply(opera, arguments);
      } catch (error2) {
        e = error2;
        return alert(Array.prototype.join.call(arguments, ' '));
      }
    }
  };

  log = function(s) {
    var e, error1, error2;
    if (kartograph.__verbose) {
      try {
        return console.debug.apply(console, arguments);
      } catch (error1) {
        e = error1;
        try {
          return opera.postError.apply(opera, arguments);
        } catch (error2) {
          e = error2;
          return alert(Array.prototype.join.call(arguments, ' '));
        }
      }
    }
  };

  if ((base1 = String.prototype).trim == null) {
    base1.trim = function() {
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
    var classToType, len1, name, ref, t;
    classToType = {};
    ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
    for (t = 0, len1 = ref.length; t < len1; t++) {
      name = ref[t];
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
    return new BBox(x, y, w, h);
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

  if (kartograph.geom == null) {
    kartograph.geom = {};
  }

  if ((base2 = kartograph.geom).clipping == null) {
    base2.clipping = {};
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
      paper = Snap(vp.width, vp.height);
      cnt.append(paper.node);
      svg = $(paper.node);
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
      about = $('desc', paper.node).text();
      $('desc', paper.node).text(about.replace('with ', 'with kartograph ' + kartograph.version + ' and '));
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

    Kartograph.prototype.load = function(mapurl, callback, opts) {
      var base3, def, me;
      me = this;
      def = $.Deferred();
      me.clear();
      me.opts = opts != null ? opts : {};
      if ((base3 = me.opts).zoom == null) {
        base3.zoom = 1;
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

    Kartograph.prototype.loadMap = function() {
      return this.load.apply(this, arguments);
    };

    Kartograph.prototype.setMap = function(svg, opts) {
      var base3, me;
      me = this;
      me.opts = opts != null ? opts : {};
      if ((base3 = me.opts).zoom == null) {
        base3.zoom = 1;
      }
      me._lastMapUrl = 'string';
      me._mapLoaded(svg);
    };

    Kartograph.prototype._mapLoaded = function(xml) {
      var $view, AB, err, error1, h, halign, me, padding, ratio, ref, ref1, ref2, ref3, valign, vp, w, zoom;
      me = this;
      if (me.cacheMaps) {
        if (kartograph.__mapCache == null) {
          kartograph.__mapCache = {};
        }
        kartograph.__mapCache[me._lastMapUrl] = xml;
      }
      try {
        xml = $(xml);
      } catch (error1) {
        err = error1;
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
      me.viewAB = AB = View.fromXML($view[0]);
      padding = (ref = me.opts.padding) != null ? ref : 0;
      halign = (ref1 = me.opts.halign) != null ? ref1 : 'center';
      valign = (ref2 = me.opts.valign) != null ? ref2 : 'center';
      zoom = (ref3 = me.opts.zoom) != null ? ref3 : 1;
      me.viewBC = new View(me.viewAB.asBBox(), vp.width * zoom, vp.height * zoom, padding, halign, valign);
      me.proj = kartograph.Proj.fromXML($('proj', $view)[0]);
      if (me.mapLoadCallback != null) {
        me.mapLoadCallback(me);
      }
      if (me._loadMapDeferred != null) {
        me._loadMapDeferred.resolve(me);
      }
    };

    Kartograph.prototype.addLayer = function(id, opts) {
      var $paths, chunkSize, iter, layer, layer_id, layer_paper, me, moveOn, nextPaths, path_id, ref, rows, src_id, svgLayer, titles;
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
      layer_paper = me.paper;
      if (opts.add_svg_layer) {
        layer_paper = me.createSVGLayer();
      }
      if (layer_id == null) {
        layer_id = src_id;
      }
      svgLayer = $('#' + src_id, me.svgSrc);
      if (svgLayer.length === 0) {
        return;
      }
      layer = new MapLayer(layer_id, path_id, me, opts.filter, layer_paper);
      $paths = $('*', svgLayer[0]);
      rows = $paths.length;
      chunkSize = (ref = opts.chunks) != null ? ref : rows;
      iter = 0;
      nextPaths = function() {
        var base, i, prop, ref1, ref2, t, val;
        base = chunkSize * iter;
        for (i = t = 0, ref1 = chunkSize; 0 <= ref1 ? t < ref1 : t > ref1; i = 0 <= ref1 ? ++t : --t) {
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
        var checkEvents, evt, len1, t;
        if (layer.paths.length > 0) {
          me.layers[layer_id] = layer;
          me.layerIds.push(layer_id);
        }
        checkEvents = ['click', 'mouseenter', 'mouseleave', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout'];
        for (t = 0, len1 = checkEvents.length; t < len1; t++) {
          evt = checkEvents[t];
          if (__type(opts[evt]) === 'function') {
            layer.on(evt, opts[evt]);
          }
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
      var len1, marker, me, ref, t;
      me = this;
      ref = me.markers;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        marker = ref[t];
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
          var len1, results1, t;
          results1 = [];
          for (t = 0, len1 = paths.length; t < len1; t++) {
            path = paths[t];
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
      var cnt, halign, id, layer, len1, me, padding, ref, ref1, ref2, ref3, ref4, sg, t, valign, vp, zoom;
      me = this;
      cnt = me.container;
      if (w == null) {
        w = cnt.width();
      }
      if (h == null) {
        h = cnt.height();
      }
      me.viewport = vp = new BBox(0, 0, w, h);
      padding = (ref = me.opts.padding) != null ? ref : 0;
      halign = (ref1 = me.opts.halign) != null ? ref1 : 'center';
      valign = (ref2 = me.opts.valign) != null ? ref2 : 'center';
      zoom = me.opts.zoom;
      me.viewBC = new View(me.viewAB.asBBox(), vp.width * zoom, vp.height * zoom, padding, halign, valign);
      ref3 = me.layers;
      for (id in ref3) {
        layer = ref3[id];
        layer.setView(me.viewBC);
      }
      if (me.symbolGroups != null) {
        ref4 = me.symbolGroups;
        for (t = 0, len1 = ref4.length; t < len1; t++) {
          sg = ref4[t];
          sg.onResize();
        }
      }
    };

    Kartograph.prototype.lonlat2xy = function(lonlat) {
      var a, me;
      me = this;
      if (lonlat.length === 2) {
        lonlat = new LonLat(lonlat[0], lonlat[1]);
      }
      if (lonlat.length === 3) {
        lonlat = new LonLat(lonlat[0], lonlat[1], lonlat[2]);
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
      var len1, me, ref, results, sg, t;
      me = this;
      if (index != null) {
        return me.symbolGroups[index].remove();
      } else {
        ref = me.symbolGroups;
        results = [];
        for (t = 0, len1 = ref.length; t < len1; t++) {
          sg = ref[t];
          results.push(sg.remove());
        }
        return results;
      }
    };

    Kartograph.prototype.clear = function() {
      var id, len1, me, ref, sg, t;
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
        for (t = 0, len1 = ref.length; t < len1; t++) {
          sg = ref[t];
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
      $('body').append('<link rel="stylesheet" href="' + url + '" />');
      return callback();
    };

    Kartograph.prototype.applyCSS = function(el, className) {

      /*
      applies pre-loaded css styles to
      raphael elements
       */
      var classes, k, len1, len2, me, p, props, ref, ref1, sel, selectors, t, u;
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
        for (t = 0, len1 = ref.length; t < len1; t++) {
          selectors = ref[t];
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
          for (u = 0, len2 = ref1.length; u < len2; u++) {
            k = ref1[u];
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

  K = kartograph;

  root.kartograph = function(container, width, height) {
    return new Kartograph(container, width, height);
  };

  kartograph.map = function(container, width, height) {
    return new Kartograph(container, width, height);
  };

  kartograph.__mapCache = {};

  $.extend(root.kartograph, K);


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

  root.kartograph.LonLat = LonLat;

  root.kartograph.LatLon = LatLon;


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

  MapLayer = (function() {
    function MapLayer(layer_id, path_id, map, filter, paper) {
      var me;
      me = this;
      me.id = layer_id;
      me.path_id = path_id;
      me.paper = paper != null ? paper : map.paper;
      me.view = map.viewBC;
      me.map = map;
      me.filter = filter;
    }

    MapLayer.prototype.addPath = function(svg_path, titles) {
      var base3, layerPath, me, name1;
      me = this;
      if (me.paths == null) {
        me.paths = [];
      }
      layerPath = new MapLayerPath(svg_path, me.id, me, titles);
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
        if ((base3 = me.pathsById)[name1 = layerPath.data[me.path_id]] == null) {
          base3[name1] = [];
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
      var len1, me, path, pd, ref, t;
      me = this;
      pd = [];
      ref = me.paths;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        path = ref[t];
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
      var key, len1, match, matches, me, path, ref, t;
      me = this;
      matches = [];
      if (__type(query) === 'object') {
        ref = me.paths;
        for (t = 0, len1 = ref.length; t < len1; t++) {
          path = ref[t];
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
      var len1, me, path, ref, t;
      me = this;
      ref = me.paths;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        path = ref[t];
        path.setView(view);
      }
      return me;
    };

    MapLayer.prototype.remove = function() {

      /*
      removes every path
       */
      var len1, me, path, ref, results, t;
      me = this;
      ref = me.paths;
      results = [];
      for (t = 0, len1 = ref.length; t < len1; t++) {
        path = ref[t];
        results.push(path.remove());
      }
      return results;
    };

    MapLayer.prototype.style = function(props, value, duration, delay) {
      var key, me;
      me = this;
      if (__type(props) === "string") {
        key = props;
        props = {};
        props[key] = value;
      } else if (__type(props) === "object") {
        delay = duration;
        duration = value;
      }
      if (duration == null) {
        duration = 0;
      }
      $.each(me.paths, function(i, path) {
        var anim, attrs, dly, dur, prop, val;
        attrs = {};
        for (prop in props) {
          val = props[prop];
          attrs[prop] = resolve(val, path.data);
        }
        dur = resolve(duration, path.data);
        dly = resolve(delay, path.data);
        if (dly == null) {
          dly = 0;
        }
        if (dur > 0) {
          anim = Snap.animation(attrs, dur * 1000);
          return path.svgPath.animate(anim.delay(dly * 1000));
        } else {
          if (delay === 0) {
            return setTimeout(function() {
              return path.svgPath.attr(attrs);
            }, 0);
          } else {
            return path.svgPath.attr(attrs);
          }
        }
      });
      return me;
    };

    MapLayer.prototype.on = function(event, callback) {
      var EventContext, ctx, len1, me, path, ref, t;
      me = this;
      EventContext = (function() {
        function EventContext(type1, cb, layer1) {
          this.type = type1;
          this.cb = cb;
          this.layer = layer1;
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
      for (t = 0, len1 = ref.length; t < len1; t++) {
        path = ref[t];
        $(path.svgPath.node).bind(event, ctx.handle);
      }
      return me;
    };

    MapLayer.prototype.tooltips = function(content, delay) {
      var len1, me, path, ref, setTooltip, t, tt;
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
      for (t = 0, len1 = ref.length; t < len1; t++) {
        path = ref[t];
        tt = resolve(content, path.data);
        setTooltip(path, tt);
      }
      return me;
    };

    MapLayer.prototype.sort = function(sortBy) {
      var len1, lp, me, path, ref, t;
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
      for (t = 0, len1 = ref.length; t < len1; t++) {
        path = ref[t];
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

  MapLayerPath = (function() {
    function MapLayerPath(svg_path, layer_id, layer, titles) {
      var attr, data, i, map, me, paper, path, ref, t, title, uid, v, view, vn;
      me = this;
      paper = layer.paper;
      map = layer.map;
      view = map.viewBC;
      me.path = path = kartograph.geom.Path.fromSVG(svg_path);
      me.vpath = view.projectPath(path);
      me.svgPath = me.vpath.toSVG(paper);
      me.svgPath.data('path', me);
      if (map.styles == null) {
        me.svgPath.node.setAttribute('class', layer_id);
      } else {
        map.applyCSS(me.svgPath, layer_id);
      }
      uid = 'path_' + map_layer_path_uid++;
      me.svgPath.node.setAttribute('id', uid);
      map.pathById[uid] = me;
      data = {};
      for (i = t = 0, ref = svg_path.attributes.length - 1; 0 <= ref ? t <= ref : t >= ref; i = 0 <= ref ? ++t : --t) {
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

  kartograph.parsecss = function(str, callback) {
    var css, k, len1, props, ref, ret, t, v;
    ret = {};
    str = munge(str);
    ref = str.split('`b%');
    for (t = 0, len1 = ref.length; t < len1; t++) {
      css = ref[t];
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
    var decl, len1, parsed, ref, str, t;
    str = munged[index].replace(/^{|}$/g, '');
    str = munge(str);
    parsed = {};
    ref = str.split(';');
    for (t = 0, len1 = ref.length; t < len1; t++) {
      decl = ref[t];
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

  geom = kartograph.geom != null ? kartograph.geom : kartograph.geom = {};

  Path = (function() {

    /*
    	represents complex polygons (aka multi-polygons)
     */
    function Path(type, contours, closed) {
      var cnt, len1, self, t;
      if (closed == null) {
        closed = true;
      }
      self = this;
      self.type = type;
      self.contours = [];
      for (t = 0, len1 = contours.length; t < len1; t++) {
        cnt = contours[t];
        if (!__is_clockwise(cnt)) {
          cnt.reverse();
        }
        self.contours.push(cnt);
      }
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
      var contour, fst, glue, len1, len2, me, ref, ref1, str, t, u, x, y;
      me = this;
      str = "";
      glue = me.closed ? "Z M" : "M";
      ref = me.contours;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        contour = ref[t];
        fst = true;
        str += str === "" ? "M" : glue;
        for (u = 0, len2 = contour.length; u < len2; u++) {
          ref1 = contour[u], x = ref1[0], y = ref1[1];
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
      var area, cnt, len1, me, ref, t;
      me = this;
      if (me.areas != null) {
        return me._area;
      }
      me.areas = [];
      me._area = 0;
      ref = me.contours;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        cnt = ref[t];
        area = __area(cnt);
        me.areas.push(area);
        me._area += area;
      }
      return me._area;
    };

    Path.prototype.centroid = function() {
      var S, _lengths, a, aa, ab, area, cnt, cnt_orig, cx, cy, diff, dx, dy, i, j, k, l, len, me, p0, p1, ref, ref1, ref2, ref3, ref4, s, sp, t, total_len, u, w, x, x_, y, y_, z;
      me = this;
      if (me._centroid != null) {
        return me._centroid;
      }
      area = me.area();
      cx = cy = 0;
      for (i = t = 0, ref = me.contours.length - 1; 0 <= ref ? t <= ref : t >= ref; i = 0 <= ref ? ++t : --t) {
        cnt_orig = me.contours[i];
        cnt = [];
        l = cnt_orig.length;
        a = me.areas[i];
        k = a / area;
        if (k === 0) {
          continue;
        }
        for (j = u = 0, ref1 = l - 1; 0 <= ref1 ? u <= ref1 : u >= ref1; j = 0 <= ref1 ? ++u : --u) {
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
            for (s = z = 1, ref2 = S - 1; 1 <= ref2 ? z <= ref2 : z >= ref2; s = 1 <= ref2 ? ++z : --z) {
              sp = [p0[0] + s / S * (p1[0] - p0[0]), p0[1] + s / S * (p1[1] - p0[1])];
              cnt.push(sp);
            }
          }
        }
        x = y = x_ = y_ = 0;
        l = cnt.length;
        _lengths = [];
        total_len = 0;
        for (j = aa = 0, ref3 = l - 1; 0 <= ref3 ? aa <= ref3 : aa >= ref3; j = 0 <= ref3 ? ++aa : --aa) {
          p0 = cnt[j];
          p1 = cnt[(j + 1) % l];
          dx = p1[0] - p0[0];
          dy = p1[1] - p0[1];
          len = Math.sqrt(dx * dx + dy * dy);
          _lengths.push(len);
          total_len += len;
        }
        for (j = ab = 0, ref4 = l - 1; 0 <= ref4 ? ab <= ref4 : ab >= ref4; j = 0 <= ref4 ? ++ab : --ab) {
          p0 = cnt[j];
          w = _lengths[j] / total_len;
          x += w * p0[0];
          y += w * p0[1];
        }
        cx += x * k;
        cy += y * k;
      }
      me._centroid = [cx, cy];
      return me._centroid;
    };

    Path.prototype.isInside = function(x, y) {
      var bbox, cnt, i, me, ref, t;
      me = this;
      bbox = me._bbox;
      if (x < bbox[0] || x > bbox[2] || y < bbox[1] || y > bbox[3]) {
        return false;
      }
      for (i = t = 0, ref = me.contours.length - 1; 0 <= ref ? t <= ref : t >= ref; i = 0 <= ref ? ++t : --t) {
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

    function Circle(x3, y3, r3) {
      this.x = x3;
      this.y = y3;
      this.r = r3;
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
    var closed, cmd, contour, contours, cx, cy, len1, path_data, path_str, r, res, sep, t, type;
    contours = [];
    type = path.nodeName;
    res = null;
    if (type === "path") {
      path_str = path.getAttribute('d').trim();
      path_data = Snap.parsePathString(path_str);
      closed = path_data[path_data.length - 1] === "Z";
      sep = closed ? "Z M" : "M";
      contour = [];
      for (t = 0, len1 = path_data.length; t < len1; t++) {
        cmd = path_data[t];
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
      res = new geom.Path(type, contours, closed);
    } else if (type === "circle") {
      cx = path.getAttribute("cx");
      cy = path.getAttribute("cy");
      r = path.getAttribute("r");
      res = new geom.Circle(cx, cy, r);
    }
    return res;
  };

  Line = (function() {

    /*
    	represents simple lines
     */
    function Line(points1) {
      this.points = points1;
    }

    Line.prototype.clipToBBox = function(bbox) {
      var clip, err, error1, i, last_in, lines, p0x, p0y, p1x, p1y, pts, ref, ref1, ref2, ref3, self, t, x0, x1, y0, y1;
      self = this;
      clip = new geom.clipping.CohenSutherland().clip;
      pts = [];
      lines = [];
      last_in = false;
      for (i = t = 0, ref = self.points.length - 2; 0 <= ref ? t <= ref : t >= ref; i = 0 <= ref ? ++t : --t) {
        ref1 = self.points[i], p0x = ref1[0], p0y = ref1[1];
        ref2 = self.points[i + 1], p1x = ref2[0], p1y = ref2[1];
        try {
          ref3 = clip(bbox, p0x, p0y, p1x, p1y), x0 = ref3[0], y0 = ref3[1], x1 = ref3[2], y1 = ref3[3];
          last_in = true;
          pts.push([x0, y0]);
          if (p1x !== x1 || p1y !== y0 || i === len(self.points) - 2) {
            pts.push([x1, y1]);
          }
        } catch (error1) {
          err = error1;
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
      var len1, pts, ref, ref1, self, t, x, y;
      self = this;
      pts = [];
      ref = self.points;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        ref1 = ref[t], x = ref1[0], y = ref1[1];
        pts.push(x + ',' + y);
      }
      return 'M' + pts.join('L');
    };

    return Line;

  })();

  kartograph.geom.Line = Line;

  __point_in_polygon = function(polygon, p) {
    var angle, atan2, dtheta, i, n, pi, ref, t, theta1, theta2, twopi, x1, x2, y1, y2;
    pi = Math.PI;
    atan2 = Math.atan2;
    twopi = pi * 2;
    n = polygon.length;
    angle = 0;
    for (i = t = 0, ref = n - 1; 0 <= ref ? t <= ref : t >= ref; i = 0 <= ref ? ++t : --t) {
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

  __is_clockwise = function(contour) {
    return __area(contour) > 0;
  };

  __area = function(contour) {
    var i, n, ref, s, t, x1, x2, y1, y2;
    s = 0;
    n = contour.length;
    for (i = t = 0, ref = n; 0 <= ref ? t < ref : t > ref; i = 0 <= ref ? ++t : --t) {
      x1 = contour[i][0];
      y1 = contour[i][1];
      x2 = contour[(i + 1) % n][0];
      y2 = contour[(i + 1) % n][1];
      s += x1 * y2 - x2 * y1;
    }
    return s *= 0.5;
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

  proj = kartograph.proj = root.kartograph.proj = {};

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
      var ignore, lat, len1, lon, points, ref, ref1, t, vis, x, y;
      if (truncate == null) {
        truncate = true;
      }
      points = [];
      ignore = true;
      for (t = 0, len1 = polygon.length; t < len1; t++) {
        ref = polygon[t], lon = ref[0], lat = ref[1];
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
      var aa, l0, lat, lon, o, p, ref, ref1, ref2, ref3, s, t, u, z;
      s = this;
      p = s.project.bind(this);
      o = [];
      l0 = s.lon0;
      s.lon0 = 0;
      for (lon = t = -180; t <= 180; lon = ++t) {
        o.push(p(lon, s.maxLat));
      }
      for (lat = u = ref = s.maxLat, ref1 = s.minLat; ref <= ref1 ? u <= ref1 : u >= ref1; lat = ref <= ref1 ? ++u : --u) {
        o.push(p(180, lat));
      }
      for (lon = z = 180; z >= -180; lon = --z) {
        o.push(p(lon, s.minLat));
      }
      for (lat = aa = ref2 = s.minLat, ref3 = s.maxLat; ref2 <= ref3 ? aa <= ref3 : aa >= ref3; lat = ref2 <= ref3 ? ++aa : --aa) {
        o.push(p(-180, lat));
      }
      s.lon0 = l0;
      return o;
    };

    Proj.prototype.world_bbox = function() {
      var bbox, len1, p, s, sea, t;
      p = this.project.bind(this);
      sea = this.sea();
      bbox = new BBox();
      for (t = 0, len1 = sea.length; t < len1; t++) {
        s = sea[t];
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
    var attr, i, id, opts, prj, ref, t;
    id = xml.getAttribute('id');
    opts = {};
    for (i = t = 0, ref = xml.attributes.length - 1; 0 <= ref ? t <= ref : t >= ref; i = 0 <= ref ? ++t : --t) {
      attr = xml.attributes[i];
      if (attr.name !== "id") {
        opts[attr.name] = attr.value;
      }
    }
    if (proj[id] == null) {
      throw 'unknown projection ' + id;
    }
    prj = new proj[id](opts);
    prj.name = id;
    return prj;
  };

  kartograph.Proj = Proj;

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
      var math, out, phi, r, t;
      out = [];
      r = this.r;
      math = Math;
      for (phi = t = 0; t <= 360; phi = ++t) {
        out.push([r + math.cos(this.rad(phi)) * r, r + math.sin(this.rad(phi)) * r]);
      }
      return out;
    };

    Azimuthal.prototype.world_bbox = function() {
      var r;
      r = this.r;
      return new BBox(0, 0, r * 2, r * 2);
    };

    return Azimuthal;

  })(Proj);

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
      var lat, lon, ref, ref1, ref2, t, u, xmax, xmin, xy;
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
      for (lat = t = 0; t <= 179; lat = ++t) {
        for (lon = u = 0; u <= 360; lon = ++u) {
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
      A = ((yo * cos_up + xo * sin_up) * sin(this.tilt) / H) + cos_tilt;
      xt = (xo * cos_up - yo * sin_up) * cos(this.tilt) / A;
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
      var math, out, phi, r, t;
      out = [];
      r = this.r;
      math = Math;
      for (phi = t = 0; t <= 360; phi = ++t) {
        out.push([r + math.cos(this.rad(phi)) * r, r + math.sin(this.rad(phi)) * r]);
      }
      return out;
    };

    return Satellite;

  })(Azimuthal);

  proj['satellite'] = Satellite;


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
      var bbox, cont, contours, len1, len2, me, new_path, pcont, r, ref, ref1, ref2, ref3, t, u, x, y;
      me = this;
      if (path.type === "path") {
        contours = [];
        bbox = [99999, 99999, -99999, -99999];
        ref = path.contours;
        for (t = 0, len1 = ref.length; t < len1; t++) {
          pcont = ref[t];
          cont = [];
          for (u = 0, len2 = pcont.length; u < len2; u++) {
            ref1 = pcont[u], x = ref1[0], y = ref1[1];
            ref2 = me.project(x, y), x = ref2[0], y = ref2[1];
            cont.push([x, y]);
            bbox[0] = Math.min(bbox[0], x);
            bbox[1] = Math.min(bbox[1], y);
            bbox[2] = Math.max(bbox[2], x);
            bbox[3] = Math.max(bbox[3], y);
          }
          contours.push(cont);
        }
        new_path = new geom.Path(path.type, contours, path.closed);
        new_path._bbox = bbox;
        return new_path;
      } else if (path.type === "circle") {
        ref3 = me.project(path.x, path.y), x = ref3[0], y = ref3[1];
        r = path.r * me.scale;
        return new geom.Circle(x, y, r);
      }
    };

    View.prototype.asBBox = function() {
      var me;
      me = this;
      return new BBox(0, 0, me.width, me.height);
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
    return new View(bbox, w, h, pad);
  };

  root.kartograph.View = View;


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

  SymbolGroup = (function() {

    /* symbol groups
    
    Usage:
    new $K.SymbolGroup(options);
    map.addSymbols(options)
     */
    var me;

    me = null;

    function SymbolGroup(opts) {
      this._noverlap = bind(this._noverlap, this);
      this._kMeans = bind(this._kMeans, this);
      var SymbolType, aa, d, i, id, l, layer, len1, len2, len3, len4, nid, optional, p, ref, ref1, required, t, u, z;
      me = this;
      required = ['data', 'location', 'type', 'map'];
      optional = ['filter', 'tooltip', 'click', 'delay', 'sortBy', 'clustering', 'aggregate', 'clusteringOpts', 'mouseenter', 'mouseleave'];
      for (t = 0, len1 = required.length; t < len1; t++) {
        p = required[t];
        if (opts[p] != null) {
          me[p] = opts[p];
        } else {
          throw "SymbolGroup: missing argument '" + p + "'";
        }
      }
      for (u = 0, len2 = optional.length; u < len2; u++) {
        p = optional[u];
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
      for (z = 0, len3 = ref.length; z < len3; z++) {
        p = ref[z];
        if (opts[p] != null) {
          me[p] = opts[p];
        }
      }
      me.layers = {
        mapcanvas: me.map.paper
      };
      ref1 = SymbolType.layers;
      for (aa = 0, len4 = ref1.length; aa < len4; aa++) {
        l = ref1[aa];
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
      var SymbolType, len1, ll, p, ref, sprops, symbol, t;
      me = this;
      SymbolType = me.type;
      ll = me._evaluate(me.location, data, key);
      if (__type(ll) === 'array') {
        ll = new LonLat(ll[0], ll[1]);
      }
      sprops = {
        layers: me.layers,
        location: ll,
        data: data,
        key: key != null ? key : me.symbols.length,
        map: me.map
      };
      ref = SymbolType.props;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        p = ref[t];
        if (me[p] != null) {
          sprops[p] = me._evaluate(me[p], data, key);
        }
      }
      symbol = new SymbolType(sprops);
      me.symbols.push(symbol);
      return symbol;
    };

    SymbolGroup.prototype.layout = function() {
      var layer_id, len1, ll, path, path_id, ref, ref1, s, t, xy;
      ref = me.symbols;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        s = ref[t];
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
      var len1, len2, node, ref, ref1, ref2, s, sortBy, sortDir, t, u;
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
      for (t = 0, len1 = ref1.length; t < len1; t++) {
        s = ref1[t];
        s.render();
        ref2 = s.nodes();
        for (u = 0, len2 = ref2.length; u < len2; u++) {
          node = ref2[u];
          node.symbol = s;
        }
      }
      $.each(['click', 'mouseenter', 'mouseleave'], function(i, evt) {
        var len3, ref3, results, z;
        if (__type(me[evt]) === "function") {
          ref3 = me.symbols;
          results = [];
          for (z = 0, len3 = ref3.length; z < len3; z++) {
            s = ref3[z];
            results.push((function() {
              var aa, len4, ref4, results1;
              ref4 = s.nodes();
              results1 = [];
              for (aa = 0, len4 = ref4.length; aa < len4; aa++) {
                node = ref4[aa];
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

    SymbolGroup.prototype.remove = function(filter) {
      var error, error1, id, kept, layer, len1, ref, ref1, results, s, t;
      me = this;
      kept = [];
      ref = me.symbols;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        s = ref[t];
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
      var SymbolType, aa, cluster, d, i, len1, len2, len3, len4, mean, means, out, p, ref, ref1, ref2, s, size, sprops, t, u, z;
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
      for (t = 0, len1 = ref.length; t < len1; t++) {
        s = ref[t];
        cluster.add({
          x: s.x,
          y: s.y
        });
      }
      means = cluster.means();
      out = [];
      for (u = 0, len2 = means.length; u < len2; u++) {
        mean = means[u];
        if (mean.size === 0) {
          continue;
        }
        d = [];
        ref1 = mean.indices;
        for (z = 0, len3 = ref1.length; z < len3; z++) {
          i = ref1[z];
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
        for (aa = 0, len4 = ref2.length; aa < len4; aa++) {
          p = ref2[aa];
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
      var SymbolType, aa, ab, ac, b0, b1, d, dx, dy, i, intersects, iterations, l, l0, l1, len1, len2, len3, maxRatio, out, p, q, r, r0, r1, rad0, rad1, ref, ref1, ref2, ref3, ref4, s, s0, s1, sprops, symbols, t, t0, t1, tolerance, u, w, x, y, z;
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
      for (i = t = 0, ref = iterations - 1; 0 <= ref ? t <= ref : t >= ref; i = 0 <= ref ? ++t : --t) {
        symbols.sort(function(a, b) {
          return b.radius - a.radius;
        });
        l = symbols.length;
        out = [];
        for (p = u = 0, ref1 = l - 3; 0 <= ref1 ? u <= ref1 : u >= ref1; p = 0 <= ref1 ? ++u : --u) {
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
          for (q = z = ref2 = p + 1, ref3 = l - 2; ref2 <= ref3 ? z <= ref3 : z >= ref3; q = ref2 <= ref3 ? ++z : --z) {
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
            for (aa = 0, len1 = intersects.length; aa < len1; aa++) {
              i = intersects[aa];
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
            for (ab = 0, len2 = ref4.length; ab < len2; ab++) {
              p = ref4[ab];
              if (me[p] != null) {
                sprops[p] = me._evaluate(me[p], d);
              }
            }
            s = new SymbolType(sprops);
            w = s0.radius * s0.radius / r;
            x = s0.x * w;
            y = s0.y * w;
            for (ac = 0, len3 = intersects.length; ac < len3; ac++) {
              i = intersects[ac];
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

    SymbolGroup.prototype.onResize = function() {
      var len1, ref, s, t;
      me = this;
      me.layout();
      ref = me.symbols;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        s = ref[t];
        s.update();
      }
    };

    SymbolGroup.prototype.update = function(opts, duration, easing) {
      var len1, len2, p, ref, ref1, s, t, u;
      me = this;
      if (opts == null) {
        opts = {};
      }
      ref = me.symbols;
      for (t = 0, len1 = ref.length; t < len1; t++) {
        s = ref[t];
        ref1 = me.type.props;
        for (u = 0, len2 = ref1.length; u < len2; u++) {
          p = ref1[u];
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

  Kartograph.prototype.addSymbols = function(opts) {
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
    var A, B, apply, d, ds, dx, dy, f, i, j, nodes, r, rd, ref, rs, t;
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
      var len1, n, t;
      for (t = 0, len1 = nodes.length; t < len1; t++) {
        n = nodes[t];
        symbolgroup.symbols[n.i].path.attr({
          cx: n.x,
          cy: n.y
        });
      }
    };
    for (r = t = 1, ref = iterations; 1 <= ref ? t <= ref : t >= ref; r = 1 <= ref ? ++t : --t) {
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

  root.kartograph.Bubble = Bubble;


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

  root.kartograph.Label = SvgLabel;

  HtmlLabel = (function(superClass) {
    extend(HtmlLabel, superClass);

    function HtmlLabel(opts) {
      var me, ref, ref1, ref2;
      me = this;
      HtmlLabel.__super__.constructor.call(this, opts);
      me.text = (ref = opts.text) != null ? ref : '';
      me.css = (ref1 = opts.css) != null ? ref1 : '';
      me["class"] = (ref2 = opts["class"]) != null ? ref2 : '';
    }

    HtmlLabel.prototype.render = function(layers) {
      var l, lbl, me;
      me = this;
      l = $('<div>' + me.text + '</div>');
      l.css({
        width: '80px',
        position: 'absolute',
        left: '-40px',
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
      me.lbl.css({
        position: 'absolute',
        left: me.x + 'px',
        top: me.y + 'px'
      });
      return me.lbl.css(me.css);
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

  HtmlLabel.props = ['text', 'css', 'class'];

  HtmlLabel.layers = [
    {
      id: 'lbl',
      type: 'html'
    }
  ];

  root.kartograph.HtmlLabel = HtmlLabel;


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

  root.kartograph.LabeledBubble = LabeledBubble;

}).call(this);
