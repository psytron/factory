                
// qcom
import jsdom from "jsdom";
const { JSDOM } = jsdom;

function Factory2d() {

    var dom = new JSDOM(`<!DOCTYPE html><p></p>`);
    var window = dom.window;
    var document = window.document;

    var tmp = document.createElement('div')
    document.body.appendChild( tmp )
    tmp.style.display = 'none';
    this.con = tmp.attachShadow({mode:'closed'});
    var con = this.con;
    this.cache = {}
    this.vcache= {}
    

    this.load=function( id_in ) {   
        let cache = this.cache;
        var url = '/x_modules/apps/'+id_in+'/'+id_in+'.html';
        return new Promise( ( resolve, reject ) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (e) => { 
                if (xhr.readyState == 4 && xhr.status == 200) {
                    cache[ id_in ]=xhr.responseText;
                    resolve( xhr.responseText );
                }
            }
            xhr.open("GET", url , true);
            xhr.setRequestHeader('Content-type', 'text/html');
            xhr.send();     
        });
    };    



    this.loadAll = function( asset_list ){
        
        // PREP PARAM 
        asset_list = ( typeof(asset_list)=='string')? [ asset_list ] : asset_list;
        // here should check if already loaded before adding to cache? // overwrite for now //

        // FILL CACHE: 
        let cache = this.cache;
        return new Promise( ( resolve, reject ) => {
            var list = [];
            var urls = asset_list;
            var results = [];
            urls.forEach( function(url, i) { 
                list.push( 
                    fetch( url ).then( (response) => { 
                        var tx = response.text() 
                        //cache[ url ] = tx; // store raw for factory fallback of mangled 
                        return tx;
                    }).then( (data) =>{ 

                        // PRE PARSE SEARCH FOR BUNDLED TEMPLATES
                        // STORE IN LOCAL CACHE
                        var parser = new DOMParser();
                        var loaded_dom = parser.parseFromString( data , 'text/html');
                        var loaded_templates = loaded_dom.getElementsByClassName("elx");
                        if( loaded_templates.length > 0 ){
                            for (var i = 0; i < loaded_templates.length; i++) {
                                var tmp = loaded_templates.item(i);
                                cache[ tmp.id ]=tmp.outerHTML;
                            }                           
                        }else{
                            var cache_key = url.replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.');
                            cache[ cache_key ]=data;
                        }
                        
                        return data;
                    })
                );
            });
            Promise
                .all( list ) 
                .then( function( reList ) {
                    resolve( reList )
                });             
        });
    }

    this.storeStaticTemplate=function( domTempIn ){
        
        //var parser = new DOMParser();
        //var loaded_dom = parser.parseFromString( domTempIn , 'text/html');
        var loaded_dom = domTempIn ;
        
        this.cache[ loaded_dom.id ]=loaded_dom.outerHTML;
        //
        //var loaded_templates = loaded_dom.getElementsByClassName("elx");
        // if( loaded_templates.length > 0 ){
        //     for (var i = 0; i < loaded_templates.length; i++) {
        //         var tmp = loaded_templates.item(i);
        //         cache[ tmp.id ]=tmp.outerHTML;
        //     }             

    }

    this.loadStatic=function( id_in ){


    

        
    }
    

    this.cloneItemAndInject=function( ref_in , dat_in ){






        

        console.log('xex')
    }
    
    
    this.getTemplate=function(id){
        let cache = this.cache;
        return new Promise((resolve, reject) => {
            if (cache[id]) {
                resolve(cache[id]);
            } else {
                this.loadTemplate(id)
                    .then(template => {
                        cache[id] = template;
                        resolve(template);
                    })
                    .fail(reject);
            }
        });
    },

    this.render=function( tmp_id , data_in ){
        //var templatestring='`'+this.con.querySelector('#'+tmp_id).innerHTML+'`'
        var templatestring='`'+this.con.querySelector('#'+tmp_id).outerHTML+'`'
        var wholefunc = '( obj ) =>{ return '+templatestring+' }  ';
        var outcome = eval( wholefunc )( data_in )
        return outcome;
    }
    
    this.renderSync=function( tmp_id , data_in ){        
        var templatestring= '`'+this.cache[ tmp_id]+'`';
        var wholefunc = '( obj ) =>{ return '+templatestring+' }  ';
        var outcome = eval( wholefunc )( data_in )
        return outcome;
    }
    this.renderNode=function( tmp_id , data_in ){

    }
    this.renderNodeSyncCacheVdom=function( tmp_id , data_in ){
        /// CHECK MEMORY FOOTPRINT OF VDOM CACHE vs. TEXT-STRING CACHE and VDOM EVERYTIME
        if( tmp_id in this.vcache ){
            return this.vcache[tmp_id].cloneNode(true);
        }else{
            var rendered_html = this.renderSync( tmp_id , data_in ) 
            var domfrag = document.createRange().createContextualFragment( rendered_html );
            //var domfrag = document.createContextualFragment( rendered_html );
            this.vcache[ tmp_id ]= domfrag.firstElementChild; // Cache app UI
            return this.vcache[ tmp_id ].cloneNode(true);
        }
    }

    this.renderSync=function( tmp_id , data_in ){

        var templatestring= ( tmp_id in this.cache ) ? '`'+this.cache[ tmp_id]+'`' :  '`<div style="color:red;">Template: '+tmp_id+' Not Loaded</div>`';
        var f = '( obj ) =>{ return '+templatestring+' }  ';
        var outcome = eval( f )( data_in )
        return outcome;
    }        
    this.renderNodeSync=function( tmp_id , data_in ){
        var rendered_html = this.renderSync( tmp_id , data_in )  
        var domfrag = document.createRange().createContextualFragment( rendered_html );
        this.vcache[ tmp_id ]= domfrag.firstElementChild; // Cache app UI
        console.log(tmp_id ,  ': Maybe Not cached-loaded in Factory')
        return this.vcache[ tmp_id ].cloneNode(true);
    }    


    this.renderAsync=function( tmp_id , data_in ){
        return new Promise((resolve, reject) => {
            if( this.cache[tmp_id] ) {
                resolve(this.cache[tmp_id]);
            } else {
                this.load2(tmp_id)
                    .then(template => {
                        this.cache[tmp_id] = template;
                        //var templatestring='`'+this.con.querySelector('#'+tmp_id).outerHTML+'`'
                        var templatestring='`'+template+'`';
                        var wholefunc = '( obj ) =>{ return '+templatestring+' }  ';
                        var outcome = eval( wholefunc )( data_in )
                        resolve(  outcome );
                    })
            }
        });        
    }
    this.asyncRender=function( tmp_url , data_obj ){
        // load template and call promise when done 
    }
    this.renderNodeWithId=function( url , data ){
        //return vnode , id_string 
    }

    
}

