import * as THREE from '../web_modules/three.js'
import { GLTFLoader , FontLoader , BoxLineGeometry as Geometry} from '../web_modules/three/addons.js'
//import { BoxLineGeometry as Geometry } from '../web_modules/three/examples/jsm/geometries/BoxLineGeometry.js'
import { XCOLORS , xcolors } from '../x_modules/xcolors.js'
import * as globe from './globe.js'

////// ELEMENT FACTORY ////
function Factory3d() {
    
    this.earthRadius = globe.getEarthRadius();
    
    ////// FONTS ////
    window.lefont;
    //this.loader = new THREE.FontLoader();
    this.loader = new FontLoader();

    

    this.loadFonts=function(){
            //loader.load( 'fonts/nasa.small.json', function ( font ) {
        loader.load( './fonts/helvetiker_regular.typeface.json', function ( font ) {
            this.lefont = font;
            window.lefont = font;
        }.bind(this));
    }

    ////// LOAD GLTF ////
    this.loaderx = new GLTFLoader();
    this.models = {};
    this.loadModelX=function( url ) {
        if ( this.models[ url ] ) {
            return this.models[ url ].then( ( o ) => o.clone() );
        }
        return this.models[ url ] = new Promise( ( resolve, reject ) => {
            this.loaderx.load( url, function ( gltf ) {
                resolve( gltf.scene );
            }, undefined, reject );
        });
    };
    this.loadFonts = async function( ){
        return new Promise( ( resolve, reject ) => {
            var loader = new FontLoader();
            //loader.load( 'fonts/nasa.small.json', function ( font ) {
            loader.load( './fonts/helvetiker_regular.typeface.json', function ( font ) {
                this.lefont = font;
                window.lefont = font;
                resolve( font ); 
            }.bind(this));
        })
    }



    this.renderObject=function( obj ) {
        // should do magic parsing 
        var url = obj.mesh ? obj.mesh : 'bluecube.glb'
        var loadTextureX= this.loadTextureX;
        var createBasePlane=this.createBasePlane;
        
        // SKIP CLONE FOR NOW
        //if ( this.models[ url ] ) {
        //    return this.models[ url ].then( ( o ) => o.clone() );
        //}
        
        //WORKS TEXTUR 
        // const texture = new THREE.TextureLoader().load( './media/domain/balancer.png' );
        // texture.colorSpace = THREE.SRGBColorSpace;
        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshBasicMaterial( { map: texture } );
        // var mesh = new THREE.Mesh( geometry, material );   
        //WORKS TEXTIRs
        
        return this.models[ url ] = new Promise( ( resolve, reject ) => {
            this.loaderx.load( url, function ( gltf ) {
                if( obj.img ){
                    loadTextureX( obj.img ).then( (tex)=>{
                        var mesh = gltf.scene;
                        mesh.traverse(function(node) {
                            try{
                                if( node.isMesh && node.material.name =='xlogo' ){
                                    node.material.map = tex;    //r1
                                    var f=3;
                                } 
                            }catch(e ){
                                console.log(' Traverse for texture fail ')
                            }
                        });
                        if( obj.baseplane ){
                            mesh.add( createBasePlane() )    
                        }
                        resolve( gltf.scene ); 
                    }, ( reason )  => {
                        console.log(' reas ', reason)
                        resolve( gltf.scene ); 
                    })                   
                        
                }else{
                    var mesh = gltf.scene;
                    if( obj.baseplane ){
                        mesh.add( createBasePlane() )    
                    }                    
                    resolve( gltf.scene );
                }
            }, undefined, reject );
        });
    };

    this.createBasePlane=function(){

        var geo = new THREE.PlaneGeometry( 4, 4, 1, 1 );
        var mat = new THREE.MeshBasicMaterial({ color: XCOLORS.avatarbase , side: THREE.DoubleSide , wireframe:true });
        var plane = new THREE.Mesh(geo, mat);
        plane.rotateX( - Math.PI / 2);
        plane.position.set( 0,0,0 )
        return plane;
    }

    this.renderObjectNon=function( initObj ) {
        
        //var data = initObj.data ? initObj.data : {}
        var meshurl = initObj.mesh ? initObj.mesh : '/models3d/bluecube.glb'
        //var imgurl = initObj.img ? initObj.img : '/img/plain.png'
        
        if ( this.models[ meshurl ] ) {
            return this.models[ meshurl ].then( ( o ) => o.clone() );
        }
        return this.models[ meshurl ] = new Promise( ( resolve, reject ) => {
            if( initObj.img ){
                this.loaderx.load( meshurl, function ( gltf ) {
                    loadTextureX(imgurl).then( (tex)=>{
                        var mesh = gltf.scene;
                        mesh.traverse(function(node) {
                            try{
                                if( node.isMesh ) node.material.map = tex;  
                            }catch(e ){
                                console.log(' Traverse for texture fail ')
                            }
                        });                    
                        resolve( gltf.scene ); 
                    })
                }, undefined, reject );                
            }else{
                this.loaderx.load( meshurl, function ( gltf ) {
                    resolve( gltf ); 
                }, undefined, reject );                
            }
        });
    };

    this.renderObjX=function( initObj ) {
        
        //var data = initObj.data ? initObj.data : {}
        var meshurl = initObj.mesh ? initObj.mesh : '/models3d/bluecube.glb'
        var imgurl = initObj.img ? initObj.img : '/img/plain.png'
        
        if ( this.models[ meshurl ] ) {
            return this.models[ meshurl ].then( ( o ) => o.clone() );
        }
        return this.models[ meshurl ] = new Promise( ( resolve, reject ) => {
            if( initObj.img ){
                this.loaderx.load( meshurl, function ( gltf ) {
                    loadTextureX(imgurl).then( (tex)=>{
                        tex.flipY = true; 
                        tex.mapping = THREE.EquirectangularReflectionMapping;
                        var mesh = gltf.scene;
                        mesh.traverse(function(node) {
                            try{
                                if( node.isMesh ) node.material.map = tex;  
                            }catch(e ){
                                console.log(' Traverse for texture fail ')
                            }
                        });                    
                        resolve( mesh ); 
                    })
                }, undefined, reject );                
            }else{
                this.loaderx.load( meshurl, function ( gltf ) {
                    resolve( gltf ); 
                }, undefined, reject );                
            }
        });
    };

    ////// LOAD TEXTURE //// 
    this.tloader = new THREE.TextureLoader();
    this.textures = {};
    this.loadTextureX=function( url ){
        // Texture is not cloning 
        //if ( this.textures[ url ] ) {
        //    return this.textures[ url ].then( ( o ) => o.clone() );
        //}
        return this.textures[ url ] = new Promise( ( resolve, reject ) => {
            this.tloader.load( url, function ( texture ) {
                texture.flipY = false;
                texture.colorSpace = THREE.SRGBColorSpace;
                resolve( texture );
            }, undefined, reject );
        });
    }.bind(this);    
   
    ////// GEOM CLONES //// 
    var exch_height=6;
    var sphereGeometryDot = new THREE.SphereGeometry(1.0,7,9);
    var sphereMeshDot = new THREE.MeshBasicMaterial({ color:XCOLORS.node_color, wireframe: false });
    var cylynderGeometryA = new THREE.CylinderGeometry( 5, 5, exch_height, 10 );
    var cylynderMeshA = new THREE.MeshBasicMaterial( {color:XCOLORS.dbase , wireframe: false });
    

    // get clone 
    this.getClone=function( identifier_in , conf={ } ){
        //return this.avatars[ identifier_in ].clone(false);
        //return this.avatars[ identifier_in ];
        switch ( identifier_in ) {

            case 'route':
                this.vpath = new THREE.Mesh();
                //return this.vpath;
            
                // STRAIGHT LINE 
                //var lineGeom = new THREE.BufferGeometry();
                var linePoints = [];
                for( var p in conf.geometry ){

                    var lineGeom = new THREE.BufferGeometry();
                    var coordslot = conf.geometry[p];
                    if( typeof(coordslot[0])=="object" ){
                        
                        var linePoints = [];
                        for( var s in coordslot ){

                            var curpoint = coordslot[s];
                            var pobj = globe.calcPosFromLatLonRad( curpoint[1] , curpoint[0] , this.earthRadius + 1  ); // model.meta.radius //  
                            //var xyzvec = convert( long , lat , rad );
                            //lineGeom.vertices.push(pobj);      
                            linePoints.push( pobj );
                        }
                        var lineGeom = new THREE.BufferGeometry();                    
                        var lineMat = new THREE.LineBasicMaterial({ color:conf.color ,linewidth:1.0, transparent: false, opacity: 0.7 , linecap:'round' });
                        lineGeom.setFromPoints( linePoints )
                        this.linexx = new THREE.Line( lineGeom, lineMat );
                        this.vpath.add( this.linexx )                        
                        
                    }else{
                        var linePoints = [];
                        var curpoint = conf.geometry[0][p];
                        var pobj = globe.calcPosFromLatLonRad( curpoint[0] , curpoint[1] , this.earthRadius + 1 ); // model.meta.radius //  
                        //var xyzvec = convert( long , lat , rad );
                        linePoints.push(pobj);
                        var lineMat = new THREE.LineBasicMaterial({ color:this.color ,linewidth:1.0, transparent: false, opacity: 0.7 , linecap:'round' });
                        this.linexx = new THREE.Line( lineGeom, lineMat );
                        this.vpath.add( this.linexx )  
                    }
                    var l = 9;   
                    //var erad = this.

                }
                
                //lineGeom.vertices.push(this.a.position);
                //lineGeom.vertices.push(this.b.position);
                //var lineMat = new THREE.LineBasicMaterial({ color:this.color ,linewidth:1.0, transparent: true, opacity: 0.7 , linecap:'round' });
                //this.linexx = new THREE.Line( lineGeom, lineMat );
                //this.vpath.add( this.linexx )
                return this.vpath;
                break;
                //var color1 = xcolors.confOrRandom( conf );getClone
                
            case 'exchange':
                // EXCHANGE
                this.exchange = new THREE.Mesh();
                var exch_height=6;
                var cylinder = new THREE.Mesh(
                    cylynderGeometryA ,
                    cylynderMeshA );
                cylinder.position.y=exch_height/2;
                this.exchange.add( cylinder );
                return this.exchange;
                break;
            case 'dot':
                this.dot = new THREE.Mesh();

                var color1 = xcolors.confOrRandom( conf );
                
                var sphereMeshDot1 = new THREE.MeshBasicMaterial({ color:color1, wireframe: false });
                var sphere = new THREE.Mesh(
                    sphereGeometryDot ,
                    sphereMeshDot1 );
                this.dot.add( sphere );
                return this.dot;
                break;
            // YOU ARE HERE RENDERING INTO METAVIEW ON SWARMVIEW:::: 
            case 'globe':
                var g = new THREE.Mesh();
                
                globe.graticule().then( function( obn ){
                    g.add( obn );
                }.bind(this), function( err ){ console.log( 'globe err:', err) ; });            
     
                globe.land( this.glob).then(function (obn) {
                    g.add(obn);
                }.bind( this ), function (err){ console.log( 'globe err:', err );  });

                globe.ocean( this.glob).then(function (obn) {
                    g.add(obn);
                }.bind( this ), function (err){ console.log( 'globe err:', err );  });                


                // cities temp down 
                //globe.cities(g).then(function (obn) {
                //    g.add(obn);
                //}.bind( this ), function (err){ console.log( 'globe err:', err );  });
                
                //g.scale.set(2,2,2) 
                return g; 
                break;
            case 'dot_instanced':
                var sphereGeometryDot = new THREE.SphereGeometry(1.0,7,9);
                var sphereMeshDot = new THREE.MeshBasicMaterial({ color:XCOLORS.node_color, wireframe: false });
                this.dot = new THREE.Mesh();

                var color1 = xcolors.confOrRandom( conf );
                
                var sphereMeshDot1 = new THREE.MeshBasicMaterial({ color:color1, wireframe: false });
                var sphere = new THREE.Mesh(
                    sphereGeometryDot ,
                    sphereMeshDot1 );
                this.dot.add( sphere );
                     
                // INSTANCED 
                const matrix = new THREE.Matrix4();
                const mesh = new THREE.InstancedMesh( sphereGeometryDot, sphereMeshDot, 500 );

                for ( let i = 0; i < 500; i ++ ) {
                    randomizeMatrix( matrix );
                    mesh.setMatrixAt( i, matrix );
                }

                return mesh ;

                break;
            case 'moon':
                var moon = new THREE.Mesh();
                
                globe.moon_graticule().then( function( obn ){
                    moon.add( obn );
                }.bind(this), function( err ){ console.log( 'globe err:', err) ; });    

                return moon;
                break;        
            case 'moonb':
                var moonb = new THREE.Mesh();
                
                globe.graticule().then( function( obn ){
                    moonb.add( obn );
                }.bind(this), function( err ){ console.log( 'globe err:', err) ; });    

                return moonb;
                break;                        
            case 'grid':
                this.grid = new THREE.Mesh();

                var axis_color = "#CCCCCC"
                var colors = ["#390099","#0096a6","#5555AA","#6666CC","#7777FF"]
                this.color = colors[Math.round( Math.random()*3) ];
                var tcolor = XCOLORS.floor_line;
                var l_material = new THREE.LineBasicMaterial( { color:this.color , linewidth:1 } );/* linewidth on windows will always be 1 */
                var total_lines=19;//31;
                var one_space=10;
                var line_length =((total_lines*one_space)-one_space)/2;
                var half_offset= -Math.floor(total_lines/2)*one_space;
                var grid_y = 0; // or -60 for below . 
    
                for( var i=0; i<total_lines; i++){
                    var geometry = new THREE.BufferGeometry();
                    var vertices = new Float32Array([
                        0, grid_y, line_length, //x, y, z
                        0, grid_y, -line_length
                    ]);
                    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                    
                    var line = new THREE.Line(geometry, l_material);
                    var newpos = half_offset + (i * one_space);
                    line.position.x = newpos;
                    this.grid.add(line);

                    var line = new THREE.Line(geometry, l_material);
                    line.position.z = newpos;
                    line.rotation.y = Math.PI / 2;
                    this.grid.add(line);
                }                
                return this.grid;                 
                break;
          
            case 'cyberframe':
                this.grid = new THREE.Mesh();

                var axis_color = "#CCCCCC"
                var colors = ["#390099","#0096a6","#5555AA","#6666CC","#7777FF"]
                this.color = colors[Math.round( Math.random()*3) ];
                var tcolor = XCOLORS.floor_line;
                var l_material = new THREE.LineBasicMaterial( { color:this.color , linewidth:1 } );/* linewidth on windows will always be 1 */
                var total_lines=19;//31;
                var one_space=10;
                var line_length =((total_lines*one_space)-one_space)/2;
                var half_offset= -Math.floor(total_lines/2)*one_space;
                var grid_y = 0; // or -60 for below . 
    
                for( var i=0; i<total_lines; i++){
                    var geometry = new BoxLineGeometry();
                    geometry.vertices.push( new THREE.Vector3( 0, grid_y, line_length ) ); //x, y, z
                    geometry.vertices.push( new THREE.Vector3( 0, grid_y,-line_length ) );
    
                    var line = new THREE.Line(geometry, l_material);
                    var newpos = half_offset+(i*one_space)
                    line.position.x=newpos;
                    this.grid.add(line);
    
                    var line = new THREE.Line(geometry, l_material);
                    var newpos = half_offset+(i*one_space)
                    line.position.z=newpos;
                    line.rotation.y=Math.PI/2;
                    this.grid.add(line);
                }                
                return this.grid;                 
                break;                
            case 'frame':
                this.dot1 = new THREE.Mesh();
                var bs=25;
                var hf=bs;
                var coord1 = this.getClone('coord') 
                var coord2 = this.getClone('coord') 
                var coord3 = this.getClone('coord') 
                var coord4 = this.getClone('coord') 
                var coord5 = this.getClone('coord') 
                var coord6 = this.getClone('coord') 
                var coord7 = this.getClone('coord') 
                var coord8 = this.getClone('coord')                 
                coord1.position.set( -bs , hf , bs )
                coord2.position.set( -bs , hf , -bs )
                coord3.position.set( bs , hf , -bs )
                coord4.position.set( bs , hf , bs )
                coord5.position.set( -bs , -hf , bs )
                coord6.position.set( -bs , -hf , -bs )
                coord7.position.set( bs , -hf , -bs )
                coord8.position.set( bs , -hf , bs )                
                this.dot1.add( coord1 )
                this.dot1.add( coord2 )
                this.dot1.add( coord3 )
                this.dot1.add( coord4 )
                this.dot1.add( coord5 )
                this.dot1.add( coord6 )
                this.dot1.add( coord7 )
                this.dot1.add( coord8 )                
                return this.dot1;                 
                break;
            

            case 'coord':                
                this.coord = new THREE.Mesh();
                var l_material = new THREE.LineBasicMaterial( { color:'#00FFFF' , linewidth:1 } );/* linewidth on windows will always be 1 */
                var total_lines=19;//31;
                var one_space=11;
                var line_length =((total_lines*one_space)-one_space)/2;
                var half_offset= -Math.floor(total_lines/2)*one_space;
                var grid_y = 0; // or -60 for below . 
                
                // update Buffer Geom like so 
                //https://sbcode.net/threejs/geometry-to-buffergeometry/
                // const material = new THREE.MeshNormalMaterial()
                // let geometry = new THREE.BufferGeometry()
                // const points = [
                //     new THREE.Vector3(-1, 1, -1), //c
                //     new THREE.Vector3(-1, -1, 1), //b
                //     new THREE.Vector3(1, 1, 1), //a
                
                //     new THREE.Vector3(1, 1, 1), //a
                //     new THREE.Vector3(1, -1, -1), //d
                //     new THREE.Vector3(-1, 1, -1), //c
                
                //     new THREE.Vector3(-1, -1, 1), //b
                //     new THREE.Vector3(1, -1, -1), //d
                //     new THREE.Vector3(1, 1, 1), //a
                
                //     new THREE.Vector3(-1, 1, -1), //c
                //     new THREE.Vector3(1, -1, -1), //d
                //     new THREE.Vector3(-1, -1, 1), //b
                // ]
                // geometry.setFromPoints(points)
                // geometry.computeVertexNormals()
                // const mesh = new THREE.Mesh(geometry, material)
                // scene.add(mesh)        


                var geometry = new THREE.BufferGeometry();
                geometry.setFromPoints(  new THREE.Vector3( 0, 0,-0.1 ) , new THREE.Vector3( 0, 0, 0.1 )  );
                geometry.computeVertexNormals();

                var geometry2 = new THREE.BufferGeometry();
                geometry2.setFromPoints( new THREE.Vector3( 0, 0, 0 ) , new THREE.Vector3( 0, 6,0 ) );
                geometry2.computeVertexNormals();
                
                var geometry3 = new THREE.BufferGeometry();
                geometry3.setFromPoints( new THREE.Vector3( -0.1,  0, 0 ) , new THREE.Vector3( 0.1, 0, 0 ) );                
                geometry3.computeVertexNormals();

                
                var line1 = new THREE.Line(geometry, l_material);
                var line2 = new THREE.Line(geometry2, l_material);
                var line3 = new THREE.Line(geometry3, l_material);
                //var newpos = half_offset+( one_space)
                line1.position.x=0;
                
                this.coord.add( line1 )
                this.coord.add( line2 )
                this.coord.add( line3 )
                //this.metaspace.add(line);                
                return this.coord;          
                break;    


                                
            case 'locale':                
                this.coord = new THREE.Mesh();
                var l_material = new THREE.LineBasicMaterial( { color:'#FFFF99' , linewidth:1 } );   /* linewidth on windows will always be 1 */

                var g_material = new THREE.LineBasicMaterial( { color:'#FF0033' , linewidth:1 } );
                var total_lines=19;//31;
                var one_space=11;
                var line_length =((total_lines*one_space)-one_space)/2;
                var half_offset= -Math.floor(total_lines/2)*one_space;
                var grid_y = 0; // or -60 for below . 
                
                var geometry = new THREE.BufferGeometry();
                geometry.setFromPoints( new THREE.Vector3( 0, 0,-5 ), new THREE.Vector3( 0, 0, 5 ) );
                geometry.computeVertexNormals();
                
                var geometry2 = new THREE.BufferGeometry();
                geometry2.setFromPoints( new THREE.Vector3( 0, -8, 0 ) , new THREE.Vector3( 0, 8,0 ) );
                geometry2.computeVertexNormals();
                
                var geometry3 = new THREE.BufferGeometry();
                geometry3.setFromPoints( new THREE.Vector3( -5,  0, 0 ) ,new THREE.Vector3( 5, 0, 0 ) );                
                geometry3.computeVertexNormals();

                var line1 = new THREE.Line(geometry, l_material);
                var line2 = new THREE.Line(geometry2, g_material);
                var line3 = new THREE.Line(geometry3, l_material);
                //var newpos = half_offset+( one_space)
                //line1.position.x=0;
                var geometry = new THREE.RingGeometry( 2, 2.03, 32 ); 
                var material = new THREE.MeshBasicMaterial( { color: 0x00FF00, side: THREE.DoubleSide } );
                var ring = new THREE.Mesh( geometry, material );   
                ring.rotateX(Math.PI / 180 * 90);
                this.coord.add( ring );                     
                
                var geometry = new THREE.RingGeometry( 2, 2.03, 32 ); 
                var material = new THREE.MeshBasicMaterial( { color: 0x00FF00, side: THREE.DoubleSide } );
                var ring2 = new THREE.Mesh( geometry, material );   
                ring2.position.y=2;
                ring2.rotateX(Math.PI / 180 * 90);
                this.coord.add( ring2 );  

                var geometry = new THREE.RingGeometry( 2, 2.03, 32 ); 
                var material = new THREE.MeshBasicMaterial( { color: 0x00FF00, side: THREE.DoubleSide } );
                var ring3 = new THREE.Mesh( geometry, material );   
                ring3.position.y=4;
                ring3.rotateX(Math.PI / 180 * 90);
                this.coord.add( ring3 );                  

                //this.coord.add( line1 )
                this.coord.add( line2 )
                //this.coord.add( line3 )
                //this.metaspace.add(line);                
                return this.coord;          
                break;                    
            case 'repo':
                var geometry = new THREE.BoxGeometry( 4, 4, 4 );
                //var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                //var material = new THREE.MeshPhongMaterial( { color: 0xFF00FF, shininess: 50 } );
                var material = new THREE.MeshLambertMaterial( { color: 0x00FFFF, shininess: 50 } );
                //var material = new THREE.MeshPhongMaterial( { color: 0x00FF00, emissive: 0x3a3a3a });
                var cube = new THREE.Mesh( geometry, material );
                return cube;                
                break;            
            case 'bankcube':
                var dice = new THREE.Mesh(
                    new THREE.BoxGeometry( 10, 10, 10),
                    //new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('img/bankwellsfargo.png') }) 
                    new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('img/bankwellsfargo.png') }) 
                  );
                dice.material.side = THREE.DoubleSide;
                return dice;
                break;
            default:
                break;
        }
    }

