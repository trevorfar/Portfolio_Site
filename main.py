import sqlite3, json
import requests

from flask import Flask, render_template, request, url_for, flash, redirect, jsonify, session, Blueprint
from flask_session import Session
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

load_dotenv()

main = Blueprint('main', __name__, url_prefix='/main')



expHistory = []
resHistory = []


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


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/discrete')
def discrete():
    return render_template('discrete.html')

@main.route('/gcd', methods=['GET'])
def gcd():
    if request.method=='GET':
        try: 
            input1 = request.args['input1']
            input2 = request.args['input2']

            intInput1 = float(input1)
            intInput2 = float(input2)
        
        except ValueError:
            return render_template('discrete.html', result="Out of Bounds", input1=input1, input2=input2)
        
        if(intInput1 == 0 or intInput2 == 0):
            return render_template('discrete.html', result="Can't take GCD with 0", input1=input1, input2=input2)
        r2 = 1
       


        if(intInput1 % intInput2 == 0):
            result = min(intInput1, intInput2)
            return render_template('discrete.html', result=int(result), input1=input1, input2=input2)


        while(intInput2 != 0):
            r = intInput1 % intInput2
            intInput1 = intInput2
            intInput2 = r
            if(r != 0):
                r2 = r

        result = r2
        return render_template('discrete.html', result=int(result), input1=input1, input2=input2)
    return render_template('discrete.html', result="", input1="")

    

@main.route('/about')
def about():
    return render_template('about.html')


@main.route('/calculator')
def calculator():
    return render_template('calculator.html')

#Sends the response as POST. All works off expression string. It returns an error if it's not a valid string NEEDS KEYBOARD SUPPORT
@main.route('/calculate', methods=['POST'])
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


@main.route('/ticTacToe')
def ticTacToe():
    return render_template('ticTacToe.html', )

@main.route('/app4')
def app4():
    return render_template('app4.html')


def printResp(obj):
    text = json.dumps(obj, sort_keys=True, indent=4)
    print(text)

last_stock_symbol = None


@main.route('/getPrice', methods = ['GET'])
def getStockPrice():

    global last_stock_symbol

    api_key = os.environ.get('API_KEY')
    stock_symbol = request.args.get('symbol')

    if not stock_symbol:
        return "Please provide a valid stock symbol"

    if stock_symbol == last_stock_symbol:
        return "Please provide a new stock symbol"
    
    base_url = "https://www.alphavantage.co/query"
    function = "GLOBAL_QUOTE"    

# Construct the API request URL
    params = {
        "function": function,
        "symbol": stock_symbol,
        "apikey": api_key,
    }
    
    response = requests.get(base_url, params=params)

    print(response.status_code)
    printResp(response.json())

    if response.status_code == 200:
        try:    
            data = response.json()
            print(data)

            if "Global Quote" in data:
                global_quote = data["Global Quote"]
                last_stock_symbol = stock_symbol

                if not global_quote:
                    return "Empty response for the given symbol. It may not be a valid stock symbol."
                
                return  render_template('app4.html', price=data["Global Quote"]["05. price"], title = data["Global Quote"]["01. symbol"], change = data["Global Quote"]["09. change"])
            else:
                return "symbol not found"
        except json.JSONDecodeError: 
            return f"Error: {response.status_code}"
        

@main.route('/databaseApp', methods=['GET', 'POST'])
def databaseApp():
    return render_template('databaseApp.html')



    
   

