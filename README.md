# Factory
Factory is a simple Promise based async wrapper for underutilized standard browser functionality like Range, DOMParser, and CloneNode. This project can be used independently or as part of ecosystem aimed at promoting run-time editing and flexible modular development not constrained by overbuilt kitchen sink frameworks and also cater to Vanilla JS afficionados. <br>
https://developer.mozilla.org/en-US/docs/Web/API/Range
<br>
https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
<br>

* No Server 
* No Compiling 
* No Dependencies
* No Handlebars 


### Install
```shell
npm install https://github.com/psytron/factory
```

### Usage
### How it works: Point your library to regular working HTML chunks 
[ neste.html , box.html ,  wut.html ]


```javascript
// Cache Templates
import factory2d from './factory/factory.js';
await factory2d.loadAll( ['multiple.html','single.html'] );

// Render and Inject
let v_node = factory.renderNodeSync(  'template_id' , data_object ); 

// Vanilla Javascript or Auto
v_node.querySelector("#regular_id")
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