//
var creative        = {};
var dynamicBuilder  = {};
dynamicBuilder.data = [];
var app             = app || {};
var frameArray      = [];
var framePlaybackDelay = 0;
var currentFrameCount = 0; 

// Runs when Enabler is ready.
function preInit() {
  if (Enabler.isInitialized()) {
    politeInit();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, politeInit);
  }
}


// Runs when Polite load fires
function politeInit() {
  if (Enabler.isPageLoaded()) {
    init();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, init);
  }
};



function setupDom() {
  creative.dom                = {};
  creative.dom.mainContainer  = document.querySelector('.dynamicAdvertContainer');
  creative.dom.frame0         = document.querySelector('.frame0');
  creative.dom.frame1         = document.querySelector('.frame1');
  creative.dom.frame2         = document.querySelector('.frame2');
  creative.dom.frame3         = document.querySelector('.frame3');
  creative.dom.ctaOneExit     = dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].exiturl_ctaOne.Url
  creative.dom.ctaTwoExit     = dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].exiturl_ctaTwo.Url
  creative.dom.ctaBGExit      = dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].exiturl_ctaBackground.Url
  app.creativeDimensions      = dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].creative_dimensions[0].Width + "x" + dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].creative_dimensions[0].Height;
}


function init() {
  setupDom();
  frameArray = app.getFrames();
  constructTemplateURLs();

    if(framePlaybackDelay == 0)
    {
      framePlaybackDelay++;
      buildData(currentFrameCount);
    }
    else
    {
      console.log('delayed build data!');
      setTimeout(function(){buildDataDelay(i)}, 100);
    }
}

function buildDataDelay(jsonFrame)
{

  buildData(jsonFrame);
}

app.getFrames = function()
{
  console.log('getting frames...');
  var arrayOfFrames = [];

  var dynamicFrames = {
    frame1     : dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].frame1_json,
    frame2     : dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].frame2_json,
    frame3     : dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].frame3_json,
    frame4     : dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].frame4_json
  }


  for(var i = 1; i <= 4; i++)
  {
    console.log('loop thorugh frames: ' + i);
    if(dynamicFrames['frame' + i] !== "")
    {
      console.log('found frame: ' + (dynamicFrames['frame' + i]));
      arrayOfFrames.push(dynamicFrames['frame' + i]);
    }
  }
  console.log(arrayOfFrames);
  return arrayOfFrames;
}

function constructTemplateURLs()
{

  var eventConstruct = "";
  var template_Name = getTemplate();

  if (dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].DMA_Targeting.length > 1){
    var dma = dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].DMA_Targeting; 
    var convert = dynamicContent.Nissan_DIME_Feed[0].DMA_Reporting.toString();
    console.log("grab dma targeting ");

    if(dma.indexOf(convert) !== -1){
      console.log("converted ");
      app.jsonURL = "https://s0.2mdn.net/creatives/assets/2627458/" + app.creativeDimensions + "_" + dynamicContent.Nissan_DIME_Feed[0].Offer_Type + "_" + "dma" + ".json";
      console.log(app.jsonURL);
      console.log("check to see if dma targeting matches reporting");
    }

    else if(template_Name) {
      app.jsonURL = "https://s0.2mdn.net/creatives/assets/2627458/" + app.creativeDimensions + "_" + dynamicContent.Nissan_DIME_Feed[0].Offer_Type + template_Name + ".json";
    }
  
    else {
      app.jsonURL = "https://s0.2mdn.net/creatives/assets/2627458/" + app.creativeDimensions + "_" + dynamicContent.Nissan_DIME_Feed[0].Offer_Type + ".json";
      console.log(app.jsonURL);
      console.log("show normal if flops");
    }
  }
  else if(template_Name)
  {
    app.jsonURL = "https://s0.2mdn.net/creatives/assets/2627458/" + app.creativeDimensions + "_" + dynamicContent.Nissan_DIME_Feed[0].Offer_Type + template_Name + ".json";
    console.log(app.jsonURL);
    console.log("show event template");    
  }
  else {
    app.jsonURL = "https://s0.2mdn.net/creatives/assets/2627458/" + app.creativeDimensions + "_" + dynamicContent.Nissan_DIME_Feed[0].Offer_Type + ".json";
    console.log(app.jsonURL);
    console.log("show non-event creative");
  }
  frameArray.push(app.jsonURL);

  if(dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].frame1_json.indexOf('offerLoop') !== -1 || dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].frame2_json.indexOf('offerLoop') !== -1 || dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].frame3_json.indexOf('offerLoop') !== -1 || dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].frame4_json.indexOf('offerLoop') !== -1)
  {
     console.log("offerLoop before " + frameArray);
     //var tempFrameName = frameArray[3].replace('.json', "_titanpreframe.json");
     if(frameArray.length == 4)
     {
       frameArray[1] = frameArray[3].replace('.json', "_titanpreframe.json");
      console.log("offerLoop after " + frameArray);
    }
  }
}

