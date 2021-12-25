import * as THREE from '../../web_modules/three.js'
import { GLTFLoader } from '../../web_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { XCOLORS } from '../xcolors.js'

////// ELEMENT FACTORY ////
function Factory3d() {
    
    
    ////// FONTS ////
    window.lefont;
    this.loader = new THREE.FontLoader();
                       
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
            var loader = new THREE.FontLoader();
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
        
        return this.models[ url ] = new Promise( ( resolve, reject ) => {
            this.loaderx.load( url, function ( gltf ) {
                if( obj.img ){
                    loadTextureX( obj.img ).then( (tex)=>{
                        var mesh = gltf.scene;
                        mesh.traverse(function(node) {
                            try{
                                if( node.isMesh && node.material.name =='xlogo' ) node.material.map = tex;  
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

        var geo = new THREE.PlaneBufferGeometry( 4, 4, 1, 1 );
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
                resolve( texture );
            }, undefined, reject );
        });
    }.bind(this);    
   
    ////// GEOM CLONES //// 
    var exch_height=6;
    var sphereGeometryDot = new THREE.SphereGeometry(1.0,8,9);
    var sphereMeshDot = new THREE.MeshBasicMaterial({ color:XCOLORS.node_color, wireframe: true });
    var cylynderGeometryA = new THREE.CylinderGeometry( 5, 5, exch_height, 10 );
    var cylynderMeshA = new THREE.MeshBasicMaterial( {color:XCOLORS.dbase , wireframe: true});
    this.getClone=function( identifier_in ){
        //return this.avatars[ identifier_in ].clone(false);
        //return this.avatars[ identifier_in ];
        switch ( identifier_in ) {
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
                var sphere = new THREE.Mesh(
                    sphereGeometryDot ,
                    sphereMeshDot );
                this.dot.add( sphere );
                return this.dot;
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
        var geometry = new THREE.ShapeBufferGeometry( shapes );
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
        var geometry = new THREE.ShapeBufferGeometry( shapes );
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
            
            var loader = new THREE.FontLoader();
            //var x ='fonts/nasaliz.json'
            var fnt ='./fonts/helvetiker_regular.typeface.json'
            loader.load( fnt, function ( font ) {
                var color = color_in;//color_in || 0x760aff;
                var matDark = new THREE.LineBasicMaterial( {color: color, side: THREE.DoubleSide} );
                var matLite = new THREE.MeshBasicMaterial( {color: color, transparent: true, opacity: 0.8, side:THREE.DoubleSide });
                var shapes = font.generateShapes( message_in , 100 );
                var geometry = new THREE.ShapeBufferGeometry( shapes );
                geometry.computeBoundingBox();
                var text = new THREE.Mesh( geometry, matLite );
                //return text;                
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