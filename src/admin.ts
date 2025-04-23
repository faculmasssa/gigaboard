export interface QueryInfo {
    key: string,
    query: string
}

const query = <HTMLInputElement>(document.getElementById('query'));
const key = <HTMLInputElement>(document.getElementById('key'));
const output = <HTMLElement>(document.getElementById('output'));

query.addEventListener('keydown', async ev => {
    if(ev.key !== 'Enter') {
        return;
    }
    let res = await fetch('/api/query', {
        method: 'POST',
        body: JSON.stringify(<QueryInfo>({
            key: key.value, query: query.value
        })),
        headers: {'Content-Type': 'application/json'},
    });
    output.innerText = await res.text();
});