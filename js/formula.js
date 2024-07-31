// 判断是否是数字;
isUnmber = (value) => {
  return $.isNumeric(value);
};
// 已知月息算万元
calculateWanYuanCoefficient_yue = (money, month, monthlyInterestRateInLi) => {
  // 将月利率从厘转换为小数
  const monthlyInterestRate = monthlyInterestRateInLi / 1000;
  // 每月偿还本金 = 贷款金额 / 贷款期数
  const monthlyPrincipal = money / month;
  // 万元系数 = （每月偿还本金 + 每月利息） / 贷款金额  × 10000
  const coefficient =
    ((monthlyPrincipal + money * monthlyInterestRate) / money) * 10000;
  return coefficient.toFixed(2);
};
/*
贷款总金额：  loanAmount,
费率：annualInterestRate
贷款期数：  loanPeriod,
万元系数：（贷款总金额 * 费率 + 贷款总金额） / 贷款期数 * 10000 / 贷款总金额
*/
calculateWanYuanCoefficient = (loanAmount, loanPeriod, annualInterestRate) => {
  // 将年化利率转换为月利率
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  // 计算每月还款金额
  const monthlyPayment =
    (loanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, loanPeriod)) /
    (Math.pow(1 + monthlyInterestRate, loanPeriod) - 1);
  return monthlyPayment.toFixed(2);
};
/*
月供：monthly_payment
贷款总金额：total
费率：（（月供 * 12） / 贷款总金额） * 100%
*/
get_rates = (monthly_payment, total, term) => {
  if (!isUnmber(total)) return;
  if (!isUnmber(monthly_payment)) return;
  if (!isUnmber(term)) return;
  let num = get_total_interest(monthly_payment, total, term); //总利息
  let result = num / total;
  return result;
};
/*
费率：rates
贷款期数：term
月息：费率 / 贷款期数
*/
get_monthly_interest = (rates, term) => {
  if (!isUnmber(rates)) return;
  if (!isUnmber(term)) return;
  let result = (rates / term) * 1000;
  let original = "";
  if (result > 10) {
    original = result;
    result = formatNumber(result);
  } else {
    original = result;
    result = result.toFixed(2);
  }
  console.log(result, original.toFixed(2));
  return { original: original.toFixed(2), result: result };
};

function formatNumber(num) {
  // 判断数值是否大于10
  if (num > 10) {
    // 将数值转换为字符串，然后分割整数和小数部分
    const parts = num.toString().split("");
    // 整数部分是数组的第一个元素，小数部分是第二个元素
    const integerPart = parts[0] * 1; // 十位
    parts.splice(0, 1);
    const decimalPart = parts.join("") * 1; // 个位
    // 格式化输出
    return `${integerPart}分${decimalPart.toFixed(2)}厘`;
  } else {
    // 如果数值不大于10，直接返回原数值
    return num.toString();
  }
}

