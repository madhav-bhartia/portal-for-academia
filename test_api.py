import requests

try:
    res = requests.post("http://127.0.0.1:8000/api/login", json={"email": "alice@student.com", "password": "password"})
    print("Status Code:", res.status_code)
    print("Response:", res.text)
except Exception as e:
    print("Error:", e)
