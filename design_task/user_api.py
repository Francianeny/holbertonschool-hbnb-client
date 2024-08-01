

from flask_restx import Namespace, Resource, fields
from design_task.token_service import create_token, decode_token
import bcrypt
import datetime

api = Namespace('users', description='User related operations')

# Modèles de données et routes ici...

@api.route('/login')
class UserLogin(Resource):
    @api.expect(login_model, validate=True)
    @api.response(200, 'Successfully logged in')
    @api.response(401, 'Invalid email or password')
    def post(self):
        """Authenticate a user and return a JWT token."""
        login_data = request.json
        email = login_data.get('email')
        password = login_data.get('password')

        user = data_manager.get_user_by_email(email)
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            token = create_token(user['user_id'])
            return {'token': token}, 200
        else:
            return {'message': 'Invalid email or password'}, 401



