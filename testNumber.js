
const addDigits = (sum, n) => {
    while (n != 0) {
        sum = sum + n % 10;
        n = parseInt(n / 10);
    }
    while (sum >= 10) {
        sum = addDigits(0, sum);
    }
    return sum;
}

const addZeros = (num) => {
    num = num + "";
    while (num.length < 4) {
        num = "0" + num;
    }
    return num;
}
const addNumToJson = (output, key, num, sum) => {
    num = addZeros(num);
    if (output[key] && output[key].length > 0) {
        output[key].push(num)
    } else {
        output[key] = [num];
    }
    return output;
}

const checkIfNumRising = (num) => {
    let digits = ('' + num).split('');
    for (let i = 0; i < digits.length - 1; i++) {
      if (parseInt(digits[i]) > parseInt(digits[i + 1]))
        return false;
      }
    return true;
}

const getUniqueNumber = () => {
    let output = {};
    let sum = 0
    for (let i = 2152; i <= 10000; i++) {
        if (checkIfNumRising(i)) {
            sum = addDigits(0, i);
            if (sum === 2) {
                output = addNumToJson(output, 2, i, sum);
            } else if (sum === 3) {
                output = addNumToJson(output, 3, i, sum);
            } else if (sum === 7) {
                output = addNumToJson(output, 7, i, sum);
            } else if (sum === 9) {
                output = addNumToJson(output, 9, i, sum);
            }
        }
    }
    return output;
};

console.log(JSON.stringify(getUniqueNumber()));

