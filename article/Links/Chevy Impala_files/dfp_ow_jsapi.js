dfp_params = JSON.parse( $( '#ats-dfp-params' ).text());


////
//// define vars
////
// google tag
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
// pubmatic opwnwrap "namespace"
var PWT = {};
var PWT_ATS = {};// hold functions that specialty must re-implement for workarounds
// workaround is to pass openwrap a value for divId that is of the format "{$adUnit}_{$div_id}" without having to also modify the actual div-id in html
PWT_ATS.addKeyValuePairsToGPTSlots = function(arrayOfAdUnits) {
    
    // copy some util functions by addKeyValuePairsToGPTSlots()
    var util = {
        isA:                function(object, testForType){
            return Object.prototype.toString.call(object) === "[object " + testForType + "]";
        },
        isArray:            function(object){
            return util.isA(object, 'Array');
        },
        isFunction:         function(object){
            return util.isA(object, 'Function');
        },
        isObject:           function(object){
            return typeof object === "object" && object !== null;
        },
        forEachOnArray:     function(theArray, callback){
            /* istanbul ignore else */
            if(!util.isArray(theArray)){
                return;
            }

            /* istanbul ignore else */
            if(!util.isFunction(callback)){
                return;
            }

            for(var index=0, arrayLength= theArray.length; index<arrayLength; index++){
                callback(index, theArray[index]);
            }
        },
        forEachOnObject:    function(theObject, callback){
            /* istanbul ignore else */
            if(!util.isObject(theObject)){
                return;
            }
            
            /* istanbul ignore else */
            if(!util.isFunction(callback)){
                return;
            }
            
            for(var key in theObject){
                /* istanbul ignore else */
                if(util.isOwnProperty(theObject, key)){
                    callback(key, theObject[key]);
                }
            }
        },
        error:              function(data){
            console.log( (new Date()).getTime()+ " : " + "[OpenWrap] : [Error]", data ); // eslint-disable-line no-console
        },
        isOwnProperty:      function(theObject, proertyName){
            /* istanbul ignore else */
            if(theObject.hasOwnProperty){
                return theObject.hasOwnProperty(proertyName);
            }
            return false;
        },
    };
    
    // BEGIN copied & slightly-modified PWT.addKeyValuePairsToGPTSlots()
    if (!util.isArray(arrayOfAdUnits)) {
        util.error("array is expected");
    }
    
    var arrayOfGPTSlots = [];
    if(util.isObject(window.googletag) && util.isFunction(window.googletag.pubads)){
        arrayOfGPTSlots = window.googletag.pubads().getSlots();
    }
    
    var mapOfDivIdToGoogleSlot = {};
    util.forEachOnArray(arrayOfGPTSlots, function(index, googleSlot) {
        if (util.isFunction(googleSlot.getSlotId)) {
            var slotID = googleSlot.getSlotId();
            if (slotID && util.isFunction(slotID.getDomId)) {
                mapOfDivIdToGoogleSlot[slotID.getDomId()] = googleSlot;
            } else {
                util.error("slotID.getDomId is not a function");
            }
        } else {
            util.error("googleSlot.getSlotId is not a function");
        }
    });
    
    util.forEachOnArray(arrayOfAdUnits, function(index, adUnit) {
        if (util.isOwnProperty(mapOfDivIdToGoogleSlot, adUnit.divId_real)) {
            var googleSlot = mapOfDivIdToGoogleSlot[ adUnit.divId_real ];
            if(util.isObject(adUnit) && util.isObject(adUnit.bidData) && util.isObject(adUnit.bidData.kvp)){
                util.forEachOnObject(adUnit.bidData.kvp, function(key, value) {
                    googleSlot.setTargeting(key, [value]);
                });
            }
        } else {
            util.error("GPT-Slot not found for divId: " + adUnit.divId_real);
        }
    });
}


var gpt_has_run = false;
// our ref to ads
var dfp_ads = {};
var hb_timeout = 3000;// time limit for header-bidding in ms

