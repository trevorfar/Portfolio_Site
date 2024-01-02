    let expression = '';  // This variable holds the current expression

    function appendToExpression(value) {
        expression += value;
        updateDisplay();
    }

    function clearExpression() {
        expression = '';
        updateDisplay();
    }

    function updateDisplay() {
        document.getElementById('display').value = expression;
    }

    