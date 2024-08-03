#!/usr/bin/python3

from flask import Flask, request, jsonify
from flask_restx import Api
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from user_api import api as user_api
from token_service import create_token, token_required
from data_manager import DataManager

app = Flask(__name__)
CORS(app)
app.config.from_object('config.Config')

jwt = JWTManager(app)

# Initialize DataManager
data_manager = DataManager()

new_reviews = []  # Définir new_reviews ici

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

    user = data_manager.verify_user(email, password)
    print(f"User found: {user}")

    if not user:
        print("Invalid credentials")
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user['id'])
    print(f"Generated access token: {access_token}")
    return jsonify(access_token=access_token)

@app.route('/places', methods=['GET'])
def get_places():
    places = data_manager.get_places()
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
    place = data_manager.get_place(place_id)

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
    user = data_manager.get_user(current_user_id)

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
