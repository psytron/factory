
import * as topojson from './../web_modules/topojson-client.js';
import * as THREE from './../web_modules/three.js';


// Reduce Proportional 
var de_scale = 208;
de_scale = 68

//  Kilometers (Km)
var iss_alt             =    440
var starlink_alt        =    550
var distance_to_iss     =    440
var starlink_distance   =    550
var moon_diameter_km    =   3476
var earth_diameter_km   =  12756
var distance_to_mediosat = 36000
var distance_to_moon    = 384400
var distance_from_earth_to_moon = 385000
var earth_diameter_un   = earth_diameter_km / de_scale;
var moon_diameter_un    = moon_diameter_km / de_scale;
var moon_distance_un = distance_from_earth_to_moon / de_scale ; 


var VIP_Accessible_reasource_units = '';
var breathable_air_units_per_citizen =''; // Square KM    Average_AQI_Under_10 


var pristine_cubic_meters_per_passport =9; //

 


var radius = 40;
var height = 40;
var width = 40;
var grid_step = 10;           


function getEarthRadius(){

    return earth_diameter_un / 2;
}

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


// lat lng sto3 
function getLatLng(vector, radius) {
    radius = radius || 200;
    
    var latRads = Math.acos(vector.y / radius);
    var lngRads = Math.atan2(vector.z, vector.x);
    var lat = (Math.PI / 2 - latRads) * (180 / Math.PI);
    var lng = (Math.PI - lngRads) * (180 / Math.PI);
    return [lat, lng - 180];
}


function getXYZ(lat, lng, radius) {
    radius = radius || 200;
    
    var latRads = ( 90 - lat) * Math.PI / 180;
    var lngRads = (180 - lng) * Math.PI / 180;
    
    var x = radius * Math.sin(latRads) * Math.cos(lngRads);
    var y = radius * Math.cos(latRads);
    var z = radius * Math.sin(latRads) * Math.sin(lngRads);
    return {x: x, y: y, z: z};
}
function calcLatLonFromPosRad( x,y,z ,radius){
    
    var phi = (90 - lat) * (Math.PI / 180);
    // 
    
    var theta = (lon + 180) * (Math.PI / 180);
    var x = -(radius * Math.sin(phi) * Math.cos(theta));
    var y = (radius * Math.cos(phi));
    var z = (radius * Math.sin(phi) * Math.sin(theta));
    //return [x,y,z];
    
};

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
    const geometry = new THREE.BufferGeometry();
    var points=[]
    for (const P of multilinestring.coordinates) {
        for (let p0, p1 = vertex(P[0], radius), i = 1; i < P.length; ++i) {
            points.push(p0 = p1, p1 = vertex(P[i], radius));
        }
    }
    geometry.setFromPoints(points)
    geometry.computeVertexNormals();
    return new THREE.LineSegments(geometry, material);
}
async function land(scene) {
    //const citres = await fetch("/data/cities.json");
    const response = await fetch("./data/land-50m.json");
    const topology = await response.json();
    const mesh = topojson.mesh(topology, topology.objects.land);
    return wireframe(mesh, earth_diameter_un/2, new THREE.LineBasicMaterial({ color: 0x00AACC }));
}
async function ocean( scene ){
    var geometry = new THREE.SphereGeometry( (earth_diameter_un/2)-0.01, 36, 18 );
    var material = new THREE.MeshBasicMaterial( 
        {
            color: 0x000055, 
            wireframe: false,
            opacity: 0.3,
            transparent: true
        } 
    
    );
    var sphere = new THREE.Mesh( geometry, material );
    return sphere; 
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
    return wireframe(mesh, earth_diameter_un/2, new THREE.LineBasicMaterial({ color: 0x333388 }));
}
async function moon_graticule() {
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
    return wireframe(mesh, moon_diameter_un/2, new THREE.LineBasicMaterial({ color: 0x7777FF }));
}

async function radius_graticule( rd ) {
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
    return wireframe(mesh, rd , new THREE.LineBasicMaterial({ color: 0x7777FF }));
}


async function cities( scene ){
    const citres = await fetch("./data/cities_small.json");
    const cits = await citres.json();
    var citsx = cits.splice(-5000);
    for ( var c in citsx ){
        var x = c;
        var m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), material2);
        scene.add(m);
        var pos = calcPosFromLatLonRad( parseFloat(citsx[c]['lat']), parseFloat(citsx[c]['lng']), earth_diameter_un/2 );
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

export { cities, graticule, moon_graticule, land , ocean, calcPosFromLatLonRad , getXYZ , getEarthRadius }