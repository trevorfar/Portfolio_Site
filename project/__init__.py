from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Create the SQLAlchemy object
db = SQLAlchemy()

def create_app():
    print("TEST")

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

    db.init_app(app)
    with app.app_context():
        db.create_all()

    # blueprint for auth routes in our app
    from .auth import auth
    app.register_blueprint(auth, url_prefix='')

    # blueprint for non-auth parts of app
    from .main import main 
    app.register_blueprint(main, url_prefix='')
    return app


