import sqlite3, json
import requests
from . import db
from flask import Flask, render_template, request, url_for, flash, redirect, jsonify, session, Blueprint
from flask_session import Session
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func



main = Blueprint('main', __name__, url_prefix='/main')


        



    
   

