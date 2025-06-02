/**
 * This script fixes issues with images that might be using incorrect paths
 */

document.addEventListener("DOMContentLoaded", function() {
  // Fix for VOB logo if the path is wrong
  const vobImg = document.getElementById("vob");
  
  if (vobImg) {
    // Check if image failed to load
    vobImg.onerror = function() {
      // Try alternative paths
      const paths = [
        "/images/VOB-logo-transparent.png",
        "./images/VOB-logo-transparent.png", 
        "../images/VOB-logo-transparent.png",
        "/public/images/VOB-logo-transparent.png"
      ];
      
      // Try each path until one works
      function tryNextPath(index) {
        if (index < paths.length) {
          vobImg.src = paths[index];
          vobImg.onerror = function() {
            tryNextPath(index + 1);
          };
        }
      }
      
      tryNextPath(0);
    };
    
    // Force a reload to trigger error handler if needed
    const currentSrc = vobImg.src;
    vobImg.src = "";
    vobImg.src = currentSrc;
  }
});
