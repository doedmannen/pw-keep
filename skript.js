/*
TODO:
Testing and improving 

*/


// Bring focus to first input field on pageload
document.getElementsByTagName('input')[0].focus();

// Set timer var
let timer;

// Start timer
function startTimer() {
  timer = setTimeout(() => {
    removeEverything();
  }, 60000);
}

// Stop timer
function stopTimer() {
  clearTimeout(timer);
}

// Listen for keydown inside html
document.querySelector('html').addEventListener('keydown', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) {
      generatePassword(); // Generate password on enter
    } else if(key === 27){
      removeEverything(); // Clear all input/output on escape
    }
});

/*
  Function for removing all input and output from document.
  This function runs if the Escape-key is pressed, if the "Clear everything"-button
  is clicked or when the timer for 1 minute runs out.
*/
function removeEverything() {
  stopTimer();
  document.getElementsByClassName('output-pw')[0].innerHTML = "Your password is generated here";
  // Make sure we clear all the fields
  document.getElementsByTagName('input')[0].value = "";
  document.getElementsByTagName('input')[1].value = "";
  document.getElementsByTagName('input')[2].value = "";

  clearErrors();

  // bring focus back to first input
  document.getElementsByTagName('input')[0].focus();
}

// Main function for generating password
function generatePassword() {
  // Timer needs to be reset if active
  stopTimer();
  // Get values from input
  let site, password, number, output, inputString, check;
  site = document.getElementsByTagName('input')[0].value.trim().toLowerCase();
  password = document.getElementsByTagName('input')[1].value.trim().toLowerCase();
  number = document.getElementsByTagName('input')[2].value.trim();
  output = document.getElementsByClassName('output-pw')[0];

  // Make sure we clear all the fields
  document.getElementsByTagName('input')[0].value = "";
  document.getElementsByTagName('input')[1].value = "";
  document.getElementsByTagName('input')[2].value = "";

  // bring focus back to first input
  document.getElementsByTagName('input')[0].focus();

  // Check if input was valid, if not return 0
  if (!validInput(site, password, number))
    return 0;

  // Parse number
  number = number / 1;

  // Get a number for a bad shuffle of random string later on
  check = getCheck(site, password);

  // First step make one string out of site and password. Mix them.
  inputString = organizeString(site, password);

  // Turn that string into numbers using charCodeAt multiplied with a prime number
  inputString = intoNumbers(inputString, check, number);

  // Turn that number into a string again using a random string
  inputString = intoRandom(inputString);

  // Make the output 20 chars long
  inputString = shortenString(inputString, 20);

  /*
    Set a timer for 1 minute and remove all input and output from screen.

   */
  output.innerHTML = inputString;
  startTimer();
}

// For every letter in site + password get last num in charcode and add
function getCheck(s, p) {
  let total = p.substr(0,1)+s.substr(0,1)+p.substr(-2)+s.substr(0,2);
  let output = "";
  for(let i = 0; i < total.length; i++){
    output += parseInt(total.charCodeAt(i).toString().substr(-1));
  }
  return output.substr(0,6)/1;
}


// Output needs to be a certain size
function shortenString(s, size) {
  let jump = parseInt(s.length/size);
  let output = "";
  for(let i = 0; i < size; i++){
    output += s.substr((jump*i),1)
  }
  return output;
}

// Turning string into numbers
function intoNumbers(s, c, n) {
  output = "";
  n = getPrimes(c, n);
  s = s.split("");
  for(let i = 0; i < s.length; i++){
    s[i] = s[i].charCodeAt()*n;
  }
  return s.join("");
}


function shuffleString(input, shuffle) {
  input = input.split("");
  for(let i = 0; i < 10; i++){
    shuffle += shuffle;
  }

  for(let i = 0; i < shuffle.length; i++){
    let tmpString;
    let num = (shuffle[i]/1);
    if(num % 2 === 0){
      tmpString = input.pop();
    } else {
      tmpString = input.shift();
    }
    input.splice(num, 0, tmpString);
  }
  input = input.join("");
  return input;
}

// Take numbers into random chars
function intoRandom(s, c) {

  let randomStuff = "qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM_!?=+-#¤%@[]{}";

  randomStuff = shuffleString(randomStuff, s.substr(0,12));

  let output = "";
  for (let i = 0; i < s.length; i++) {

    if (s[i + 1] !== undefined && ((s[i] + s[i + 1]) / 1) < randomStuff.length) {
      output += randomStuff[((s[i] + s[i + 1]) / 1)];
      i++;
    }
    output += randomStuff[((s[i]) / 1)];
  }
  return output;
}


function organizeString(site, password) {
  let large, small;
  if (password.length > site.length) {
    large = password;
    small = site;
  } else {
    large = site;
    small = password;
  }

  do {
    small += small;
  } while (small.length < large.length);

  let output = "";
  for (let i = 0; i < large.length; i++) {
    if (i % 2 === 0) {
      output += `${large[i]}${small[i].toUpperCase()}`;
    } else {
      output += `${large[i].toUpperCase()}${small[i]}`;
    }
  }
  return output;
}

function clearErrors() {
  let errorlogs = document.getElementsByClassName('error-log');
  for (let errorlog of errorlogs) {
    errorlog.style.display = "none";
  }
}

/*
  Checks if the input was valid.
  Site must be filled in (at the moment only checks for length < 0)
  A bad password is needed (5 letters)
  A random number from 0 to 9999
*/
function validInput(site, password, number) {
  let valueForReturn = true;
  clearErrors();
  if (site.length === 0) {
    document.getElementsByClassName('error-log')[0].style.display = "block";
    valueForReturn = false;
  }
  if (password.search(/^.{5,}$/)) {
    document.getElementsByClassName('error-log')[1].style.display = "block";
    valueForReturn = false;
  }
  if (number.search(/^[0-9]{1,4}$/)) {
    document.getElementsByClassName('error-log')[2].style.display = "block";
    valueForReturn = false;
  }

  return valueForReturn;
}



function getPrimes(start, n) {
  let numOfPrimes = start + n;
  let primes = [];
  primes.push(2);
  for (let num = 3, count = 1; count < numOfPrimes; num += 2) {
    if (num > 10 && (num % 3 === 0 || num % 10 === 5))
      continue;

    for (let j = 0; j <= count + 1; j++) {
      if (primes[j] > Math.sqrt(num)) {
        primes.push(num);
        count++;
        break;
      }
      if (num % primes[j] === 0)
        break;
    }
  }
  return primes.pop();
}