/*
费率：rates
贷款期数：term
年化利率：费率 * 24 / （期数 + 1）
*/
get_annualized_interest_rate = (rates, term) => {
  if (!isUnmber(rates)) return;
  if (!isUnmber(term)) return;
  let result = (rates * 24) / (term + 1);
  result = (result * 100).toFixed(4);
  return result;
};
/*
月供本金：monthly_principal_payment
月供利息：monthly_interest
月供：月供本金 + 月供利息
*/
get_monthly_payment = (loanAmount, annualRate, totalMonths) => {
  if (!isUnmber(loanAmount)) return;
  if (!isUnmber(annualRate)) return;
  if (!isUnmber(totalMonths)) return;
  console.log(loanAmount, annualRate, totalMonths);
  // 将年利率转换为月利率
  var monthlyRate = annualRate / 12 / 100;
  // 等额本息月供计算公式
  var monthlyPayment =
    (10000 * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  console.log(monthlyPayment, "sss");
  // 返回结果，保留两位小数
  return monthlyPayment.toFixed(2);
};
/*
费率：rates
总年限：total_age
想获取费率的年数：num（指的是 num=3，就是获取3年的费率）
一年费率：费率 / 总年限（贷款期数 / 12）
*/
get_annual_rate = (rates, total_age, num) => {
  if (!isUnmber(rates)) return;
  if (!isUnmber(total_age)) return;
  if (!isUnmber(num)) return;
  let result = (rates / total_age) * num * 100;
  result = result.toFixed(2);
  return `${result}%`;
};
/*
贷款总金额：total
月供本金：贷款总金额 / 12
*/
get_monthly_principal_payment = (total) => {
  if (!isUnmber(total)) return;
  let result = total / 12;
  return result;
};
/* 
费率：rates
贷款总金额：total
月供利息：（费率 * 贷款总金额） / 12
*/
get_Monthly_interest = (rates, total) => {
  if (!isUnmber(rates)) return;
  if (!isUnmber(total)) return;
  let result = (rates * total) / 12;
  return result;
};
/*
 贷款总金额：total
 贷款期数：term
 剩余期数：remaining_instalments
 剩余本金：（贷款总金额 / 贷款期数） * 剩余期数
 */
get_remaining_principal = (total, term, remaining_instalments) => {
  if (!isUnmber(term)) return;
  if (!isUnmber(total)) return;
  if (!isUnmber(remaining_instalments)) return;
  let result = (total / term) * remaining_instalments;
  return result;
};
/*
 贷款总金额：total
 费率：rates
 总利息：费率 * 贷款总金额
 */
get_total_interest = (month_num, total, term) => {
  if (!isUnmber(total)) return;
  if (!isUnmber(month_num)) return;
  if (!isUnmber(term)) return;
  console.log(month_num, total, term);
  let result = (month_num * term - total).toFixed(2);
  return result;
};

// 已知贷款金额、期数、月息计算年化利率
calculateAnnualInterestRate = (
  loanAmount,
  loanPeriodInMonths,
  monthlyInterestInLi
) => {
  console.log(loanAmount, loanPeriodInMonths, monthlyInterestInLi);
  // 将月息（厘）转换为月利率（小数形式）
  const monthlyInterestRate = monthlyInterestInLi / 1000;

  // 每月还款本金 = 贷款金额 / 贷款期数
  const monthlyPrincipal = loanAmount / loanPeriodInMonths;

  // 每月还款额 = 每月还款本金 + 贷款金额 * 月利率
  const monthlyPayment = monthlyPrincipal + loanAmount * monthlyInterestRate;

  // 建立一个数组来存储每月的现金流
  const cashFlows = [];
  cashFlows.push(-loanAmount);
  for (let i = 1; i <= loanPeriodInMonths; i++) {
    cashFlows.push(monthlyPayment);
  }

  // 使用自定义函数计算内部收益率（IRR）
  function irr(values, guess = 0.1) {
    const f = (x) => {
      let sum = 0;
      for (let i = 0; i < values.length; i++) {
        sum += values[i] / Math.pow(1 + x, i);
      }
      return sum;
    };

    let x0 = guess;
    let x1 = x0 - f(x0) / ((f(x0 + 0.00001) - f(x0)) / 0.00001);

    while (Math.abs(x1 - x0) > 0.000001) {
      x0 = x1;
      x1 = x0 - f(x0) / ((f(x0 + 0.00001) - f(x0)) / 0.00001);
    }

    return x1;
  }

  // 计算月利率
  const monthlyIRR = irr(cashFlows);

  // 年化利率 = 月利率 * 12
  const annualInterestRate = monthlyIRR * 12;

  return (annualInterestRate * 100).toFixed(2) + "%";
};
//计算贷款表格数据
calculateMonthlyDetailsEqualPrincipalAndInterest = (
  loanAmount,
  loanPeriod,
  annualInterestRate
) => {
  console.log(loanAmount, loanPeriod, annualInterestRate);
  let dataArr = [];
  // 将年化利率转换为月利率
  const monthlyInterestRate = annualInterestRate / 12 / 100;

  // 计算每月还款额
  const monthlyPayment =
    (loanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, loanPeriod)) /
    (Math.pow(1 + monthlyInterestRate, loanPeriod) - 1);

  let remainingPrincipal = loanAmount;

  for (let period = 1; period <= loanPeriod; period++) {
    // 每月利息 = 剩余本金 * 月利率
    const monthlyInterest = remainingPrincipal * monthlyInterestRate;

    // 每月本金 = 每月还款额 - 每月利息
    const monthlyPrincipal = monthlyPayment - monthlyInterest;

    remainingPrincipal -= monthlyPrincipal;
    dataArr.push({
      term: period,
      Total: (monthlyPrincipal + monthlyInterest).toFixed(2),
      month_principal: monthlyPrincipal.toFixed(2),
      interest: monthlyInterest.toFixed(2),
      remainder:
        remainingPrincipal > 0 ? remainingPrincipal.toFixed(2) : "0.00",
    });
  }
  console.log(dataArr, "data");
  return dataArr;
};
