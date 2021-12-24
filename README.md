# Factory2D and Factory3D
Wrapper around Range https://developer.mozilla.org/en-US/docs/Web/API/Range and 

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


