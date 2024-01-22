from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Create the Flask application
app = Flask(__name__)
app.secret_key = os.environ.get('secret_key')

# Configure Flask-SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

# Create the SQLAlchemy object
db = SQLAlchemy(app)

# Import blueprints and register them with the app
from .auth import auth
from .main import main

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(main, url_prefix='')

if __name__ == '__main__':
    app.run(debug=True)