// check if loaded openwrap script is jsapi version
function is_openwrap_jsapi(){
    return typeof(PWT.removeKeyValuePairsFromGPTSlots)==='undefined' ? 0 : 1;
}
function get_adomik_random_ad_group()
{
    Adomik = window.Adomik || {};
    Adomik.randomAdGroup = function() {
        var rand = Math.random();
        switch (false) {
            case !(rand < 0.09): return "ad_ex" + (Math.floor(100 * rand));
            case !(rand < 0.10): return "ad_bc";
            default: return "ad_opt";
        }
    };
    
    return Adomik.randomAdGroup();
}
// returns slots in proper format for apstag
function get_apstag_slots(dfp_params)
{
    if( typeof(dfp_params) ==='undefined' || !dfp_params || typeof(dfp_params.slots) ==='undefined' ){
        return [];
    }
    
    let apstag_slots = [];
    dfp_params.slots.forEach(function(slot_params){
        
        // create base params
        let apstag_slot = {
            slotID :  slot_params.div_id,
            slotName: dfp_params.global.iu,
            sizes: []
        };
        
        // check/set responsive sizes
        if( slot_params.sizes_responsive.length ){
            slot_params.sizes_responsive.forEach(function(size){
                apstag_slot.sizes.push([ size['slotSize.Width'], size['slotSize.Height'] ]);
            });
        }else{
            // no responsive sizes, add width & height
            apstag_slot.sizes.push([ slot_params.width, slot_params.height ]);
        }
        
        apstag_slots.push(apstag_slot);
    });
    
    return apstag_slots;
}
// defines and returns dfp slots
function get_dfp_slots(dfp_params)
{
    let dfp_ads = {};
    
    // create dfp slots
    dfp_params.slots.forEach(function(slot_params){
        
        
        var dfp_ad_sizes = [ slot_params.width, slot_params.height ];
        
        // check/set responsive sizes
        if( slot_params.sizes_responsive.length ){
            
            // overwrite default value here to nest size in array since we now know this slot size is not static
            dfp_ad_sizes = [[ slot_params.width, slot_params.height ]];
            
            var mapping = googletag.sizeMapping();
            
            slot_params.sizes_responsive.forEach(function(size){
                // size mapping for dfp
                
                //console.log("     - Building responsive size: width => '"+ size['slotSize.Width'] +"', height => '"+ size['slotSize.Height'] +"' for VIEWPORT size: VP-width => '"+ size['viewportSize.Width'] +"', VP-height => '"+ size['viewportSize.Height'] +"'");//TODO: Delete me
                
                // add size to mapping
                mapping.addSize(
                    [ size['viewportSize.Width'], size['viewportSize.Height']   ],
                    [ size['slotSize.Width'],     size['slotSize.Height']       ]
                );
                
                // add size to sizes for ad IF its not the default size
                if( size['slotSize.Width'] != slot_params.width || size['slotSize.Height'] != slot_params.height ){
                    dfp_ad_sizes.unshift([ size['slotSize.Width'], size['slotSize.Height'] ]);
                }
            });
            mapping = mapping.build();
        }
        
        // define this slot
        dfp_ads[ slot_params.div_id ] = googletag.defineSlot( dfp_params.global.iu, dfp_ad_sizes, slot_params.div_id )
            .addService(googletag.pubads())
        ;
        //console.log("Defined slot => '"+ slot_params.div_id +"'");//TODO: Delete me
        //console.log("    " + JSON.stringify( dfp_ad_sizes) );//TODO: Delete me
        
        if( slot_params.sizes_responsive.length ){
            //console.log("    Updating slot => '"+ slot_params.div_id +"' with responsive sizes");//TODO: Delete me
            dfp_ads[ slot_params.div_id ].defineSizeMapping( mapping );
        }
        
        
        // set slot specific targeting
        if( slot_params.targeting ){
            //console.log("    Updating slot => '"+ slot_params.div_id +"' with Slot-Specific-Targeting");//TODO: Delete me
            for( var key in slot_params.targeting){
                if( slot_params.targeting.hasOwnProperty(key) ){
                    //console.log("     - Adding slot-specific-targeting: key => '"+ key +"', val => '"+ slot_params.targeting[ key ] +"'");//TODO: Delete me
                    dfp_ads[ slot_params.div_id ].setTargeting( key, slot_params.targeting[ key ] );
                }
            }
        }
    });
    // end foreach slot
    
    return dfp_ads;
}

function set_global_targeting(dfp_params)
{
    // set global targeting values
    for( var key in dfp_params.global ){
        if( dfp_params.global.hasOwnProperty(key) ){
            googletag.pubads().setTargeting( key, dfp_params.global[ key ] );
        }
    }
    
    // if Adomik randomizer is enabled, set the targeting for that
    if( dfp_params.adomik_randomizer_is_enabled ){
        googletag.pubads().setTargeting('ad_group', get_adomik_random_ad_group() );
    }
}

