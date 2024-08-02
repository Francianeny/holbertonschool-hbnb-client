#!/usr/bin/python3
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask import request, jsonify, Flask
from functools import wraps

# Configuration de votre application Flask
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Changez ceci pour une clé secrète plus sécurisée
jwt = JWTManager(app)

def encode_token(user_id):
    """
    Encode un token JWT pour un utilisateur avec `user_id`.
    """
    return create_access_token(identity=user_id)

def token_required(f):
    """
    Décorateur pour protéger les routes nécessitant un token JWT valide.
    """
    @wraps(f)
    @jwt_required()
    def decorator(*args, **kwargs):
        # Utilisation de `get_jwt_identity` pour obtenir l'identité de l'utilisateur depuis le token
        user_id = get_jwt_identity()
        return f(user_id, *args, **kwargs)
    return decorator

