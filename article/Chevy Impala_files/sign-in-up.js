var VueSignInUp = null;

$(document).ready(function() {
    var $loginForm = $('#sign-in-up-login-form');
    var $registerForm = $('#sign-in-up-register-form');
    
    VueSignInUp = new Vue({
        el: '#sign-in-modal',
        data: {
            view: 'main',
            redirect: null,
            login: {
                values: {
                    email: '',
                    password: ''
                },
                errors: {
                    email: ''
                },
                redirect: ''
            },
            register: {
                values: {
                    email: '',
                    email_confirm: '',
                    password: '',
                    password_confirm: '',
                    terms: ''
                },
                errors: {
                    email: '',
                    email_confirm: '',
                    password: '',
                    password_confirm: '',
                    terms: ''
                },
                redirect: ''
            },
            message: ''
        },
        methods: {
            setRedirect: function(redirect) {
                this.redirect = redirect;
            },
            goToMain: function() {
                this.view = 'main';
            },
            goToLogin: function() {
                this.view = 'login';
                this.message = '';
            },
            goToRegister: function() {
                this.view = 'register';
                this.message = '';
            },
            loading: function() {
                this.view = 'loading';
            },
            submitLogin: function() {
                var self = this;
                
                self.loading();
                
                $.ajax
                ({
                    type: "POST",
                    url: $loginForm.attr('action'),
                    data: $loginForm.serialize(),
                    dataType: 'json',
                    success: function (response) {
                        if (response.status == 'success') {
                            if (self.redirect) {
                                window.location = self.redirect;
                            }
                            else {
                                if(response.redirect.length > 0) {
                                    // if we have an actual redirect, go there
                                    window.location = response.redirect;
                                }
                                else {
                                    // just refresh the current page
                                    window.location.reload(true);
                                }
                            }
                        }
                        else {
                            self.login = response;
                            self.goToLogin();
                        }
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        self.login.errors.email = 'Bad Request';
                        self.goToLogin();
                    }
                });
            },
            submitRegister: function() {
                
                var self = this;
                
                self.loading();
                
                $.ajax
                ({
                    type: "POST",
                    url: $registerForm.attr('action'),
                    data: $registerForm.serialize(),
                    dataType: 'json',
                    success: function (response) {
                        if (response.status == 'success') {
                            if (self.redirect) {
                                window.location = self.redirect;
                            }
                            else {
                                if(response.redirect.length > 0) {
                                    window.location = response.redirect;
                                }
                                else {
                                    window.location.reload(true);
                                }
                            }
                        } else {
                            self.register = response;
                            self.goToRegister();
                            grecaptcha.reset();
                        }
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        self.register.errors.email = 'Bad Request';
                        self.goToRegister();
                    }
                });
            }
        }
    });

    $('body').on('click', 'a[href="#sign-in-modal"]', function() {
        if ($(this).attr("data-redirect")) {
            VueSignInUp.setRedirect($(this).attr("data-redirect"));
        }
    });

});