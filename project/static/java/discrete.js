document.getElementById("clearButton").addEventListener("click", function() {
    document.getElementById("display").value = "";  // Clear the result display
    document.getElementsByName("input1")[0].value = "";  // Clear input1
    document.getElementsByName("input2")[0].value = "";  // Clear input2
});