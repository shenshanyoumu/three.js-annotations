/**
 * @author mrdoob / http://mrdoob.com/
 */

// 数组中找到最小值
function arrayMin(array) {

    if (array.length === 0) return Infinity;

    var min = array[0];

    for (var i = 1, l = array.length; i < l; ++i) {

        if (array[i] < min) min = array[i];

    }

    return min;

}

// 数组中找到最大值
function arrayMax(array) {

    if (array.length === 0) return -Infinity;

    var max = array[0];

    for (var i = 1, l = array.length; i < l; ++i) {

        if (array[i] > max) max = array[i];

    }

    return max;

}

export { arrayMin, arrayMax };