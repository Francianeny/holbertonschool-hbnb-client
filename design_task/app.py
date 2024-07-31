from flask import Flask
from flask_restx import Api
from design_task.user_api import api as user_api_namespace

app = Flask(__name__)
api = Api(app)

api.add_namespace(user_api_namespace)

if __name__ == '__main__':
    app.run(debug=True)
