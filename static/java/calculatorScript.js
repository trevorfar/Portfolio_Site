    let expression = '';  // This variable holds the current expression

    function appendToExpression(value) {
        if (value === '0' && expression.trim() === ''){
            expression ='0';

        }else{
        expression += value;
        }
        updateDisplay();
    }

    function remFromExpression(value){
        expression = expression.slice(0, -1);  // Remove the last character
        updateDisplay();
    }



    function clearExpression() {
        expression = '';
        updateDisplay();
    }

    function updateDisplay() {
        document.getElementById('display').value = expression;
    }
    
    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('keydown', function (event) {
            var keyPressed = event.key;
    
            if (/[0-9+\-*/.%]/.test(keyPressed)) {
                appendToExpression(keyPressed);
            } else if (keyPressed === 'Enter') {
                event.preventDefault(); 
                document.getElementById('CalculatorForm').submit();
            } else if (keyPressed === 'Delete') {
                event.preventDefault(); 
                clearExpression();
            }
        });
    });
    

    