function getTemplate(){

  var model_year = dynamicContent.Nissan_DIME_Feed[0].Year;
  var templateYear = "template_" + model_year;
  var template_content = dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0][templateYear];
  var defaultTemplate = dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0]['template'];
  if(template_content)
  { 
      console.log("template year " + template_content);
      return template_content
  }
  else
  {
      console.log("default year " + defaultTemplate);
      return defaultTemplate
  }
}

function getEventBackground()
{ 
  var eventBackgroundImage = document.querySelector('.ASSETHOOK-backgroundImage');
  var model_year = dynamicContent.Nissan_DIME_Feed[0].Year;
  var backgroundYear = "background_" + model_year
  var content_background = dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0][backgroundYear];
  if(content_background)
  {
      console.log("content_background url: " + content_background);
      eventBackgroundImage.style.backgroundImage = "url(" + content_background + ")";
  }
  else
  {
      console.log('non-event background used');
      eventBackgroundImage.style.backgroundImage = "url(" + dynamicContent.Nissan_US_DCO_EN_Creative_MobileTablet[0].background_2018 + ")";
  }
}


function buildData(i) {
  console.log("build data frameArray: " + frameArray[i]);
  if(i == 2)
  {
    console.log('clear initial offers frame...');
    setTimeout(function(){document.querySelector('.frame1').innerHTML = "";
      console.log('wipe frame');
  }, 500);
  }
  else if(i == 1)
  {
    console.log('clear initial PREFRAME frame...');
    setTimeout(function(){document.querySelector('.frame0').innerHTML = "";
      console.log('wipe preframe');
    }, 500);
  }
  var xobj = new XMLHttpRequest();
  //var url = 'json/' + window.location.href.slice(window.location.href.indexOf('?') + 1) + '.json';
  var url = frameArray[i];
  //var url = app.jsonURL;
  xobj.overrideMimeType('application/json');
  xobj.open('GET', url, true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == '200') {
      var data = xobj.responseText;
      dynamicBuilder.data = JSON.parse(data);
      var domTarget = document.querySelector('.frame' + i);
      console.log('nestedFrame: ' + domTarget);
      buildDOM('.frame' + i, dynamicBuilder.data);
      // Polite loading
      if (Enabler.isVisible()) {
        //document.querySelector('.frame' + i).style.opacity = "1";
        show(i);
      } else {
        Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, function(){
          show(i);
        });
      }
    }
  };
  xobj.send(null);
}
/**
 *  Shows the ad.
 */
function show(i) {
  creative.dom.mainContainer.style.display = 'block';
  console.log('fade in frame: ' + i);
  document.querySelector('.frame' + i).style.visibility = "visible";
  setTimeout(function(){document.querySelector('.frame' + i).style.opacity = "1"; }, 10);
  startAnimation(0);
  getEventBackground();
  addListner();
}


function addListner(){
  document.querySelector('.EXITHOOK-exiturl_ctaOne').addEventListener("click",handleCTAclickOut)
  document.querySelector('.EXITHOOK-exiturl_ctaTwo').addEventListener("click",handleCTAclickOut2)
  document.querySelector('.EXITHOOK-exiturl_ctaBackground').addEventListener("click",handleBGclickOut)
}

function exitClickHandlerPlaceholder(exitURL) {
  var replaceUrl = "";
  OfferFrame_click();
  var regex = /[.,-/]*PlaceholderMY20|placeholderURL[-]|placeholderModelYear/gi
  var regexNot20 = /PlaceholderMY20|placeholderURL|placeholderModelYear/gi

  if(exitURL.includes('PlaceholderMY20') || exitURL.includes('placeholderURL') || exitURL.includes('placeholderModelYear')){
    console.log('found bespoke Url');
    if(dynamicContent.Nissan_DIME_Feed[0].Year !== "2020"){
      replaceUrl = exitURL.replace(regexNot20, dynamicContent.Nissan_DIME_Feed[0].Year);
        return replaceUrl
    }
    else{
      console.log("2020 link found");
      replaceUrl = exitURL.replace(regex, '');
        return replaceUrl
    }
  }
  else
  {
    replaceUrl = exitURL;
      return replaceUrl
  }
}

function handleCTAclickOut(){
  var ctaOneUrl = exitClickHandlerPlaceholder(creative.dom.ctaOneExit)
  exitClickHandler(ctaOneUrl)
}

function handleCTAclickOut2(){
  var ctaTwoUrl = exitClickHandlerPlaceholder(creative.dom.ctaTwoExit)
  exitClickHandler(ctaTwoUrl)
}

function handleBGclickOut(){
  var Bgurl = exitClickHandlerPlaceholder(creative.dom.ctaBGExit)
  exitClickHandler(Bgurl)
}

function exitClickHandler(url) {
  Enabler.exitOverride('click!', url);
}

function Hurricane_click()
{
  console.log('Hurricane_click');
  Enabler.counter('Hurricane_click', true);
}

function OfferFrame_click()
{
  console.log('OfferFrame_click');
  Enabler.counter('OfferFrame_click', true);
}

function Titan_click()
{
  console.log('Titan_click');
  Enabler.counter('Titan_click', true);
}

/**
 *  Main onload handler
 */
window.addEventListener('load', preInit);
