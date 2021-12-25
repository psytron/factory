# Factory2D and Factory3D
Wrapper around Range https://developer.mozilla.org/en-US/docs/Web/API/Range and 

* No Server 
* No Compiling 
* No Dependencies
* No Handlebars 


## Factory 2D Usage
#### Factory2D: How it works Point your library to regular working HTML chunks 
[ neste.html , box.html ,  wut.html ]


```javascript

import factory2d from './factory/factory.js';

// LOAD REGULAR WORKING HTML
await factory2d.loadAll( ['multiple.html','single.html'] );

// RENDER TEMPLATE WITH DATA
let v_node = factory.renderNodeSync(  'template_id' , data_object ); 

// Vanilla Javascript 
v_node.querySelector("#regular_id")

// Glue Style , spider and id match insert 
v_node.push(  data_object ) 


```


## Plain HTML 
Factory doesn't use compilers, delimeters, any special syntax. Everything is just plain HTML that works directly in any browser.
```html
<body>    
    <style>
        .feature_slide{
            color:#333333;
        }
    </style>
    <div id="features">
        <div id="slide3" class="feature_slide">
            <h3>Private</h3>
            <p>Enables control.</p>            
        </div>        
    </div>
</body>
```