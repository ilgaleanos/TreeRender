/*
* @author ilgaleanos under licence MIT
*
* this function was designed with 2 simple ideas,
*       fast Render.
*      Low memory consumption.
*
* Usage: pass a container with ONE child, this chils to compare with a new DOM
*       change the props ands child on the fly, no patch generate.
*       This algorithm of differences is not the most optimal, but the response time is good
*
* TODO
*       sort childs in the same parent and recycling. possibly with ... keys?
*       You should prefer the performance and low memory to recycling...
*       Insert first generate overhead for replace.
*
*/

/**
 * Set directly the properties to elements, browsers not change properties
 * if is the same properties.  Disclaimer check if it is the same, worsens performance
 *
 */
const PropsDiff = function(oldTree, newTree) {
    var newAttributes = newTree.attributes || [],
        attribute;
    for (var i = 0, k = newAttributes.length; i < k; i++) {
        attribute = newAttributes[i];
        oldTree.setAttribute(attribute.name, attribute.value);
    }
    if (newTree.nodeType == Node.TEXT_NODE) {
        oldTree.textContent = newTree.textContent;
    }
}

/**
 * Handler to remove from a pointer, children from the father
 *
 */
const removeSince = function(parent, oldPointer) {
    var pointer;
    do {
        pointer = oldPointer.nextSibling;
        parent.removeChild(oldPointer);
        oldPointer = pointer;
    } while (pointer)
}

/**
 * Handler to append since a pointer, children to father
 *
 */
const appendSince = function(parent, newPointer) {
    var pointer;
    do {
        pointer = newPointer.nextSibling;
        parent.appendChild(newPointer);
        newPointer = pointer;
    } while (pointer)
}

/**
 * Iterate and compare childs at the same level ,
 * if this childs looks same, descend a one level and
 * iterate in your own childs
 *
 */
const LevelDiff = function(parent, newTree) {
    // pointers to iterate
    var oldPointer = parent.firstChild,
        newPointer = newTree,
        oldPointer2 = null,
        newPointer2 = null;

    while (oldPointer !== null && newPointer !== null) {
        // backup positions in same tree
        newPointer2 = newPointer;
        oldPointer2 = oldPointer;
        PropsDiff(oldPointer, newPointer);

        // recursively
        DIFF(oldPointer, oldPointer.firstChild, newPointer.firstChild);

        // go to the next step in the tree
        newPointer = newPointer2.nextSibling;
        oldPointer = oldPointer2.nextSibling;

        // the new is the little tree, remove child from old since the pointer
        if (oldPointer !== null && newPointer === null) {
            removeSince(parent, oldPointer);
            // the old is the little tree, append childs from new
            return;
        } else if (newPointer !== null && oldPointer === null) {
            appendSince(parent, newPointer);
            return;
        }
    }
}

/**
 * Recursive function to remove, append and replace childs from the parents
 *
 */
const DIFF = function(parent, oldTree, newTree) {

    // it's a container?
    if (oldTree !== null && oldTree.parentNode.tagName == "CONTAINER") {
        LevelDiff(parent, newTree);
        // are have the same tagName ?
        return;
    } else if (oldTree !== null && newTree !== null && oldTree.tagName == newTree.tagName) {
        LevelDiff(parent, newTree);
        // distinct tagName require replace, and revise next siblings
        return;
    } else if (oldTree !== null && newTree !== null) {
        var oldPointer = oldTree.nextSibling,
            newPointer = newTree.nextSibling;
        parent.replaceChild(newTree, oldTree);
        if (oldPointer !== null || newPointer !== null) {
            DIFF(parent, oldPointer, newPointer);
        }
        // the new is the little tree, remove child from old
        return;
    } else if (oldTree !== null) {
        removeSince(parent, oldTree);
        // the old is the little tree, append childs from new
        return;
    } else if (newTree !== null) {
        appendSince(parent, newTree);
        return;
    }
}

/**
 * Callback initializer, prevent overhead  of render containers
 *
 */
const RenderDiff = function(parent, newTree, nameCall = null, props = null) {
    if (nameCall !== null && props !== null && nameCall != props.onCurrentRoute) {
        return;
    }
    DIFF(parent, parent.firstChild, newTree);
}

module.exports = RenderDiff;
