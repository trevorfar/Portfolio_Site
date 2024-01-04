import sqlite3
from flask import Flask, render_template, request, url_for, flash, redirect, jsonify, session
from flask_session import Session
from werkzeug.exceptions import abort
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'fallback_secret_key')
app.config['SESSION_TYPE'] = 'filesystem'  # Use 'filesystem' for a simple setup
Session(app)

expHistory = []
resHistory = []

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def evaluateExpression(expression):
    try:
        if not expression.strip():
            return 0, None
        
        result = eval(expression)
        return result, None
    except Exception as e:
        return None, str(e)
    
def clear():
   return '', None

def clearHistory():
   return [], []

def get_post(post_id): 
    conn = get_db_connection()
    post = conn.execute('SELECT * FROM posts WHERE id = ?',
                        (post_id,)).fetchone()
    conn.close()
    if post is None:
        abort(404)
    return post


@app.route('/')
def index():
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM posts').fetchall()
    conn.close()
    return render_template('index.html', posts=posts)



@app.route('/<int:post_id>')
def post(post_id):
    post = get_post(post_id)
    return render_template('post.html', post=post)


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/calculator')
def calculator():
    return render_template('calculator.html')

#Sends the response as POST. All works off expression string. It returns an error if it's not a valid string NEEDS KEYBOARD SUPPORT
@app.route('/calculate', methods=['POST'])
def calculate():
    expression = request.form.get('expression')
    expHistory = session.get('expHistory', [])
    resHistory = session.get('resHistory', [])

    if expHistory and resHistory:
        # Clear the display if there are already equations in history
        expression, result = clear()
        session['expHistory'], session['resHistory'] = clearHistory()

    expression = request.form.get('expression')
    result, error = evaluateExpression(expression)

    if error:
        return render_template('calculator.html', result=result if result is not None else "Invalid Expression", expression=expression, error=None,
        expHistory=expHistory, resHistory=resHistory)
    
    expHistory.append(expression)
    resHistory.append(result)

    session['expHistory'] = expHistory
    session['resHistory'] = resHistory
        
    return render_template('calculator.html', result=result, expression=expression,
        expHistory=expHistory, resHistory=resHistory)

@app.route('/ticTacToe')
def ticTacToe():
    return render_template('ticTacToe.html') 