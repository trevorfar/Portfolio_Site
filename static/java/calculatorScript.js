    let expression = '';  // This variable holds the current expression

    function appendToExpression(value) {
        if (value === '0' && expression.trim() === ''){
            expression ='0';

        }else{
        expression += value;
        }
        updateDisplay();
    }

    function clearExpression() {
        expression = '';
        updateDisplay();
    }

    function updateDisplay() {
        document.getElementById('display').value = expression;
    }
    

    

    