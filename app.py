from dotenv import load_dotenv
import os
import requests
from flask import Flask, render_template, request, redirect, url_for, session, jsonify

app = Flask(__name__)

load_dotenv()
URL = os.getenv('API_BASE_URL', 'http://localhost:8080')
app.secret_key = os.getenv('SECRET_KEY')


def get_session_cookies():
    return {'session': session.get('api_session', '')}


@app.route('/')
def home():
    try:
        response = requests.get(URL + '/coins')
        response.raise_for_status()
        coins = response.json()
        return render_template(
            'index.html',
            coins=coins,
            user=session.get('user')
        )
    except requests.RequestException as e:
        print(f"Error fetching API data: {e}")
        return 'Service unavailable', 500


@app.route('/login', methods=['GET', 'POST'])
def login():
    if session.get('user'):
        return redirect(url_for('home'))

    error = None
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')

        try:
            response = requests.post(
                URL + '/auth/login',
                json={'username': username, 'password': password}
            )
            if response.ok:
                session['user'] = response.json()
                
                session['api_session'] = response.cookies.get('session', '')
                return redirect(url_for('home'))
            elif response.status_code == 423:
                error = 'Account locked. Please try again later.'
            else:
                error = 'Invalid username or password.'
        except requests.RequestException:
            error = 'Could not reach the server. Please try again.'

    return render_template('login.html', error=error)


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/api-requests')
def api_requests():
    user = session.get('user')
    if not user or user.get('role') != 'admin':
        return redirect(url_for('home'))
    try:
        response = requests.get(URL + '/requests', cookies=get_session_cookies())
        response.raise_for_status()
        return render_template('api_requests.html', requests=response.json(), user=user)
    except requests.RequestException:
        return 'Could not load requests', 500


@app.route('/proxy/<path:path>', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def proxy(path):
    if not session.get('user'):
        return jsonify({'message': 'unauthorised'}), 401

    response = requests.request(
        method=request.method,
        url=f"{URL}/{path}",
        json=request.get_json(silent=True),
        cookies=get_session_cookies(),
        params=request.args
    )

    return response.content, response.status_code, {
        'Content-Type': response.headers.get('Content-Type', 'application/json')
    }


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)