var factory2d = new Factory2d()
export { Factory2d , factory2d }

// ALT METHOD 
//dom_node = new DOMParser().parseFromString( xhr.responseText , "text/xml");

//this.vcache[ tmp_id ]=new DocumentFragment();
//this.vcache[ tmp_id ]= document.createDocumentFragment();
//this.vcache[ tmp_id ].innerHTML = rendered_html;

        /// CHECK MEMORY FOOTPRINT OF VDOM CACHE vs. TEXT-STRING CACHE and VDOM EVERYTIME
        /// RENDER TO CACHE 
        ///if( ! tmp_id in this.vcache ){
        ///    this.vcache[tmp_id]=this.renderSync( tmp_id , data_in ) 
        ///}
// ACTUALLY HAVE TO CACHE STRING IF WANT TO RENDER ${ obj.x } . yay so no competition        
/*

    this.load3 = function( id_in ){
        var url = '/x_modules/apps/'+id_in+'/'+id_in+'.html';
        fetch( url )
        .then(response => response.json())
        .then(data => console.log(data));
    }

    this.load4 = function( id_in ){
        fetch('./x_modules/yfer/yfer.html').then(function (response) {
            return response.text(); // The API call was successful!
        }).then(function (html) {
            console.log(html);
            container_in.innerHTML=html;
        }).catch(function (err) {
            console.warn('Something went wrong.', err);
        });
    }

    this.loadPX=function( id_in ) {   
        let cache = this.cache;
        var url = '/x_modules/apps/'+id_in+'/'+id_in+'.html';
        return new Promise( ( resolve, reject ) => {
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (e) => { 
                if (xhr.readyState == 4 && xhr.status == 200) {
                    cache[ id_in ]=xhr.responseText;
                    resolve( xhr.responseText );
                }
            }
            xhr.open("GET", url , true);
            xhr.setRequestHeader('Content-type', 'text/html');
            xhr.send();     

            
        });
    };    

    this.loadTemplate=function(id) {
        return this.load(id)
        //return $.get('/x_modules/apps/' +id+'/'+ id + '.html');
    },



    */