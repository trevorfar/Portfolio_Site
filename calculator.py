
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
