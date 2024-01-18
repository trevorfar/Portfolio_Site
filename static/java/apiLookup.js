function validateForm(){
    
    var x = document.getElementById('stockQuery').value;
    
    if (!symbolInput || !/^[a-zA-Z0-9]+$/.test(symbolInput)) {
        alert('hey');
        return false;
    }

    return true;
    
        
    }