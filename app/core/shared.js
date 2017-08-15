const {Axios} = require('./config.js');

/**
* verify local storage disponibility and export this in window object
*
*/
export const localStoreIsAvailable = function(value = null) {
    if (value !== null) {
        window.localStoreIsAvailable = value;
        return;
    }

    var test = 'test';
    try {
        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        window.localStoreIsAvailable = true;
    } catch (e) {
        window.localStoreIsAvailable = false;
    }
}

/**
* Manager for server request, save the last request in local storage,
* and execute funHandler first time on get storage data, afeter execute server response.
* The funError is a handler for manage error on fail server response
* serverAccess es un booleano para autorizar la llamada axios request, true por defecto
*
*/
export const storeManager = function(ctx, url, funHandler, funError = null, serverAccess = true) {
    // if isn't provided funError, set a dummy function
    if (funError === null) {
        funError = function(ctx, error) {};
    }

    var available = window.localStoreIsAvailable;
    // Execute post server funHandler with sessionStorage data
    if (available === true) {
        var data = window.sessionStorage.getItem(url);
        if (data !== null) {
            funHandler(ctx, JSON.parse(data));
            if (serverAccess === false) {
                return;
            }
        }
    }

    // Execute handler and save the server response.data as JSON.stringify in sessionStorage
    Axios.get(url).then((response) => {
        funHandler(ctx, response.data);
        if (available === true) {
            window.sessionStorage.setItem(url, JSON.stringify(response.data));
        }
    }).catch((error) => {
        funError(ctx, error);
    });
}

/**
* autoRender: this functions call immediately render on detect changes in data. Use with caution.
* TIPS:
*   to set an element in array and call render USE arr.set(index,value)
*   if Array elements are objects, change props in an object not call render
*   if observable element is an object, only first level properties call render
*
*/
const arrObservable = function(ctx, arr = []) {
    arr.push = function() {
        Array.prototype.push.apply(this, arguments);
        ctx.render();
    }
    arr.pop = function() {
        Array.prototype.pop.apply(this);
        ctx.render();
    }
    arr.slice = function() {
        Array.prototype.slice.apply(this, arguments);
        ctx.render();
    }
    arr.sort = function() {
        Array.prototype.sort.apply(this, arguments);
        ctx.render();
    }
    arr.set = function(index, value) {
        arr[index] = value;
        ctx.render();
    }
    return arr;
};
const auxAutoRenderObject = function(ctx, name, value = null, obj = {}) {
    Object.defineProperty(obj, name, {
        get: function() {
            return value;
        },
        set: function(newValue) {
            value = newValue;
            ctx.render();
        },
        configurable: false
    });
}
const auxAutoRenderSimple = function(ctx, name, value = null) {
    Object.defineProperty(ctx, name, {
        get: function() {
            return value;
        },
        set: function(newValue) {
            value = newValue;
            ctx.render();
        },
        configurable: false
    });
}
export const autoRender = function(ctx, name, value = null) {
    var IsArray = Array.isArray(value)

    if (value === null) {
        auxAutoRenderSimple(ctx, name, value);

    } else if (IsArray) {
        auxAutoRenderSimple(ctx, name, arrObservable(ctx, value))

    } else if (typeof(value) == "object") {
        var arrKeys = Object.keys(value),
            key;
        var obj = {};
        for (var i = arrKeys.length; i-- > 0;) {
            key = arrKeys[i];
            auxAutoRenderObject(ctx, key, value[key], obj);
        }
        auxAutoRenderSimple(ctx, name, obj);

    } else {
        auxAutoRenderSimple(ctx, name, value);
    }
}

/**
* Random generator class for utils, can receive a sample string for running
*
*/
export class RandGen {
    constructor(sample = "0123456789abcdefghijklmnopqrstuvwxyz") {
        this._longitud = sample.length;
        this._sample = sample;
        this.lastSample = '';
    }

    // generate a pseudo-random float number into [0, 1)
    randFloat(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }

    // generate a pseudo-random integer into [0, 100)
    randInt(min = 0, max = 100) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // generate a pseudo-random string from sample
    sample(longitud = this._longitud) {
        this.lastSample = '';
        for (var i = 0; i < longitud; i++) {
            this.lastSample = this.lastSample + this._sample[this.randInt(0, this._longitud)];
        }
        return this.lastSample;
    }
}

/**
* Templates for handler event in forms with the var named form
*
*/
export const onChangeInput = function(ctx, event) {
    var target = event.target;
    ctx.form[target.name] = target.value;
}

export const onChangeSelect = function(ctx, event) {
    var target = event.target.options;
    ctx.form.selectValue = target[target.selectedIndex].value;
}

export const onChangeMultiple = function(ctx, event) {
    var target = event.target.options;
    ctx.form.selectMultiple = Array.prototype.map.call(target, (option) => {
        if (option.selected === true) {
            return option.value;
        }
    }).filter((n) => {
        return n != undefined
    })
}