///// ENERGY OS //// JOULE KERNEL ///

    ////// CANVAS TEXT //// 
    var canvasx = document.createElement('canvas');
    this.createTextCanvasX = function( text, color, font, size ) {
        size = size || 36;
        var ctx = canvasx.getContext('2d');
        ctx.clearRect(0, 0, canvasx.width, canvasx.height);
        var fontStr = (size + 'px ') + (font || 'Arial');
        ctx.font = fontStr;
        var w = ctx.measureText(text).width;
        var h = Math.ceil(size);
        canvasx.width = w;
        canvasx.height = h;
        ctx.font = fontStr;
        ctx.fillStyle = color || 'white';
        ctx.fillText(text, 0, Math.ceil(size * 0.8));
        return canvasx;
    };

    ////// SUPER TEXT //// 
    this.getSuperText=function( message_in , color_in ){
        var xMid, text;
        var color = color_in || 0x760aff;
        var matDark = new THREE.LineBasicMaterial( {color: color, side: THREE.DoubleSide} );
        var matLite = new THREE.MeshBasicMaterial( {color: color, transparent: true, opacity: 0.8, side:THREE.DoubleSide });
        var shapes = window.lefont.generateShapes( message_in , 100 );
        var geometry = new THREE.ShapeGeometry( shapes );
        geometry.computeBoundingBox();
        //xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        //geometry.translate( xMid, 0, 0 );
        // make shape ( N.B. edge view not visible )
        text = new THREE.Mesh( geometry, matLite );
        //text.position.z = - 150;
        return text;
    }    
    ////// SUPER TEXT //// 
    this.getSuperText2=function( message_in , color_in ){
        var xMid, text;
        var color = color_in || 0x760aff;
        var matDark = new THREE.LineBasicMaterial( {color: color, side: THREE.DoubleSide} );
        var matLite = new THREE.MeshBasicMaterial( {color: color, transparent: true, opacity: 0.8, side:THREE.DoubleSide });
        var shapes = window.lefont.generateShapes( message_in , 100 );
        //var geometry = new THREE.ShapeBufferGeometry( shapes );
        var geometry = new THREE.ShapeGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        // make shape ( N.B. edge view not visible )
        text = new THREE.Mesh( geometry, matLite );
        //text.position.z = - 150;
        return text;
    }    

    
    
    
    //// SUPER TEXT //
    this.xfont = false;
    window.cfont = false;
    var vfont = false;
    this.nasa_promise=false;
    this.getSuperTextAsync=function( message_in , color_in ){
        let promise = new Promise(function(resolve, reject) {
            
            var loader = new FontLoader();
            var fnt ='./fonts/helvetiker_regular.typeface.json'
            loader.load( fnt, function ( font ) {
                var color = color_in;//color_in || 0x760aff;
                var matDark = new THREE.LineBasicMaterial( {color: color, side: THREE.DoubleSide} );
                var matLite = new THREE.MeshBasicMaterial( {color: color, transparent: true, opacity: 0.8, side:THREE.DoubleSide });
                var shapes = font.generateShapes( message_in , 100 );
                var geometry = new THREE.ShapeGeometry( shapes );
                geometry.computeBoundingBox();
                var text = new THREE.Mesh( geometry, matLite );    
                resolve( text );
            });
        });
        return promise;
    }.bind(this)
}

