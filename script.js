const display = document.getElementById('display');

let firstOperand = '';
let secondOperand = '';
let operator = null;
let shouldResetDisplay = false;

function updateDisplay(value) {
  display.textContent = value;
}

function clearCalculator() {
  firstOperand = '';
  secondOperand = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay('0');
}

function deleteLastDigit() {
  if (shouldResetDisplay) {
    updateDisplay('0');
    shouldResetDisplay = false;
    return;
  }

  const current = display.textContent;
  const nextValue = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay(nextValue);
}

function appendNumber(num) {
  if (shouldResetDisplay) {
    updateDisplay('0');
    shouldResetDisplay = false;
  }

  const currentValue = display.textContent;

  if (currentValue === '0' && num === '0') {
    return;
  }

  const nextValue = currentValue === '0' ? num : currentValue + num;
  updateDisplay(nextValue);
}

function appendDecimal() {
  if (shouldResetDisplay) {
    updateDisplay('0');
    shouldResetDisplay = false;
  }

  const currentValue = display.textContent;

  if (!currentValue.includes('.')) {
    updateDisplay(currentValue + '.');
  }
}

function calculate(a, b, operation) {
  const numA = Number(a);
  const numB = Number(b);

  switch (operation) {
    case '+':
      return numA + numB;
    case '-':
      return numA - numB;
    case '*':
      return numA * numB;
    case '/':
      if (numB === 0) {
        return 'Error';
      }
      return numA / numB;
    default:
      return numB;
  }
}

function handleOperator(nextOperator) {
  const currentValue = display.textContent;

  if (operator && shouldResetDisplay) {
    operator = nextOperator;
    return;
  }

  if (firstOperand === '') {
    firstOperand = currentValue;
  } else if (operator) {
    secondOperand = currentValue;
    const result = calculate(firstOperand, secondOperand, operator);
    updateDisplay(String(result));
    firstOperand = String(result);
  }

  secondOperand = '';
  operator = nextOperator;
  shouldResetDisplay = true;
}

function evaluateExpression() {
  if (!operator || firstOperand === '') {
    return;
  }

  secondOperand = display.textContent;
  const result = calculate(firstOperand, secondOperand, operator);

  updateDisplay(String(result));
  firstOperand = '';
  secondOperand = '';
  operator = null;
  shouldResetDisplay = true;
}

function handlePercent() {
  const currentValue = Number(display.textContent);
  if (!Number.isFinite(currentValue)) {
    updateDisplay('0');
    return;
  }

  updateDisplay(String(currentValue / 100));
}

function handleButtonClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, value } = button.dataset;

  switch (action) {
    case 'number':
      appendNumber(value);
      break;
    case 'decimal':
      appendDecimal();
      break;
    case 'operator':
      handleOperator(value);
      break;
    case 'equals':
      evaluateExpression();
      break;
    case 'clear':
      clearCalculator();
      break;
    case 'delete':
      deleteLastDigit();
      break;
    case 'percent':
      handlePercent();
      break;
    default:
      break;
  }
}

document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
  } else if (key === '.') {
    appendDecimal();
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
  } else if (key === 'Enter' || key === '=') {
    evaluateExpression();
  } else if (key === 'Escape') {
    clearCalculator();
  } else if (key === 'Backspace') {
    deleteLastDigit();
  }
});
