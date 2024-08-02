import jwt
import datetime
from functools import wraps
from flask import request, jsonify

SECRET_KEY = 'your_secret_key'
TOKEN_EXPIRATION = 3600

def encode_token(user_id):
    payload = {
        'sub': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=TOKEN_EXPIRATION)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        user_id = decode_token(token)
        if not user_id:
            return jsonify({'message': 'Token is invalid or expired!'}), 403
        return f(user_id, *args, **kwargs)
    return decorator
