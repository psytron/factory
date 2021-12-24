# Factory2D and Factory3D
Wrapper around Range https://developer.mozilla.org/en-US/docs/Web/API/Range and 

* No Server 
* No Compiling 
* No Dependencies

```javascript

import factory2d from './factory';


factory.loadSync( 
  ['html','html','html']
  )
  

let v_node = factory.renderNodeSync(  'template_id' , data_object ); 

// Vanilla Javascript 
v_node.querySelector("#regular_id")

// Glue Style , spider and id match insert 
v_node.push(  data_object ) 


```


