let debounced = [];
/**
 * A simple debounce function timeout in (ms)
 * @param {function} callback
 * @param {number} timeout
 */
export function $debounce(callback, timeout, cancel) {
  let i = debounced.find(c => c.callback == callback);
  let index = debounced.length;
  if (i) {
    clearTimeout(i.id);
    index = i.index;
    if (cancel) {
      debounced.splice(index, 1);
      return;
    }
  }
  let id = setTimeout(() => {
    callback();
    let removeI = debounced.findIndex(c => c.callback == callback);
    if (removeI != -1) {
      debounced.splice(removeI, 1);
    }
  }, timeout);
  debounced[index] = { id, index, callback };
}
$debounce.purge = function () {
  debounced = [];
};
