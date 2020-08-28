$(document).ready(function() {
    var VueSaveVehicleDropdown = new Vue({
        el: '#anon-saved-vehicles-dropdown',
        data: {
            vehicles: [],
            vehicle_count: 0
        },
        ready: function() {
            var self = this;
            self.vehicles = anonymousSavedVehicles;
            self.vehicle_count = self.vehicles.length;
        },
        methods: {
            setVehicles: function(data) {
                var self = this;
                self.vehicles = data;
                self.vehicle_count = data.length;

                // w=350&amp;h=218&amp;r=thumbnail
                for (var key in self.vehicles) {
                    var vehicle = self.vehicles[key];
                    var image = vehicle.SavedVehicle.vehicle_photo;
                }
            },
            formatPrice: function(price) {
                return '$' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            removeSavedVehicle: function(e) {
                var self = this;
                var vehicle_id = e.attr("data-vehicle-id");
                var url = e.attr("href");

                e.closest("li").slideUp();

                $.getJSON(url, function(response) {
                    if (response.data.status == 'success') {
                        self.setVehicles(response.data.vehicles);
                        $("a.save-vehicle-btn-click[data-vehicle-id=" + vehicle_id + "]").removeClass("active");
                    }
                });
            }
        }
    });

    var VueSaveVehicle = new Vue({
        el: '#save-vehicle-modal',
        data: {
            view: 'form',
            values: {
                SavedVehicle : {
                    name        : '',
                    description : '',
                    vehicle_id  : 0
                },
                SavedAlert : {
                    send_email : 0,
                    send_text  : 0,
                    schedule   : 0
                },
                User : {
                    phone : '',
                    safety_pin: ''
                }
            },
            message: ''
        },
        ready: function() {
            //   this.values.vehicle_id = window.location.pathname;
        },
        methods: {
            toggleSavedVehicle: function(heart) {
                var self = this;
                
                self.heart = heart;

                self.heart.toggleClass("active");

                var url = self.heart.attr("href");

                // toggle save state of the vehicle
                $.getJSON(url, function(response) {
                    if (response.data.status == 'success') {

                        // pass this to the vue app that manages the "my saved vehicles" dropdown
                        // response.data.values;
                        VueSaveVehicleDropdown.setVehicles(response.data.vehicles);

                        if (response.data.action == 'add') {
                            self.heart.addClass("active");

                            // check the count, if (count - 1) % 5 == 0
                            if ((response.data.vehicles.length - 1) % 5 == 0) {
                                VueSignInUp.message = 'This vehicle has been temporarily saved. Sign in to save it permanently.<br /><br />';
                                $("#sign-in-modal").addClass("active");
                            }

                        }
                        else if (response.data.action == 'delete') {
                            self.heart.removeClass("active");
                        }
                    }
                    else {
                        self.heart.toggleClass("active");
                    }
                });
            },
            userInfo: function () {
                // does nothing
            },
            userInfoCancel: function() {
                // does nothing
            }
        }
    });

    $("[save-vehicle-btn]").on('click', function(e) {
        e.preventDefault();
        VueSaveVehicle.toggleSavedVehicle($(this));
    });

    $("[anon-saved-vehicles-dropdown]").on('click', '[remove-saved-vehicle]', function(e) {
        e.preventDefault();
        VueSaveVehicleDropdown.removeSavedVehicle($(this));
    });

});
