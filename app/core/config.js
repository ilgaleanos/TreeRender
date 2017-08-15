/**
* Configure Axios network api, the interceptor execute before send request
*
*/
export var Axios = axios.create({
    timeout: 0, // no timeout
    baseURL: '/api/'
})
Axios.interceptors.request.use(function(config) {
    // window.ga('send', 'pageview', config.url);
    return config;
});

/**
* Configure options for validate options
*
*/
export const validateOptions = {
    errorPlacement: (error, element) => {
        error.appendTo(element.parent())
    }
};

/**
* Configure global options for toast
*
*/
export const toastrOptions = {
    "closeButton": true,
    "debug": false,
    "progressBar": true,
    "preventDuplicates": false,
    "positionClass": "toast-top-center",
    "onclick": null,
    "showDuration": "400",
    "hideDuration": "400",
    "timeOut": "2500",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "slideDown",
    "hideMethod": "slideUp"
};
