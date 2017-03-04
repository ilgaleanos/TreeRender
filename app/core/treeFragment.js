/*
* @author ilgaleanos under licence MIT
*
* this function wasn't implement with createDocumentFragment,
* running in different environments shows that createDocumentFragment worsens
* performance
*
* Usage: This is  a simple function, take a rendered jsx and transform to dom.
*
* TODO:  better support for "components"
*
*/

const TreeFragment = function(strTag, dicProps, ...anyElem) {
    var Nodo = document.createElement(strTag);

    if (dicProps !== null) {
        if (strTag === "a") {
            Nodo.onclick = (event) => {
                History.pushState("", "", dicProps.href);
                return false;
            };
        }

        var arrKeys = Object.keys(dicProps),
            key,
            value;

        for (var i = 0, k = arrKeys.length; i < k; i++) {
            key = arrKeys[i];
            value = dicProps[key];
            if (typeof(value) == "function") {
                Nodo.addEventListener(key.substring(2), value, false);
            } else {
                Nodo.setAttribute(key, value);
            }
        }
    }

    var element,
        elemIsArray;
    for (var i = 0, k = anyElem.length; i < k; i++) {
        element = anyElem[i];
        elemIsArray = Array.isArray(element);

        if (elemIsArray && typeof(element) == "object") {
            for (var j = 0, l = element.length; j < l; j++) {
                Nodo.appendChild(element[j]);
            }
        } else if (!elemIsArray && typeof(element) == "object") {
            Nodo.appendChild(element);
        } else {
            Nodo.appendChild(document.createTextNode(element));
        }
    }
    return Nodo;
}

module.exports = TreeFragment;