var factory3d = new Factory3d()

export { Factory3d , factory3d }


/*  // DEEP CLONE Material for overide during set material after clone 
myScene.traverse(function(object) {
    if ( object.isMesh ) {
        object.material = object.material.clone();
    }
}); */




    //this.drawCoordinates(); // moved to onDataUpdate with children count 

        // ORIGINAL LOCALIZED GRID DRAW MOVED TO FACTORY: 
        // var axis_color = "#CCCCCC"
        // var colors = ["#FFFFFF","#FF5555","#5555FF","#7777FF","#7777FF"]
        // this.color = colors[Math.round( Math.random()*3) ];

        // var l_material = new THREE.LineBasicMaterial( { color:XCOLORS.floor_line , linewidth:1 } );/* linewidth on windows will always be 1 */
        // var total_lines=19;//31;
        // var one_space=10;
        // var line_length =((total_lines*one_space)-one_space)/2;
        // var half_offset= -Math.floor(total_lines/2)*one_space;
        // var grid_y = 0; // or -60 for below . 

        // for( var i=0; i<total_lines; i++){
        //     var geometry = new THREE.Geometry();
        //     geometry.vertices.push( new THREE.Vector3( 0, grid_y, line_length ) ); //x, y, z
        //     geometry.vertices.push( new THREE.Vector3( 0, grid_y,-line_length ) );

        //     var line = new THREE.Line(geometry, l_material);
        //     var newpos = half_offset+(i*one_space)
        //     line.position.x=newpos;
        //     this.metaspace.add(line);

        //     var line = new THREE.Line(geometry, l_material);
        //     var newpos = half_offset+(i*one_space)
        //     line.position.z=newpos;
        //     line.rotation.y=Math.PI/2;
        //     this.metaspace.add(line);
        // }

