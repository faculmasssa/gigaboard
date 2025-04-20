import cookie from 'js-cookie'

export async function logout() {
    await fetch('/api/logout', {
        method: 'POST',
        body: JSON.stringify(/** @type {import('../server').LogoutInfo} */ ({
            token: cookie.get('token')
        })),
        headers: {'Content-Type': 'application/json'},
    });
    cookie.remove('token');
    window.location.reload();
}