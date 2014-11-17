var helpers = module.exports;


helpers.whereId = function(array, id) {
    var i = -1,
        length = array.length - 1,
        item;

    while (i++ < length) {
        item = array[i];

        if (item.id === id) {
            return item;
        }
    }

    return null;
}
