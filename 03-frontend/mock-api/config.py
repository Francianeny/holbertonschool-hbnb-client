import os

class Config:
    # Clé secrète utilisée par Flask pour sécuriser les sessions et autres utilisations de sécurité
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'

    # Clé secrète utilisée par Flask-JWT-Extended pour signer les tokens JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or '2a6d9ba9a97e00bf584c463ad6a3f2185bfd730f7452af7dfcfd45c01d126937'
    # Autres configurations Flask
    DEBUG = True  # Activer ou désactiver le mode debug
    CORS_HEADERS = 'Content-Type'  # Configurer les en-têtes pour CORS

    # Configuration pour Flask-JWT-Extended
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # Durée d'expiration des tokens (en secondes)
