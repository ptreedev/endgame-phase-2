from dotenv import load_dotenv
import os
import requests
from flask import Flask, render_template

app = Flask(__name__)

load_dotenv()
URL = os.getenv('API_BASE_URL')

@app.route('/')
def home():
    try:
        response = requests.get(URL + '/coins')
        response.raise_for_status()
        coins = response.json()
        user_data = {
            "name": "Apprentice",
        }
        return render_template('index.html', user=user_data, coins=coins, api_url=URL)
    except requests.RequestException as e:
        print(f"Error fetching API data: {e}")
        return 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    # app.run(debug=True)