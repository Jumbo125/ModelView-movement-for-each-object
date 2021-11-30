
function modelview_verschieben(id){
var modelViewer = jQuery(id)[0];
var tapDistance = 2;
var panning = false;
var panX, panY;
var startX, startY;
var lastX, lastY;
var metersPerPixel;

var startPan = function startPan() {
  var orbit = modelViewer.getCameraOrbit();
  var theta = orbit.theta,
      phi = orbit.phi,
      radius = orbit.radius;
  var psi = theta - modelViewer.turntableRotation;
  metersPerPixel = 0.75 * radius / modelViewer.getBoundingClientRect().height;
  panX = [-Math.cos(psi), 0, Math.sin(psi)];
  panY = [-Math.cos(phi) * Math.sin(psi), Math.sin(phi), -Math.cos(phi) * Math.cos(psi)];
  modelViewer.interactionPrompt = 'none';
};

var movePan = function movePan(thisX, thisY) {
  var dx = (thisX - lastX) * metersPerPixel;
  var dy = (thisY - lastY) * metersPerPixel;
  lastX = thisX;
  lastY = thisY;
  var target = modelViewer.getCameraTarget();
  target.x += dx * panX[0] + dy * panY[0];
  target.y += dx * panX[1] + dy * panY[1];
  target.z += dx * panX[2] + dy * panY[2];
  modelViewer.cameraTarget = "".concat(target.x, "m ").concat(target.y, "m ").concat(target.z, "m"); // This pauses turntable rotation

  modelViewer.dispatchEvent(new CustomEvent('camera-change', {
    detail: {
      source: 'user-interaction'
    }
  }));
};

var recenter = function recenter(pointer) {
  panning = false;
  if (Math.abs(pointer.clientX - startX) > tapDistance || Math.abs(pointer.clientY - startY) > tapDistance) return;
  var hit = modelViewer.positionAndNormalFromPoint(pointer.clientX, pointer.clientY);
  modelViewer.cameraTarget = hit == null ? 'auto auto auto' : hit.position.toString();
};

modelViewer.addEventListener('mousedown', function (event) {
  startX = event.clientX;
  startY = event.clientY;
  panning = event.button === 2 || event.ctrlKey || event.metaKey || event.shiftKey;
  if (!panning) return;
  lastX = startX;
  lastY = startY;
  startPan();
  event.stopPropagation();
}, true);
modelViewer.addEventListener('touchstart', function (event) {
  var targetTouches = event.targetTouches,
      touches = event.touches;
  startX = targetTouches[0].clientX;
  startY = targetTouches[0].clientY;
  panning = targetTouches.length === 2 && targetTouches.length === touches.length;
  if (!panning) return;
  lastX = 0.5 * (targetTouches[0].clientX + targetTouches[1].clientX);
  lastY = 0.5 * (targetTouches[0].clientY + targetTouches[1].clientY);
  startPan();
}, true);
self.addEventListener('mousemove', function (event) {
  if (!panning) return;
  movePan(event.clientX, event.clientY);
  event.stopPropagation();
}, true);
modelViewer.addEventListener('touchmove', function (event) {
  if (!panning || event.targetTouches.length !== 2) return;
  var targetTouches = event.targetTouches;
  var thisX = 0.5 * (targetTouches[0].clientX + targetTouches[1].clientX);
  var thisY = 0.5 * (targetTouches[0].clientY + targetTouches[1].clientY);
  movePan(thisX, thisY);
}, true);
self.addEventListener('mouseup', function (event) {
  recenter(event);
}, true);
modelViewer.addEventListener('touchend', function (event) {
  if (event.targetTouches.length === 0) {
    recenter(event.changedTouches[0]);

    if (event.cancelable) {
      event.preventDefault();
    }
  }
}, true);
}
