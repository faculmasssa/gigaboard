// @ts-check

/**
 * @typedef {Object} QueryInfo
 * @property {string} key 
 * @property {string} query
 */
const query = /** @type {HTMLInputElement} */ (document.getElementById('query'));
const key = /** @type {HTMLInputElement} */ (document.getElementById('key'));
const output = /** @type {HTMLElement} */ (document.getElementById('output'));

query.addEventListener('keydown', async ev => {
    if(ev.key !== 'Enter') {
        return;
    }
    let res = await fetch('/api/query', {
        method: 'POST',
        body: JSON.stringify(/** @type {QueryInfo} */ ({
            key: key.value, query: query.value
        })),
        headers: {'Content-Type': 'application/json'},
    });
    output.innerText = await res.text();
});

module.exports = {}