// MOVED TO FACTORY: 
            // globe.graticule().then( function( obn ){
            //     this.metaspace.add( obn );
            // }.bind(this), function( err ){ console.log( 'globe err:', err) ; });            
            // globe.land( this.metaspace ).then(function (obn) {
            //     this.metaspace.add(obn);
            //     var geometry = new THREE.SphereGeometry( 20 -0.1, 36, 18 );
            //     var material = new THREE.MeshBasicMaterial( {color: 0x000055, wireframe: false} );
            //     var sphere = new THREE.Mesh( geometry, material );
            //     this.metaspace.add( sphere );  
            // }.bind( this ), function (err){ console.log( 'globe err:', err );  });
            // globe.cities(this.metaspace).then(function (obn) {
            //     this.metaspace.add(obn);
            // }.bind( this ), function (err){ console.log( 'globe err:', err );  });


    // SELECT PANELS PER XCLASS AVATAR TYPE 
    // token needs:  buy sell swap xfer display 
    // address: SEND , Receive Display , Route Receive 
    // HOW TO DISPLAY RELATED FUNCTION BUBBLES PER AVATAR TYPE / OBJECT XCLASS TYPE 
    // EACH XCLASS SHOWS OWN MENUS 
    // this.capability_matrix = {
    //     alias:
    //     {
    //         init:(o)=>{    return []  }
                
    //     }
    // }    