var autocomplete;
var VueSRP;

$(document).ready(function() {

    // turn off "ENTER" submits on the location field
    $("#LocationInput").on('keypress', function (e) {
        if (e.keyCode == 13) {
            return false;
        }
    });

    // get debugging messages without this
    Vue.config.silent = true;

    Vue.filter('currencyInput', {
        // model -> view
        read: function(value) {
        // use the built-in currency filter for display
            var currencyFilter = Vue.filter('currency');
            return currencyFilter(value).slice(0,-3);
        },
        // view -> model
        write: function(value, oldValue) {
            var number = +value.replace(/[^\d.]/g, '')
            return isNaN(number) ? 0 : parseFloat(number.toFixed(2))
        }
    });

    VueSRP = new Vue({
        el: '[vehicle-srp-search-form]',
        data: {
            api_url: '',
            dealership_slug: false,
            reference_data: {
                options: {
                    categories:       [],
                    subcategories:    [],
                    subsubcategories: [],
                    conditions:       [],
                    makes:            [],
                    models:           [],
                    trims:            [],
                    models1:          [],
                    trims1:           [],
                    models2:          [],
                    trims2:           [],
                    models3:          [],
                    trims3:           [],
                    models4:          [],
                    trims4:           [],
                    years:            [],
                    years_from:       [],
                    years_to:         [],
                    seller_types:     [],
                    mileages:         [],
                    colors:           [],
                    transmissions:    []
                },
                values: {
                    category:         "",
                    subcategory:      "",
                    subsubcategory:   "",
                    condition:        "",
                    make:             "",
                    model:            "",
                    trim:             "",
                    make1:            "",
                    model1:           "",
                    trim1:            "",
                    make2:            "",
                    model2:           "",
                    trim2:            "",
                    make3:            "",
                    model3:           "",
                    trim3:            "",
                    make4:            "",
                    model4:           "",
                    trim4:            "",
                    year_from:        "",
                    year_to:          "",
                    seller_type:      "",
                    price_from:       "",
                    price_to:         "",
                    seller_type:      "",
                    mileage:          "",
                    limit:            25,
                    order:            "",
                    keyword:          "",
                    distance:         "",
                    place:            "",
                    location:         "",
                    lat:              "",
                    lng:              "",
                    dealership_slug:  "",
                    dealership_city:  "",
                    dealership_state: "",
                    video:            "",
                    color:            "",
                    transmission:     ""
                },
                labels: {
                    category:       "",
                    subcategory:    "",
                    subsubcategory: "",
                    condition:      "",
                    make:           "",
                    model:          "",
                    trim:           "",
                    make1:          "",
                    model1:         "",
                    trim1:          "",
                    make2:          "",
                    model2:         "",
                    trim2:          "",
                    make3:          "",
                    model3:         "",
                    trim3:          "",
                    make4:          "",
                    model4:         "",
                    trim4:          "",
                    years:          "",
                    seller_type:    "",
                    price:          "",
                    mileage:        "",
                    keyword:        "",
                    video:          "",
                    color:          "",
                    transmission:   ""
                },
                vars: {

                }
            },
            cant_add_vehicle: false
        },
        ready: function() {
            // console.log(this.reference_data);
            // get query params from the URL
            const queryParams = JSON.parse($('div#queryString').html());
            // const url = window.location.pathname.split('/');
            // if(typeof url[2] != 'undefined') {
            //     this.reference_data.values['category'] = url[2];
            // }
            // set the query param data to our vue data
            _.each(queryParams, function(value, key) {
                if (this.reference_data.values.hasOwnProperty(key)) {
                    this.reference_data.values[key] = value;
                }
                else if (key == 'year') {
                    this.reference_data.values['year_from'] = value;
                    this.reference_data.values['year_to'] = value;
                }
            }, this);

            // Dealer VSRP
            if($('#dealership_slug').length) {
                this.reference_data.values['dealership_slug']  = $('#dealership_slug').val();
                this.reference_data.values['dealership_city']  = $('#dealership_city').val();
                this.reference_data.values['dealership_state'] = $('#dealership_state').val();
            }

            // set the proper api URL to access for the form
            this.api_url = '/vehicles/srp_form.json';

            // fetch data to populate the forms
            this.onReferenceDataChange();
        },
        methods: {
            onLocationChange: function(loc) {
                //console.log('onLocationChange');
                if( typeof( loc.lat ) != "undefined" && typeof( loc.lon ) != "undefined" ){

                    $('[data-equiv-btn]').removeClass('btn-disabled').removeAttr('disabled').addClass('btn-heylisten');

                    this.reference_data.values.lat = loc.lat;
                    this.reference_data.values.lng = loc.lon;

                    // have to set this manually
                    this.reference_data.values.place    = loc.input_text;
                    this.reference_data.values.location = loc.url_loc_str;

                    // if no distance is set, set it ourselves
                    if (!this.reference_data.values.distance) {
                        this.reference_data.values.distance = '100';
                    }

                    this.onReferenceDataChange();
                }
            },
            onReferenceDataChange: function() {
                $.ajax({
                    url: this.api_url,
                    dataType: 'json',
                    type: 'GET',
                    data: this.reference_data.values,           // only send form values
                    success: function(response) {
                        this.reference_data = response.data;   // get back EVERYTHING

                        this.cant_add_vehicle = false;

                        if(!this.reference_data.values['make'].length) {
                            this.cant_add_vehicle = true;
                        }

                        if(this.reference_data.values['make1'].length) {
                            $('.make1-fields').show();
                        } else {
                            $('.make1-fields').hide();
                        }

                        if(this.reference_data.values['make2'].length) {
                            $('.make2-fields').show();
                        } else {
                            $('.make2-fields').hide();
                        }

                        if(this.reference_data.values['make3'].length) {
                            $('.make3-fields').show();
                        } else {
                            $('.make3-fields').hide();
                        }

                        if(this.reference_data.values['make4'].length) {
                            $('.make4-fields').show();
                            this.cant_add_vehicle = true;
                        } else {
                            $('.make4-fields').hide();
                        }
                    }.bind(this)
                });
            },
            yearFromDisabled: function(year) {
                return typeof(this.reference_data.options.years_from[year]) === "undefined";
            },
            yearToDisabled: function(year) {
                return typeof(this.reference_data.options.years_to[year]) === "undefined";
            },
            removeFilter: function(key) {
                this.doRemoveFilter(key);

                $('[data-equiv-btn]').removeClass('btn-disabled').removeAttr('disabled').addClass('btn-heylisten');
                this.onReferenceDataChange();

                if( key == '*' ){
                    $("#LocationInput").val('');
                    //console.log('clearing location input text 0');
                    //setCookie('last_search_location', null, 200);
                    //document.cookie = 'last_search_location=; expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;';
                }
            },
            doRemoveFilter: function(key) {
                switch (key) {
                    case 'years':
                        this.doRemoveFilter('year_from');
                        this.doRemoveFilter('year_to');
                        break;
                    case 'price':
                        this.doRemoveFilter('price_from');
                        this.doRemoveFilter('price_to');
                        break;
                    case 'location':
                        this.reference_data.values.location = "";
                        //setCookie('last_search_location', null, 200);
                        this.doRemoveFilter('distance');
                        this.doRemoveFilter('place');
                        break;
                    case '*':
                        $.each(this.reference_data.labels, function(key, value) {
                            this.doRemoveFilter(key);
                        }.bind(this));
                        break;
                    default:
                        this.reference_data.values[key] = "";
                        break;
                }
            },
            addVehicle: function() {
                if(!$('body').hasClass('filters-expanded')) {
                    $('body').removeClass('expanded')
                        .css({top: 0 - window.scrollY + 'px'})
                        .addClass('filters-expanded');
                }

                // prevent adding more than one at a time
                this.cant_add_vehicle = true;

                if(this.reference_data.values['make'].length) {
                    $('.make1-fields').show();
                }

                if(this.reference_data.values['make1'].length) {
                    $('.make2-fields').show();
                }

                if(this.reference_data.values['make2'].length) {
                    $('.make3-fields').show();
                }

                if(this.reference_data.values['make3'].length) {
                    $('.make4-fields').show();
                }
            },
            onSubmit: function() {
                var filteredValues = {};
                var last_srp_filters = {'make':null, 'model':null, 'keyword':null, 'year_min':null, 'year_max':null};

                // Dealer VSRP
                if(this.reference_data.values['dealership_slug']) {
                    var action = '/dealers/'+this.reference_data.values['dealership_city']+'-'+this.reference_data.values['dealership_state']+'/'+this.reference_data.values['dealership_slug']+$(this.$el).attr('action');

                    for (key in this.reference_data.values) {
                        if (this.reference_data.values[key]) {
                            if(key == 'limit' && this.reference_data.values['limit'] == 25) {
                                //
                            } else if(key == 'location') {
                                //
                            } else if(key == 'dealership_slug' || key == 'dealership_city' || key == 'dealership_state') {
                                // Dealer VSRP
                            } else if(key == 'distance' && this.reference_data.values['distance'] == 100) {
                                //
                            } else if(_.indexOf(['place','lat','lng'],key) != -1) {
                                //
                            } else {
                                filteredValues[key] = this.reference_data.values[key];
                            }
                        }
                    }
                } else {
                    var action = $(this.$el).attr('action');

                    var vehicle = '';

                    if (this.reference_data.values['category']) {
                        vehicle += this.reference_data.values['category'].replace(/-/g, '_');
                    }

                    if(this.reference_data.values['year_from'] && this.reference_data.values['year_to'] && this.reference_data.values['year_to'] == this.reference_data.values['year_from']) {
                        if(vehicle.length > 0) {
                            vehicle += '-';
                        }

                        vehicle += this.reference_data.values['year_from'];
                    }
                    if(this.reference_data.values['year_from']) {
                        last_srp_filters['year_min'] = this.reference_data.values['year_from'].replace(/-/g, '-');
                    }

                    if(this.reference_data.values['year_to']) {
                        last_srp_filters['year_max'] = this.reference_data.values['year_to'].replace(/-/g, '-');
                    }

                    if(this.reference_data.values['make']) {
                        if(vehicle.length > 0) {
                            vehicle += '-';
                        }

                        vehicle += this.reference_data.values['make'].replace(/-/g, '_');
                        last_srp_filters['make'] = this.reference_data.values['make'].replace(/-/g, '-');
                    }

                    if(this.reference_data.values['model']) {
                        if(vehicle.length > 0) {
                            vehicle += '-';
                        }

                        vehicle += this.reference_data.values['model'].toString().replace(/-/g, '_');
                        last_srp_filters['model'] = this.reference_data.values['model'].replace(/-/g, '-');
                    }

                    if(this.reference_data.values['trim']) {
                        if(vehicle.length > 0) {
                            vehicle += '-';
                        }

                        vehicle += this.reference_data.values['trim'].toString().replace(/-/g, '_');
                    }

                    if(vehicle.length > 0) {
                        action += '/'+vehicle+'-for-sale';
                    }

                    if (last_srp_filters['make'] == null && this.reference_data.values['keyword']) {
                        last_srp_filters['keyword'] = this.reference_data.values['keyword'];
                    }

                    setCookie('last_srp_filters', last_srp_filters, 200);

                    if(this.reference_data.values['location']) {
                        if(vehicle.length > 0) {
                            action += '-in-';
                        } else {
                            action += '/for-sale-in-';
                        }

                        action += this.reference_data.values['location'];
                    }
                    /* console.log(this.reference_data.values); */
                    /* console.log(action); */
                    for (key in this.reference_data.values) {
                        if (this.reference_data.values[key]) {
                            if(key == 'category') {
                                //
                            } else if((key == 'year_from' || key == 'year_to') && this.reference_data.values['year_from'] == this.reference_data.values['year_to']) {
                                //
                            } else if(key == 'make' || key == 'model' || key == 'trim') {
                                //
                            } else if(key == 'limit' && this.reference_data.values['limit'] == 25) {
                                //
                            } else if(key == 'location') {
                                //
                            } else if(key == 'dealership_slug' || key == 'dealership_city' || key == 'dealership_state') {
                                // Dealer VSRP
                            } else if(key == 'distance' && this.reference_data.values['distance'] == 100) {
                                //
                            } else if(_.indexOf(['place','lat','lng'],key) != -1) {
                                //
                            } else {
                                filteredValues[key] = this.reference_data.values[key];
                            }
                        }
                    }
                }

                $("button[type='submit']").addClass("btn-loading");

                var queryString = _.toQueryString(filteredValues);
                window.location.href = action + queryString;
            },
            setLocFromCookie: function(){
                // location not already set in ref data
                if( this.reference_data.values.location  ){
                    //console.log("--returning-- this.reference_data.values.location  already set");
                    return;
                }
                
                // last location cookie exists
                lsl = getCookie('last_search_location');
                if( !lsl ){
                    //console.log("--returning-- last_search_location cookie NOT set");
                    return;
                }
                // validate last location cookie
                if( typeof(lsl.input_text) === 'undefined' || typeof(lsl.url_loc_str) === 'undefined' || typeof(lsl.lat) === 'undefined' || typeof(lsl.lon) === 'undefined' ){
                    //console.log("--returning-- last_search_location cookie NOT VALID");
                    return;
                }
                
                //console.log("--UPDATING-- setting refdata location from cookie");
                
                $("#LocationInput").val(lsl.input_text);
                this.reference_data.values.place    = lsl.input_text;
                this.reference_data.values.location = lsl.url_loc_str;
                
                // if no distance is set, set it ourselves
                if (!this.reference_data.values.distance) {
                    this.reference_data.values.distance = '100';
                }
                
                this.onReferenceDataChange();
                $('[data-equiv-btn]').removeClass('btn-disabled').removeAttr('disabled').addClass('btn-heylisten');
            },
            consoleLogRefData: function(){
                console.log('VueSRP.reference_data.values');
                console.log(`    make      => '${this.reference_data.values.make}'`);
                console.log(`    place     => '${this.reference_data.values.place}'`);
                console.log(`    distance  => '${this.reference_data.values.distance}'`);
                console.log(`    location  => '${this.reference_data.values.location}'`);
            }
        },
        computed: {
            priceLabel: function() {
                return this.reference_data.labels.price;
            },
            yearLabel: function() {
                var label = "SELECT YEAR";

                if(this.reference_data.labels.years) {
                    label = this.reference_data.labels.years;
                }

                return label;
            },
            vehicleLabel: function() {
                var label = "SELECT VEHICLE";

                var make  = this.reference_data.labels.make;
                var model = this.reference_data.labels.model;
                var trim  = this.reference_data.labels.trim;

                if (make) {
                    label = make;
                }

                if (model) {
                    label += ' ' + model;
                }

                if (trim) {
                    label += ' ' + trim;
                }

                return label;
            },
            filters: function() {
                var filteredLabels = {};
                for (key in this.reference_data.labels) {
                    if (this.reference_data.labels[key]) {
                        if (_.indexOf(['place','distance'], key) == -1) {
                            var label = this.reference_data.labels[key];
                            if (typeof label == 'number') {
                                label = label.toString();
                            }
                            // if its a model-in a series, remove the leading ' - '
                            if (label.slice(0,3) == ' - ') {
                                label = label.slice(3);
                            }
                            if (label.indexOf('nationwide miles') !== -1) {
                                label = label.replace('nationwide miles','any distance');
                            }
                            filteredLabels[key] = label;
                        }
                    }
                }
                return filteredLabels;
            }
        }
    });

    // on location select, set refdata-location from cookie if loc-cookie exists & loc not already set
    $("a[href=#location-dropdown]").on('click', function (e) {
        VueSRP.setLocFromCookie();
    });

    $('input[aircomplete-loc]').aircomplete({
        inheritStyles: true,
        onSelect: function(dataRow) {

            //save selected label as last keyword search
            //Note: this is required since clicking on a result does not submit the form
            var this_search_location = {
                input_text : dataRow.label,       // label/text-string for/from the text area (string user sees/entered)
                url_loc_str: dataRow.url_loc_str, // location string properly slugged for usage in a URL
                lat        : "" + dataRow.lat,    // latitude  stored as a string
                lon        : "" + dataRow.lon,    // longitude stored as a string
                city       : dataRow.city,        // City String Proper
                state      : dataRow.state,       // state abbrev; ex: GA
                state_long : dataRow.state_long,  // full state string, ex: Georgia
                zip        : "" + dataRow.zip,    // zip code stored as a string
            };

            setCookie('last_search_location', this_search_location, 200);

            VueSRP.onLocationChange(dataRow);
            // return the value that should populate the input
            $('input[aircomplete-loc]').val(dataRow.label);
            return dataRow.label;
        },
        template: function(dataRow, searchTerm) {
            var text = dataRow.label;

            // remove all braces
            text = text.replace(new RegExp('{', 'g'), "");
            text = text.replace(new RegExp('}', 'g'), "");

            var searchTerms = searchTerm.trim().split(' ');

            // add braces for strong characters
            for (var i = 0; i < searchTerms.length; i++) {
                text = text.replace(new RegExp('(' + searchTerms[i] + ')', 'igm'), "{$1}")
            }

            // swap braces for strong tags
            text = text.replace(new RegExp('{', 'g'), "<strong>");
            text = text.replace(new RegExp('}', 'g'), "</strong>");

            var item = "";

            item += "<div>";
            // item += "<a href='" + dataRow.url + "'>" + text + "</a>";
            item += text;
            item += "</div>";

            return item;
        },
        match: function(dataRow, searchTerm) {
            return true;
        },
        dataKey: 'data',
        ajaxOptions: {
            url:      '/loc-autocomplete.json?term={{searchTerm}}',
            dataType: 'json',
            method:   'GET',
        },
        searchDelay: 300,
        minSearchStringLength: 2,
        debug: false
    });

});
