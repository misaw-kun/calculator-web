/** Calculator functions */

function add(a, b) {
    return a + b;
}

function subract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, n1, n2) {

    n1 = Number(n1);
    n2 = Number(n2);

    switch (operator) {
        case '+':
            return add(n1, n2);
        case '-':
            return subract(n1, n2);
        case '×':
            return multiply(n1, n2);
        case '÷':
           return n2 === 0 ? null : divide(n1, n2);
        default:
            return null;
    }
}

/** Default values */
let firstOpr = '';
let secondOpr = '';
let currentOperation = null;
let shouldReset = false;

/** Selectors */
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const clearBtn = document.getElementById('clr-btn');
const deleteBtn = document.getElementById('dlt-btn');
const pointBtn = document.getElementById('point-btn');
const equalBtn = document.getElementById('equals-btn');

const lastOpsScreen = document.getElementById('prevOps');
const currentOpsScreen = document.getElementById('currentOps');

/** Event listeners */
numberButtons.forEach(button =>
    button.addEventListener('click', () => appendNumber(button.textContent)));

operatorButtons.forEach(button =>
    button.addEventListener('click', () => setOperation(button.textContent)));

clearBtn.onclick = () => clearScreen();
deleteBtn.onclick = () => deleteEntry();
equalBtn.onclick = () => calculate();

window.onkeydown = (e) => handleKeyboardInput(e);

/** Helper functions */
function appendNumber(number) {
    if(currentOpsScreen.textContent === '0' || shouldReset)
        resetScreen();
    currentOpsScreen.textContent += number;
}

function appendDecimal() {
    if(shouldReset) return;
    if(currentOpsScreen.textContent === '')
        currentOpsScreen.textContent === '0';
    if(currentOpsScreen.textContent.includes('.'))
        return
    currentOpsScreen.textContent += '.';
}

function setOperation(operator) {

    //checking if current operator has been provided or not so that we can provide only one operator per operation
    if(currentOperation !== null) calculate();

    firstOpr = currentOpsScreen.textContent;
    currentOperation = operator;

    //displaying the current sequence as the user performs their calcs
    lastOpsScreen.textContent = `${firstOpr} ${currentOperation}`;
    shouldReset = true; //making it eligible for a reset action if triggered later
}

function resetScreen() {
    currentOpsScreen.textContent = '';
    shouldReset = false;
}

function clearScreen() {
    currentOpsScreen.textContent = '0';
    lastOpsScreen.textContent = '';
    firstOpr = '';
    secondOpr = '';
    currentOperation = null;
}

function deleteEntry() {

    currentOpsScreen.textContent.length === 1 ? currentOpsScreen.textContent = '0' :
        currentOpsScreen.textContent = currentOpsScreen.textContent.toString().slice(0, -1);
}

function calculate() {
    if(currentOperation === null || shouldReset) return //returning from func if there's no current operation or the reset screen flag was truthy
    if(currentOperation === '÷' && currentOpsScreen.textContent === '0') {
        currentOpsScreen.textContent = 'UNDEFINED'
        return
    }
    secondOpr = currentOpsScreen.textContent; //taking the second operand

    currentOpsScreen.textContent = Math.floor(operate(currentOperation, firstOpr, secondOpr) * 1000) / 1000;

    lastOpsScreen.textContent = `${firstOpr} ${currentOperation} ${secondOpr} =`;

    //setting current operation back to default for further calcs
    currentOperation = null;

}

function setKbOpr(kbOpr) {
    if(kbOpr == '+') return '+';
    if(kbOpr == '-') return '-';
    if(kbOpr == '*') return '×';
    if(kbOpr == '/') return '÷';
}

function handleKeyboardInput(e) {
    if(e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if(e.key === '.') appendDecimal();
    if(e.key === 'Enter' || e.key === '=') calculate();
    if(e.key === 'Backspace') deleteEntry();
    if(e.key === 'Escape') clearScreen();

    if(e.key == '+' || e.key == '-' || e.key == '*' || e.key == '/')
        setOperation(setKbOpr(e.key));
}