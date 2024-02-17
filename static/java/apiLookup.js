function validateForm(){
    
    var x = document.getElementById('stockQuery').value;
    
    if (!symbolInput || !/^[a-zA-Z0-9]+$/.test(symbolInput)) {
        return false;
    }

    return true;
    
        
    }

