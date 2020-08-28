$(document).ready(function() {
    var VueCompareVehicles = new Vue({
        el: '#compare-vehicles-wrapper',
        data: {
            view: 'compare',
            vehicles: [],
            saved_vehicles: [],
            message: ''
        },
        ready: function() {
            $("body").append("<div id='comparelog' style='display:none'></div>");
            this.init();
        },
        methods: {
            // load compare view w/ fresh vehicles
            compare: function() {
                var self = this;
                
                self.message = '';
                
                $.ajax({
                    type: "GET",
                    url: '/compare_vehicles/read.json?' + (new Date().getTime()),
                    dataType: 'json',
                    success: function (response) {
                        self.vehicles = response.data.vehicles;
                        self.saved_vehicles = response.data.saved_vehicles;
                        self.message = response.data.message;
                        
                        self.view = 'compare';
                    }
                });
            },
            // load addsaved view w/ fresh saved_vehicles
            addsaved: function() {
                var self = this;
                
                $.ajax({
                    type: "GET",
                    url: '/compare_vehicles/read.json?' + (new Date().getTime()),
                    dataType: 'json',
                    success: function (response) {
                        self.vehicles = response.data.vehicles;
                        self.saved_vehicles = response.data.saved_vehicles;
                        self.message = response.data.message;
                        
                        self.view = 'addsaved';
                    }
                });
            },
            // load vehicles, saved_vehicles, message from server
            init: function() {
                var self = this;
                let init_json = null;
                
                if( $(this.$el).attr('bootstrap-json') ){
                    init_json = JSON.parse( $( $(this.$el).attr('bootstrap-json') ).text());
                }
                
                if( init_json ){
                    // bootstrap from json embedded in page
                    self.vehicles       = init_json.data.vehicles;
                    self.saved_vehicles = init_json.data.saved_vehicles;
                    self.message        = init_json.data.message;
                    
                    $.each(self.vehicles, function(key, vehicle) {
                        $('.compare-vehicle-btn[data-vehicle-id='+vehicle.vehicle_id+']').addClass('active');
                    });
                }else{
                    // bootstrap from api endpoint
                    $.ajax({
                        type: "GET",
                        url: '/compare_vehicles/read.json?' + (new Date().getTime()),
                        dataType: 'json',
                        success: function (response) {
                            self.vehicles       = response.data.vehicles;
                            self.saved_vehicles = response.data.saved_vehicles;
                            self.message        = response.data.message;
                            
                            $.each(self.vehicles, function(key, vehicle) {
                                $('.compare-vehicle-btn[data-vehicle-id='+vehicle.vehicle_id+']').addClass('active');
                            });
                        }
                    });
                }
            },
            // add or remove a vehicle, then refresh vehicles, saved_vehicles, message
            addremove: function(vehicle_id) {
                var self = this;
                
                $.ajax({
                    type: "POST",
                    url: '/compare_vehicles/toggle.json',
                    dataType: 'json',
                    data: {'vehicle_id':vehicle_id},
                    success: function (response) {
                        self.vehicles = response.data.vehicles;
                        self.saved_vehicles = response.data.saved_vehicles;
                        self.message = response.data.message;
                        
                        self.view = 'compare';
                        
                        if(self.message.length > 0 && !$('#compare-modal').hasClass('active')) {
                            $('#compare-modal').addClass('active');
                        }
                        
                        if(self.vehicles.length == 0 && $('#compare-modal').hasClass('active')) {
                            $('#compare-modal').removeClass('active');
                        }
                        
                        $('.compare-vehicle-btn').removeClass('active');
                        $.each(self.vehicles, function(key, vehicle) {
                            $('.compare-vehicle-btn[data-vehicle-id='+vehicle.vehicle_id+']').addClass('active');
                        });

                    }
                });
            },
            // clear all vehicles, then refresh vehicles, saved_vehicles, message
            clearall: function() {
                var self = this;
                
                $.ajax({
                    type: "GET",
                    url: '/compare_vehicles/clearall.json?' + (new Date().getTime()),
                    dataType: 'json',
                    success: function (response) {
                        self.vehicles = response.data.vehicles;
                        self.saved_vehicles = response.data.saved_vehicles;
                        self.message = response.data.message;
                        
                        self.view = 'compare';
                        
                        $('.compare-vehicle-btn').removeClass('active');
                        $('#compare-modal').removeClass('active');

                    }
                });
            },
            // go to the compare page with current vehicles
            gotocompare: function() {
                var vs = [];
                var ids = [];
                
                $.each(this.vehicles, function(key,vehicle) {
                    vs.push(vehicle.slug);
                    ids.push(vehicle.vehicle_id);
                });
                
                vs = vs.join('-vs-');
                ids = ids.join(',');
                
                var url = '/compare/'+vs+'?listing_ids='+ids;
                
                window.location = url;
            }
        }
    });

    // when modal is opened, load vehicles, saved_vehicles, message from server
    $("[compare-modal]").on('click', function(e) {
        e.preventDefault();
        VueCompareVehicles.compare();
    });
    
    // when adding or removing a vehicle, refresh vehicles, saved_vehicles, message
    $("[compare-addremove]").on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('active');
        VueCompareVehicles.addremove($(this).data('vehicle-id'));
    });
});
