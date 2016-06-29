###
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
###


proj = kartograph.proj = root.kartograph.proj = {}

Function::bind = (scope) ->
    _function = @
    ->
        _function.apply scope,arguments


class Proj

    @parameters = []
    @title = "Projection"

    constructor: (opts) ->
        me = @
        me.lon0 = opts.lon0 ? 0
        me.lat0 = opts.lat0 ? 0
        me.PI = Math.PI
        me.HALFPI = me.PI * .5
        me.QUARTERPI = me.PI * .25
        me.RAD = me.PI / 180
        me.DEG = 180 / me.PI
        me.lam0 = me.rad(@lon0)
        me.phi0 = me.rad(@lat0)
        me.minLat = -90
        me.maxLat = 90

    rad: (a) ->
        a * @RAD

    deg: (a) ->
        a * @DEG

    plot: (polygon, truncate=true) ->
        points = []
        ignore = true
        for [lon,lat] in polygon
            vis = @_visible lon,lat
            if vis
                ignore = false
            [x,y] = @project lon,lat
            if not vis and truncate
                points.push @_truncate x,y
            else
                points.push [x,y]
        if ignore then null else [points]

    sea: ->
        s = @
        p = s.project.bind @
        o = []
        l0 = s.lon0
        s.lon0 = 0
        o.push(p(lon, s.maxLat)) for lon in [-180..180]
        o.push(p(180,lat)) for lat in [s.maxLat..s.minLat]
        o.push(p(lon, s.minLat)) for lon in [180..-180]
        o.push(p(-180,lat)) for lat in [s.minLat..s.maxLat]
        s.lon0 = l0
        o

    world_bbox: ->
        p = @project.bind @
        sea = @sea()
        bbox = new BBox()
        for s in sea
            bbox.update(s[0],s[1])
        bbox

    toString: ->
        me = @
        '[Proj: '+me.name+']'


Proj.fromXML = (xml) ->
    ###
    reconstructs a projection from xml description
    ###
    id = xml.getAttribute('id')
    opts = {}
    for i in [0..xml.attributes.length-1]
        attr = xml.attributes[i]
        if attr.name != "id"
            opts[attr.name] = attr.value
    if not proj[id]?
        throw 'unknown projection '+id
    prj = new proj[id](opts)
    prj.name = id
    prj

kartograph.Proj = Proj



# -------------------------------
# Family of Azimuthal Projecitons
# -------------------------------


class Azimuthal extends Proj
    ###
    Base class for azimuthal projections
    ###
    @parameters = ['lon0', 'lat0']
    @title = "Azimuthal Projection"

    constructor: (opts, rad=1000) ->
        super opts
        me = @
        me.r = rad
        me.elevation0 = me.to_elevation(me.lat0)
        me.azimuth0 = me.to_azimuth(me.lon0)

    to_elevation: (lat) ->
        me = @
        ((lat + 90) / 180) * me.PI - me.HALFPI

    to_azimuth: (lon) ->
        me = @
        ((lon + 180) / 360) * me.PI *2 - me.PI

    _visible: (lon, lat) ->
        me = @
        math = Math
        elevation = me.to_elevation(lat)
        azimuth = me.to_azimuth(lon)
        # work out if the point is visible
        cosc = math.sin(elevation)*math.sin(me.elevation0)+math.cos(me.elevation0)*math.cos(elevation)*math.cos(azimuth-me.azimuth0)
        cosc >= 0.0

    _truncate: (x, y) ->
        math = Math
        r = @r
        theta = math.atan2(y-r,x-r)
        x1 = r + r * math.cos(theta)
        y1 = r + r * math.sin(theta)
        [x1,y1]

    sea: ->
        out = []
        r = @r
        math = Math
        for phi in [0..360]
            out.push([r + math.cos(@rad(phi)) * r, r + math.sin(@rad(phi)) * r])
        out

    world_bbox: ->
        r = @r
        new BBox(0,0,r*2, r*2)


class Satellite extends Azimuthal
    ###
    General perspective projection, aka Satellite projection

    implementation taken from
    Snyder, Map projections - A working manual

    up .. angle the camera is turned away from north (clockwise)
    tilt .. angle the camera is tilted
    ###
    @parameters = ['lon0', 'lat0', 'tilt', 'dist', 'up']
    @title = "Satellite Projection"

    constructor: (opts) ->
        super { lon0: 0, lat0: 0 }
        @dist = opts.dist ? 3
        @up = @rad(opts.up ? 0)
        @tilt = @rad(opts.tilt ? 0)

        @scale = 1
        xmin = Number.MAX_VALUE
        xmax = Number.MAX_VALUE*-1
        for lat in [0..179]
            for lon in [0..360]
                xy = @project(lon-180,lat-90)
                xmin = Math.min(xy[0], xmin)
                xmax = Math.max(xy[0], xmax)
        @scale = (@r*2)/(xmax-xmin)
        super opts
        return


    project: (lon, lat, alt = 0) ->

        phi = @rad(lat)
        lam = @rad(lon)
        math = Math
        sin = math.sin
        cos = math.cos
        r = @r
        ra = r * (alt+6371)/3671

        cos_c = sin(@phi0) * sin(phi) + cos(@phi0) * cos(phi) * cos(lam - @lam0)
        k = (@dist - 1) / (@dist - cos_c)
        k = (@dist - 1) / (@dist - cos_c)

        k *= @scale

        xo = ra * k * cos(phi) * sin(lam - @lam0)
        yo = -ra * k * ( cos(@phi0)*sin(phi) - sin(@phi0)*cos(phi)*cos(lam - @lam0) )

        # tilt
        cos_up = cos(@up)
        sin_up = sin(@up)
        cos_tilt = cos(@tilt)
        sin_tilt = sin(@tilt)

        H = ra * (@dist - 1)
        A = ((yo * cos_up + xo * sin_up) * sin(@tilt)/H) + cos_tilt
        xt = (xo * cos_up - yo * sin_up) * cos(@tilt) /A
        yt = (yo * cos_up + xo * sin_up) / A

        x = r + xt
        y = r + yt

        [x,y]

    _visible: (lon, lat) ->
        elevation = @to_elevation(lat)
        azimuth = @to_azimuth(lon)
        math = Math
        # work out if the point is visible
        cosc = math.sin(elevation)*math.sin(@elevation0)+math.cos(@elevation0)*math.cos(elevation)*math.cos(azimuth-@azimuth0)
        cosc >= (1.0/@dist)

    sea: ->
        out = []
        r = @r
        math = Math
        for phi in [0..360]
            out.push([r + math.cos(@rad(phi)) * r, r + math.sin(@rad(phi)) * r])
        out

proj['satellite'] = Satellite

