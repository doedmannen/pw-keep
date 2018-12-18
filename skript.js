
document.getElementsByTagName('input')[0].focus();

document.querySelector('.input-group').addEventListener('keydown', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) {
      generatePassword();
    }
});


function generatePassword() {
  // Get values from input
  let site, password, number, output, inputString, check;
  site = document.getElementsByTagName('input')[0].value.trim().toLowerCase();
  password = document.getElementsByTagName('input')[1].value.trim().toLowerCase();
  number = document.getElementsByTagName('input')[2].value.trim();
  output = document.getElementsByClassName('output-pw')[0];

  document.getElementsByTagName('input')[0].value = "";
  document.getElementsByTagName('input')[1].value = "";
  document.getElementsByTagName('input')[2].value = "";


  // Check if input was valid, if not return 0
  if (!validInput(site, password, number))
    return 0;

  // Parse number
  number = number / 1;

  check = getCheck(site, password);

  inputString = organizeString(site, password);

  inputString = intoNumbers(inputString, number);

  inputString = intoRandom(inputString, check);

  inputString = shortenString(inputString, 20);

  output.innerHTML = inputString;
  document.getElementsByTagName('input')[0].focus();
}

function getCheck(s, p) {
  let total = s+p;
  let output = 0;
  for(let i = 0; i < total.length; i++){
    output += parseInt(total.charCodeAt(i).toString().substr(-1));
  }
  return output;
}


function shortenString(s, size) {
  let jump = parseInt(s.length/size);
  let output = "";
  for(let i = 0; i < size; i++){
    output += s.substr((jump*i),1)
  }
  return output;
}

function intoNumbers(s, n) {
  output = "";
  n = getPrimes(n);
  s = s.split("");
  for(let i = 0; i < s.length; i++){
    s[i] = s[i].charCodeAt()*n;
  }
  return s.join("");
}

function intoRandom(s, c) {
  console.log(c);

  let randomStuff = "8pi2d9IjSs4FNWZzn5HvRkQuYwbymqOJgtelKoPEf1TL3BAcChr0aGVMxUXD76";
  let lengthOfStuff = randomStuff.length;

  while(c > randomStuff.length){
    c = parseInt(c/2);
  }

  randomStuff += randomStuff;

  randomStuff = randomStuff.substr(c, lengthOfStuff);

  console.log(randomStuff);

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


/*
  Checks if the input was valid.
  Site must be filled in (at the moment only checks for length < 0)
  A bad password is needed (5 letters)
  A random number from 0 to 9999
*/
function validInput(site, password, number) {
  let valueForReturn = true;
  let errorlogs = document.getElementsByClassName('error-log');
  for (let errorlog of errorlogs) {
    errorlog.style.display = "none";
  }
  if (site.length === 0) {
    document.getElementsByClassName('error-log')[0].style.display = "block";
    valueForReturn = false;
  }
  if (password.search(/^[a-z]{5,}$/)) {
    document.getElementsByClassName('error-log')[1].style.display = "block";
    valueForReturn = false;
  }
  if (number.search(/^[0-9]{1,4}$/)) {
    document.getElementsByClassName('error-log')[2].style.display = "block";
    valueForReturn = false;
  }

  return valueForReturn;
}



function getPrimes(n = 0) {
  let numOfPrimes = 100001 + n;
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
