import sqlite3
from flask import Flask, render_template, request, url_for, flash, redirect, jsonify, session
from flask_session import Session
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_url_path='/static')
app.config['SESSION_TYPE'] = 'filesystem'  # Use 'filesystem' for a simple setup

Session(app)

expHistory = []
resHistory = []

#Establish DataBase Connection
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
    
#Clear for Calculator
def clear():
   return '', None

#clears any equations in the calculator
def clearHistory():
   return [], []

currentPlayer = 'X'




@app.route('/')
def index():
    conn = get_db_connection()
    conn.close()
    return render_template('index.html')


@app.route('/app3')
def app3():
    return render_template('app3.html')

@app.route('/gcd', methods=['GET'])
def gcd():
    if request.method=='GET':
        input1 = request.args['input1']
        input2 = request.args['input2']

        intInput1 = int(input1)
        intInput2 = int(input2)

        # temp = 0
        
        # if(intInput1 < intInput2):
        #     temp = intInput1
        #     intInput1 = intInput2
        #     intInput2 = temp
        r2 = 0

        while(intInput2 != 0):
            r = intInput1 % intInput2
            intInput1 = intInput2
            intInput2 = r
            if(r != 0):
                r2 = r

        result = r2
    return render_template('app3.html', result=result)



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
    return render_template('ticTacToe.html', )

if __name__ == '__main__':
    app.run(debug=True)