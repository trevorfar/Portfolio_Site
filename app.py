import json
import requests
from flask import Flask, render_template, request, url_for, redirect, session, g, jsonify, flash
import os, re
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, logout_user, current_user
from dotenv import load_dotenv
from models import Users, db
from calculator import evaluateExpression, clear, clearHistory
from flask_migrate import Migrate
from flask_mail import Message, Mail
import secrets
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

#yes
app = Flask(__name__)

app.secret_key = os.environ.get('secret_key')
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"

migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)



load_dotenv()

expHistory = []
resHistory = []


@login_manager.user_loader
def loader_user(user_id):
    return Users.query.get(user_id)


# Initialize app with extension
db.init_app(app)
# Create database within app context
 
with app.app_context():
    db.create_all()


@login_manager.user_loader
def loader_user(user_id):
    return Users.query.get(user_id)


currentPlayer = 'X'

@app.route('/')
def index():
    return render_template('index.html')



@app.route('/discrete')
def discrete():
    return render_template('discrete.html')

@app.route('/gcd', methods=['GET'])
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

@app.route('/updateGames', methods=['POST'])
def updateGames():
    if current_user.is_authenticated:
        user = Users.query.filter_by(username=current_user.username).first()
        if user:
            user.gamesPlayed += 1
            db.session.commit()
            return jsonify({'message': 'Games played updated successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify({'error': 'User not logged in'}), 401
 


@app.route('/ticTacToe', methods=['GET'])
def ticTacToe():
    if current_user.is_authenticated:
        playedGames = Users.query.filter_by(gamesPlayed=current_user.gamesPlayed).first()
        return render_template('ticTacToe.html', playedGames=playedGames)
    return render_template('ticTacToe.html')


@app.route('/updateTicker', methods=['GET'])
def update():
    if current_user.is_authenticated:
        playedGames = Users.query.filter_by(gamesPlayed=current_user.gamesPlayed).first()
        return str(playedGames.gamesPlayed)
    return "null"

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/app4')
def app4():
    return render_template('app4.html')


def printResp(obj):
    text = json.dumps(obj, sort_keys=True, indent=4)
    print(text)

last_stock_symbol = None


@app.route('/getPrice', methods = ['GET'])
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

def usernameValid(username): 
    if(len(username) <= 12 and len(username) >= 3):
        return True
    return False

def hasCapital(data):
    for char in range(len(data)):
        if data[char].isupper():
            return True
    return False

def hasNumber(data):
    for i in range (len(data)):
        if data[i].isdigit():
            return True
    return False

def passwordValid(password):
    if(len(password) >= 6 and hasNumber(password)) and hasCapital(password):
       return True
    return False


@app.route('/getUser', methods=['GET'])
def getUser():
    user_id = session.get('user_id')
    if user_id is not None:
        print("logged in")
        return render_template("login.html", curUser=user_id)
    else:
        print("not logged in")
        return 'User not logged in'

@app.route('/profile')
def profile():
    #current_user is a flask-login default 
    if current_user.is_authenticated:
        username = current_user.username
        return render_template('profile.html', username=username)
    else:
        return render_template('profile.html', username="Guest")

def checkUsername(data):
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, data):
        return False

    else:
        return True

@app.route('/login', methods=['GET', 'POST'])
def login():
    passwordError = "good"
    if request.method == "POST":
        iUsername = request.form.get("username").lower().strip()
        if(checkUsername(iUsername)):
            username = iUsername
            user = Users.query.filter_by(username=username).first()
            if user and check_password_hash(user.password, request.form.get("password")):
                login_user(user)
                return redirect(url_for("index"))
        elif(not checkUsername(iUsername)):
            email = iUsername
            user = Users.query.filter_by(email=email).first()
            if user and check_password_hash(user.password, request.form.get("password")):
                login_user(user)
                return redirect(url_for("index"))
        
        passwordError = "invalid"
        return render_template("login.html", username=request.form.get("username"), password=request.form.get("password"), passwordErr=passwordError)
    return render_template("login.html")

def uniqueEmail(email):
    # Check if the username already exists in the database
    existing_user = Users.query.filter_by(email=email).first()
    return existing_user is None

@app.route('/signup', methods=["POST", "GET"])
def signup_post():
  
    if request.method == "POST": 
       #initial declarations, can remove some after I edit 
        username_Valid = False  
        password_Valid = False
        emailError =    ""
        usernameError = ""
        passwordError = ""
        reqUsername = request.form.get("username")
        reqPassword = request.form.get("password")

        rawPass = reqPassword
        iUsername = reqUsername.lower().strip()

        username_Valid = usernameValid(iUsername)
        password_Valid = passwordValid(reqPassword)

        email = request.form.get("email")

        if (not uniqueEmail(email)):
            emailError = "invalid"
        
        if (usernameValid(iUsername) and passwordValid(rawPass) and uniqueEmail(email)):
            hashed_password = generate_password_hash(rawPass, method='pbkdf2:sha256')
            user = Users(username=iUsername,
            password=hashed_password, email=email)
            
            db.session.add(user)
            db.session.commit()
            return redirect(url_for('login'))
    
        if not username_Valid and not password_Valid:
            usernameError = "invalid"
            passwordError= "invalid"
        elif not username_Valid:
            usernameError = "invalid"
        elif not password_Valid:
            passwordError= "invalid"  
        
        return render_template("signup.html", username = reqUsername, password = reqPassword, 
                 usernameErr=usernameError, email=email, passwordErr=passwordError, emailErr=emailError)
    return render_template("signup.html")



@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for("index"))




def generate_reset_token():
    return secrets.token_urlsafe(32)



@app.route('/forgottenPassword', methods=['GET', 'POST'])
def forgot():
    if request.method == "POST": 
        user1 = Users.query.filter_by(email=request.form.get("email")).first()

        if user1 is not None:
            reset_token = generate_reset_token()
            user1.reset_token = reset_token
            db.session.commit()

            reset_link = f'https://trevorfarias.com/reset?token={reset_token}'

            recipient = user1.email
            body = f"Beep Boop, \n\n Please click this link to reset your password: <a href='{reset_link}'>{reset_link}</a>"
            
            sg_api_key = os.getenv("SEND_GRID_APIKEY")

            message = Mail(
                    from_email='em3893@trevorfarias.com',
                    to_emails=[recipient], 
                    subject="Password Reset", 
                    html_content=body)
            
            try:
                sg = SendGridAPIClient(api_key=sg_api_key)
                response = sg.send(message)
                print(response.status_code)
                print(response.body)
                print(response.headers)
            except Exception as e:
                print(str(e))

            return redirect(url_for('login'))
        return redirect(url_for('index'))
    return render_template('reset_password.html')

@app.route('/game', methods=['GET', 'POST'])
def game():
    return render_template("game.html")

@app.route('/reset', methods=['GET', 'POST'])
def reset_pass():
    passwordError = ""
    if request.method == 'GET':
        token = request.args.get('token')
        session['token'] = token
        return render_template('newPass.html', token=token)
    
    if request.method == 'POST':
        token=session.get('token')
        if not token:
            return render_template('login.html')
            
        new_password = request.form.get('password')
        user1 = Users.query.filter_by(reset_token=token).first()

        if(passwordValid(new_password)):
            user1.password = generate_password_hash(new_password, method='pbkdf2:sha256')
            user1.reset_token = " "
            db.session.commit()

            return redirect(url_for('login'))
   
    passwordError='invalid'
    return render_template('newPass.html', token=token, passwordErr=passwordError)
    
