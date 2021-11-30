# ModelView-movement-for-each-object

I use the model-viewer to make 3d objects visible. 
To move the object in the container i use the panning code from the developer and modify it. Now i can automatic move every object, which contains the class "3d_gpx_model"

Code:
```
<model-viewer class="reveal 3d_gpx_model" id="FL-Light-3D" loading="eager" camera-controls min-field-of-view="5deg" auto-rotate poster="images/gpxtracks/FL-light.JPG" style="width:100%; height: 350px; background-color:black;" src="images/gpxtracks/FL-light.glb" alt="Frühlingslauf Light"></model-viewer>

<script >
jQuery(document).ready(function(){
jQuery(".3d_gpx_model").mouseenter(function(){
var id = "#" + jQuery(this).attr("id");
modelview_verschieben(id);
});
});
</script>
```
include:
the move.js script
