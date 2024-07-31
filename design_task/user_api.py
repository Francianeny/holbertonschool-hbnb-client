#!/usr/bin/python3

"""API for managing users"""

import datetime
import jwt
import bcrypt
from flask import request
from flask_restx import Namespace, Resource, fields
from data_manager import DataManager

api = Namespace('users', description='User related operations')

data_manager = DataManager()
SECRET_KEY = 'your_jwt_secret_key'

# Data model for creating a user
user_model = api.model('User', {
    'user_id': fields.String(description='User ID'),
    'username': fields.String(required=True, description='Username'),
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Password'),
    'created_at': fields.DateTime(description='Creation date'),
    'updated_at': fields.DateTime(description='Last update date')
})

# Data model for login
login_model = api.model('Login', {
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Password')
})

@api.route('/')
class Users(Resource):
    @api.marshal_list_with(user_model)
    def get(self):
        """Retrieve all users."""
        all_users = data_manager.get_all_users()
        return all_users

    @api.expect(user_model, validate=True)
    @api.response(201, 'User successfully created')
    @api.response(400, 'Invalid request')
    def post(self):
        """Create a new user."""
        new_user_data = request.json
        new_user_data['password'] = bcrypt.hashpw(new_user_data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user_id = data_manager.save_user(new_user_data)
        response_message = {
            'message': 'User successfully created',
            'user_id': user_id
        }
        return response_message, 201

@api.route('/<string:user_id>')
class UserResource(Resource):
    @api.marshal_with(user_model)
    @api.response(404, 'User not found')
    def get(self, user_id):
        """Retrieve a user by its ID."""
        user_data = data_manager.get_user(user_id)
        if user_data:
            return user_data
        else:
            api.abort(404, "User not found")

    @api.expect(user_model, validate=True)
    @api.response(204, 'User successfully updated')
    @api.response(400, 'Invalid request')
    @api.response(404, 'User not found')
    def put(self, user_id):
        """Update an existing user."""
        new_user_data = request.json
        if 'password' in new_user_data:
            new_user_data['password'] = bcrypt.hashpw(new_user_data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        updated = data_manager.update_user(user_id, new_user_data)
        if updated:
            return '', 204
        else:
            api.abort(404, "User not found")

    @api.response(204, 'User successfully deleted')
    @api.response(404, 'User not found')
    def delete(self, user_id):
        """Delete an existing user."""
        deleted = data_manager.delete_user(user_id)
        if deleted:
            return '',
