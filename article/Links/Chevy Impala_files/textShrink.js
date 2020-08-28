

function textShrink(element) {
    while(isOverflown(element)) {
        var currentFontSize = getFontSize(element);
        var newFont = parseInt(currentFontSize);
        newFont -= 0.1;
        element.style.fontSize = newFont + "px";
    }
}

function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function getFontSize(oElm) {
  var strValue = "";
  
  if(window.getComputedStyle) {
    strValue = getComputedStyle(oElm).getPropertyValue('font-size');
  }
  //IE
  else if (oElm.currentStyle)
  {
    try {
        strValue = oElm.currentStyle['font-size'];
    } catch (e) {}
  }
    return strValue;
}
 