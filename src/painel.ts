import cookie from 'js-cookie'

(global as any).logout = async function() {
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