// load a9/openwrap/googletag
function do_load(dfp_params)
{
    // definie funcs to load things
    function do_load_a9(){
        !function(a9,a,p,s,t,A,g){if(a[a9])return;function q(c,r){a[a9]._Q.push([c,r])}a[a9]={init:function()
        {q("i",arguments)},fetchBids:function(){q("f",arguments)},setDisplayBids:function(){},targetingKeys:function()
        {return[]},_Q:[]};A=p.createElement(s);A.async=!0;A.src=t;g=p.getElementsByTagName(s)
        [0];g.parentNode.insertBefore(A,g)}("apstag",window,document,"script","//c.amazon-adsystem.com/aax2/apstag.js");
    }
    function do_load_gpt(called_by){
        
        if( typeof(called_by) === 'undefined' ){
            called_by = 'unknown';
        }
        
        // make sure this only runs once
        if( gpt_has_run ){
            return;
        }
        gpt_has_run = true;
        if( SPECIALTY_DEBUG_LEVEL ){
            console.log("in loadGpt() called_by=>'" + called_by + "'");
        }
        var gads = document.createElement('script');
        gads.src = 'https://www.googletagservices.com/tag/js/gpt.js';
        var node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(gads, node);
    }
    function do_load_openwrap(){
        
        
        // create timeout as failsafe
        let timeout_failsafe = setTimeout(function() { do_load_gpt('setTimeout failsafe');}, dfp_params.openwrap.script_timeout);
        
        // setup the PubMatic pwt.js on load callback
        PWT.jsLoaded = function() {
            clearTimeout(timeout_failsafe);
            do_load_gpt('PWT.jsLoaded callback');
        };
        
        // load PubMatic pwt.js
        (function() {
            var wtads = document.createElement('script');
            wtads.async = true;
            wtads.type = 'text/javascript';
            wtads.src = dfp_params.openwrap.script_url;
            var node = document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(wtads, node);
        })();
    }
    
    
    // now call those funcs
    do_load_a9();
    if( typeof(dfp_params.openwrap.script_url) !== 'undefined' ){
        //console.log("Loading openwrap from url => '"+ dfp_params.openwrap.script_url +"'");//TODO: Delete me
        do_load_openwrap();
    }
}

