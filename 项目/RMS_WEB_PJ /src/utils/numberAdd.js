// js 数字相加 精度问题 (0.1 + 0.2 !== 0.3)
export function addNum (n1, n2) {
  var num1 = deleteZero(n1)
  var num2 = deleteZero(n2)
  if (num1 === null || num1 === undefined || num1 === '') return num2
  if (num2 === null || num2 === undefined || num2 === '') return num1
  var numArr1 = num1.toString()
    .split('.')
  var numArr2 = num2.toString()
    .split('.')
  if (!(numArr1[1] && numArr1[1].length)) {
    numArr1[1] = ''
  }
  if (!(numArr2[1] && numArr2[1].length)) {
    numArr2[1] = ''
  }
  var longFloat = numArr1[1].length > numArr2[1].length ? numArr1[1].length : numArr2[1].length
  var longInt = numArr1[0].length > numArr2[0].length ? numArr1[0].length : numArr2[0].length
  var differenceFloat = Math.abs(numArr1[1].length - numArr2[1].length)
  for (let i = 0; i < differenceFloat; i++) {
    if (numArr1[1].length > numArr2[1].length) {
      numArr2.push('0')
    } else {
      numArr1.push('0')
    }
  }
  var total = add(numArr1.join(''), numArr2.join(''))
    .toString()
  if (total.length < (longFloat + longInt)) {
    for (let i = total.length; i < (longFloat + longInt); i++) {
      total = '0' + total
    }
  }
  var totalNumArr = total.split('')
  totalNumArr.splice(total.length - longFloat, 0, '.')
  return deleteZero(totalNumArr.join(''))
}
// 大位数相加
export function add (A, B) {
  let result = []
  const l = -15
  while (A !== '' && B !== '') {
    result.unshift(parseInt(A.substr(l)) + parseInt(B.substr(l)))
    A = A.slice(0, l)
    B = B.slice(0, l)
  }
  A += B
  for (let i = result.length - 1; i > 0; i--) {
    result[i] += ''
    if (result[i].length > -l) {
      result[i - 1] += 1
      result[i] = result[i].substr(1)
    } else {
      while (result[i].length < -l) {
        result[i] = '0' + result[i]
      }
    }
  }
  while (A && (result[0] + '').length > -l) {
    result[0] = (result[0] + '').substr(1)
    result.unshift(parseInt(A.substr(l)) + 1)
    A = A.slice(0, l)
  }
  if (A) {
    while ((result[0] + '').length < -l) {
      result[0] = '0' + result[0]
    }
    result.unshift(A)
  }
  if (result[0]) {
    result = result.join('')
  } else {
    result = '0'
  }
  return result
}
// 删除尾部 0
export function deleteZero (n) {
  if (n && n.toString()) {
    var num = n.toString()
      .split('.')
    var newNum = null
    if (num[1]) {
      let floatArr = num[1].split('')
      for (var i = floatArr.length - 1; i >= 0; i--) {
        if (floatArr[i] === '0') {
          floatArr.splice(i, 1)
        } else {
          break
        }
      }
      if (floatArr.join('')) {
        newNum = num[0] + '.' + floatArr.join('')
      } else {
        newNum = num[0]
      }
    } else {
      newNum = num[0]
    }
    return newNum
  } else {
    return n
  }
}
