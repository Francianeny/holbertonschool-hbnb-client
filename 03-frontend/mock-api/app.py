#!/usr/bin/python3

from flask_restx import Api
from user_api import api as user_api
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)
app.config.from_object('config.Config')

jwt = JWTManager(app)

# Load users and places from JSON files
try:
    with open('data/users.json') as f:
        users = json.load(f)
except FileNotFoundError:
    users = []
    print("Warning: 'data/users.json' file not found. Using empty user list.")

try:
    with open('data/places.json') as f:
        places = json.load(f)
except FileNotFoundError:
    places = []
    print("Warning: 'data/places.json' file not found. Using empty places list.")

new_reviews = []

@app.route('/')
def index():
    return "Welcome to the Place Review API!"

@app.route('/login', methods=['POST'])
def login():
    print("Login endpoint hit")
    data = request.get_json()
    print(f"Received data: {data}")
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        print("Missing email or password")
        return jsonify({"msg": "Email and password are required"}), 400

    user = next((u for u in users if u['email'] == email and u['password'] == password), None)
    print(f"User found: {user}")

    if not user:
        print("Invalid credentials")
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user['id'])
    print(f"Generated access token: {access_token}")
    return jsonify(access_token=access_token)

@app.route('/places', methods=['GET'])
def get_places():
    response = [
        {
            "id": place['id'],
            "host_id": place['host_id'],
            "host_name": place['host_name'],
            "description": place['description'],
            "price_per_night": place['price_per_night'],
            "city_id": place['city_id'],
            "city_name": place['city_name'],
            "country_code": place['country_code'],
            "country_name": place['country_name']
        }
        for place in places
    ]
    return jsonify(response)

@app.route('/places/<place_id>', methods=['GET'])
def get_place(place_id):
    place = next((p for p in places if p['id'] == place_id), None)

    if not place:
        return jsonify({"msg": "Place not found"}), 404

    response = {
        "id": place['id'],
        "host_id": place['host_id'],
        "host_name": place['host_name'],
        "description": place['description'],
        "number_of_rooms": place['number_of_rooms'],
        "number_of_bathrooms": place['number_of_bathrooms'],
        "max_guests": place['max_guests'],
        "price_per_night": place['price_per_night'],
        "latitude": place['latitude'],
        "longitude": place['longitude'],
        "city_id": place['city_id'],
        "city_name": place['city_name'],
        "country_code": place['country_code'],
        "country_name": place['country_name'],
        "amenities": place['amenities'],
        "reviews": place['reviews'] + [r for r in new_reviews if r['place_id'] == place_id]
    }
    return jsonify(response)

@app.route('/places/<place_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(place_id):
    current_user_id = get_jwt_identity()
    user = next((u for u in users if u['id'] == current_user_id), None)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    rating = data.get('rating')
    review_text = data.get('review')

    if rating is None or review_text is None:
        return jsonify({"msg": "Rating and review text are required"}), 400

    new_review = {
        "user_name": user['name'],
        "rating": rating,
        "comment": review_text,
        "place_id": place_id
    }

    new_reviews.append(new_review)
    return jsonify({"msg": "Review added"}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5001)