// initiate header bidding and setup callbacks & timeout to actually-send-ad-server-request
function fetch_header_bids(dfp_params)
{
    let request_manager = {
        adserver_request_sent: false,
        hb_timeout_id        : null,
        is_a9_back           : false,
        is_ow_back           : false,
    };
    
    // tell openwrap about a9 IF OW loaded
    if( typeof(window.OWT) !== 'undefined' && typeof(window.OWT.registerExternalBidders) !== 'undefined' ){
        request_manager.openwrap_notify_id = window.OWT.registerExternalBidders( dfp_params.slots.map(function(val){ return val.div_id; }) );
    }
    
    // return true if all bidders have returned
    function are_all_bidders_back()
    {
        return request_manager.is_a9_back && request_manager.is_ow_back;
    }
    
    // handler for header bidder responses
    function set_header_bidder_back(bidder)
    {
        // return early if request to adserver is already sent
        if( request_manager.adserver_request_sent === true ){
            return;
        }
        
        // set the bidder targeting and flip bidder back flag
        if( typeof( request_manager[ 'is_' + bidder + '_back' ] ) !== 'undefined' ){
            request_manager[ 'is_' + bidder + '_back' ] = true;
        }
        
        // if all bidders are back, send the request to the ad server
        if( are_all_bidders_back() ){
            send_ad_server_request("set_header_bidder_back() -- bidder => '"+ bidder +"'");
        }
    }
    
    // actually get ads from DFP
    function send_ad_server_request(called_by)
    {
        if( typeof(called_by) === 'undefined' ){
            called_by = 'unknown';
        }
        
        if( SPECIALTY_DEBUG_LEVEL ){
            console.log("in fetch_header_bids()--send_ad_server_request() called_by=>'" + called_by + "'");
        }
        
        // return early if request already sent
        if (request_manager.adserver_request_sent === true) {
            if( SPECIALTY_DEBUG_LEVEL ){
                console.log("Already sent ad server request, returning meow");
            }
            return;
        }
        // flip the boolean that keeps track of whether the adserver request was sent
        request_manager.adserver_request_sent = true;
        
        // cancel failsafe timeout
        if( request_manager.hb_timeout_id ){
            clearTimeout( request_manager.hb_timeout_id );
        }
        
        // make ad request to DFP
        googletag.cmd.push(function() {
            if( typeof(apstag) !== 'undefined' ){
                apstag.setDisplayBids();
            }
            // TODO: make sure this is the correct way to use ow jsapi
            if( typeof(window.OWT) !== 'undefined' && typeof(window.OWT.notifyExternalBiddingComplete) !== 'undefined' ){
                window.OWT.notifyExternalBiddingComplete( request_manager.openwrap_notify_id );
                googletag.pubads().refresh();
            }
        });
    }
    
    // send header bidding requests
    function request_bids()
    {
        // a9 if apstag loaded (handle adblock gracefully)
        if( typeof( apstag ) !== 'undefined' ){
            // call init on apstag
            apstag.init({
                pubID: dfp_params.a9.publisher_id,
                adServer: 'googletag',
                bidTimeout: 2e3
            });
            // fetch bids from APS
            apstag.fetchBids(
                {
                    slots: get_apstag_slots(dfp_params),
                },
                function(bids) {
                    if( SPECIALTY_DEBUG_LEVEL ){
                        console.log("apstag fetchBids result");
                        console.log(bids);
                    }
                    set_header_bidder_back('a9');
                }
            );
        }else{
            // update request manager to be like 19 came back already
            request_manager.is_a9_back = true;
            if( SPECIALTY_DEBUG_LEVEL ){
                console.log('Detected a9 is NOT available, setting request_manager.is_a9_back = true');
            }
        }
        
        // if openwrap loaded (handle adblock gracefully)
        if( typeof( PWT.requestBids ) === 'function' ){
            
            let pwt_slots = PWT.generateConfForGPT(googletag.pubads().getSlots());
            
            // set AdUnit_DivId derived field
            pwt_slots.forEach(function(slot){
                //slot.AdUnit_DivId = slot.adUnitId + '_' + slot.divId;
                slot.divId_real = slot.divId;
                slot.divId      = slot.adUnitId + '_' + slot.divId;
            });
            
            if( SPECIALTY_DEBUG_LEVEL ){
                console.log("slots to pass to PWT.requestBids()");
                console.log(pwt_slots);
            }
            
            PWT.requestBids(
                pwt_slots,
                function(adUnitsArray) {
                    if( SPECIALTY_DEBUG_LEVEL ){
                        console.log("openwrap requestBids result");
                        console.log(adUnitsArray);
                    }
                    //PWT.addKeyValuePairsToGPTSlots(adUnitsArray);
                    PWT_ATS.addKeyValuePairsToGPTSlots(adUnitsArray);
                    set_header_bidder_back('ow');
                }
            );
        }else{
            // update request manager to be like 19 came back already
            request_manager.is_ow_back = true;
            if( SPECIALTY_DEBUG_LEVEL ){
                console.log('Detected Openwrap is NOT available, setting request_manager.is_ow_back = true');
            }
        }
        
        
        // in case that neither a9 nor openwrap loaded, go ahead and send the ad server request
        if( are_all_bidders_back() ){
            send_ad_server_request()
        }
    }
    
    // create timeout failsafe for header-bidding
    request_manager.hb_timeout_id = window.setTimeout(function() {
        send_ad_server_request('failsafe timeout');
    }, hb_timeout);
    
    // now finally initiate header bidding
    request_bids();
}

// load stuff
do_load(dfp_params);

// define and configure ads
googletag.cmd.push(function(){
    
    googletag.pubads().set("adsense_background_color", "FFFFFF");
    
    // define dfp slots
    dfp_ads = get_dfp_slots(dfp_params);
    
    // set global targeting
    set_global_targeting(dfp_params);
    
    
    // final pre-header-bidding dfp configs
    googletag.pubads().enableSingleRequest();
    googletag.pubads().disableInitialLoad();
    googletag.pubads().enableAsyncRendering();
    googletag.enableServices();
    
    
    // do header bidding & load ads
    fetch_header_bids(dfp_params);
});
