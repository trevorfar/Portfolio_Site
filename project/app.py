
from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from .auth import auth
from .main import main

app = Flask(__name__)
app.secret_key = os.environ.get('secret_key')

# Register blueprints with the app
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(main, url_prefix='')





if __name__ == '__main__':
    app.run(debug=True)