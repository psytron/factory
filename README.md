# Factory2D and Factory3D
Wrapper around Range https://developer.mozilla.org/en-US/docs/Web/API/Range and 

* No Server 
* No Compiling 
* No Dependencies

```javascript

import factory2d from './factory/factory.js';

// LOAD REGULAR WORKING HTML
await factory2d.loadAll( 
    ['multiple.html',
     'single.html'])

// RENDER TEMPLATE WITH DATA
let v_node = factory.renderNodeSync(  'template_id' , data_object ); 

// Vanilla Javascript 
v_node.querySelector("#regular_id")

// Glue Style , spider and id match insert 
v_node.push(  data_object ) 


```


