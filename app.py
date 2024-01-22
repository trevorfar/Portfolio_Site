# app.py
from flask import Flask
from auth import auth
from main import main

app = Flask(__name__)

# Register blueprints with the app
app.register_blueprint(auth)
app.register_blueprint(main)
