
import * as topojson from '../../web_modules/topojson-client.js';
import * as THREE from '../../web_modules/three.js';

var radius = 20;
var height = 20;
var width = 20;
var grid_step = 10;           
var material2 = new THREE.MeshBasicMaterial({ color: 0xFF00FF, wireframe: true, transparent: true });
function calcPosFromLatLonRad(lat, lon, radius) {
    var phi = (90 - lat) * (Math.PI / 180);
    var theta = (lon + 180) * (Math.PI / 180);
    var x = -(radius * Math.sin(phi) * Math.cos(theta));
    var y = (radius * Math.cos(phi));
    var z = (radius * Math.sin(phi) * Math.sin(theta));
    //return [x,y,z];
    return { x: x, y: y, z: z };
}
function vertex([longitude, latitude], radius) {
    const lambda = longitude * Math.PI / 180;
    const phi = latitude * Math.PI / 180;
    return new THREE.Vector3(
        radius * Math.cos(phi) * Math.cos(lambda),
        radius * Math.sin(phi),
        -radius * Math.cos(phi) * Math.sin(lambda)
    );
}
function wireframe(multilinestring, radius, material) {
    const geometry = new THREE.Geometry();
    for (const P of multilinestring.coordinates) {
        for (let p0, p1 = vertex(P[0], radius), i = 1; i < P.length; ++i) {
            geometry.vertices.push(p0 = p1, p1 = vertex(P[i], radius));
        }
    }
    return new THREE.LineSegments(geometry, material);
}
async function land(scene) {
    //const citres = await fetch("/data/cities.json");
    const response = await fetch("./data/land-50m.json");
    const topology = await response.json();
    const mesh = topojson.mesh(topology, topology.objects.land);
    return wireframe(mesh, radius, new THREE.LineBasicMaterial({ color: 0x00AACC }));
}
async function graticule() {
    const mesh = {
        type: "MultiLineString",
        coordinates: [].concat(
            Array.from(
                range(-180, 180, grid_step),
                x => x % 90 ? meridian(x, -80, 80) : meridian(x, -90, 90)
            ),
            Array.from(
                range(-80, 80 + 1e-6, grid_step),
                y => parallel(y, -180, 180)
            )
        )
    };
    return wireframe(mesh, radius, new THREE.LineBasicMaterial({ color: 0x7777FF }));
}
async function cities( scene ){
    const citres = await fetch("./data/cities_small.json");
    const cits = await citres.json();
    var citsx = cits.splice(-5000);
    for ( var c in citsx ){
        var x = c;
        var m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), material2);
        scene.add(m);
        var pos = calcPosFromLatLonRad( parseFloat(citsx[c]['lat']), parseFloat(citsx[c]['lng']), 20 );
        m.position.x = pos.x
        m.position.y = pos.y
        m.position.z = pos.z
    }
}
function meridian(x, y0, y1, dy = 2.5) {
    return Array.from(range(y0, y1 + 1e-6, dy), y => [x, y]);
}
function parallel(y, x0, x1, dx = 2.5) {
    return Array.from(range(x0, x1 + 1e-6, dx), x => [x, y]);
}
function* range(start, stop, step) {
    for (let i = 0, v = start; v < stop; v = start + (++i * step)) {
        yield v;
    }
}

export { cities, graticule, land , calcPosFromLatLonRad }