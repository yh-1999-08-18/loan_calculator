function reSite() {
  // 获取浏览器窗口可视区域宽度
  var innerWidth = window.innerWidth;
  // 获取浏览器窗口可视区域高度
  var innerHeight = window.innerHeight;
  // 假设要设置一个名为 'yDiv' 的 div 元素的宽高
  var myDiv = document.getElementById("wrap");
  myDiv.style.width = innerWidth + "px";
  myDiv.style.height = innerHeight + "px";
}
// reSite();

var variable_data = {
  top: [
    {
      label: "年化利率",
      value: "",
      unit: "%",
    },
    {
      label: "月息",
      divide_value: "",
      pct_value: "",
      divide_unit: "分",
      pct_unit: "厘",
    },
    {
      label: "万元系数",
      value: "",
      unit: "元",
    },
  ],
  bottom: [
    [
      {
        label: "万元系数",
        value: 0,
      },
      {
        label: "月息（厘）",
        value: 0,
      },
    ],
    [
      {
        label: "万元系数",
        value: 0,
      },
      {
        label: "年化利率",
        value: 0,
      },
    ],
    [
      {
        label: "月息（厘）",
        value: 0,
      },
      {
        label: "年化利率",
        value: 0,
      },
    ],
  ],
};
//点击按钮后不变的显示数据
var constant_data = [
  {
    label: "一年费率",
    value: 0,
  },
  {
    label: "二年费率",
    value: 0,
  },
  {
    label: "三年费率",
    value: 0,
  },
  {
    label: "四年费率",
    value: 0,
  },
  {
    label: "五年费率",
    value: 0,
  },
];
//表格数据
var table_data = [];
var active = 0;
var term_data = [6, 12, 18, 24, 30, 36, 48, 60];
var term_active = 5;
var termText = `${term_data[term_active]}`;
var childElements = $("#listContent").children();
$(childElements[term_active]).css("background-color", "#4948AC");
$(childElements[term_active]).css("color", "#ffffff");
term_change();
//计算按钮事件
$("#term").html(termText);

//按钮添加点击事件
var btnArr = $(".btn");
btnArr[active].style.background = "rgba(255, 255, 255, 0.2)";
for (var i = 0; i < btnArr.length; i++) {
  $(btnArr[i]).bind("click", { index: i }, (e) => {
    console.log(e, active);
    for (const el of btnArr) {
      el.style.background = "none";
    }
    active = e.data.index;
    btnArr[active].style.background = "rgba(255, 255, 255, 0.2)";
    $("#result_list").empty();
    $("#btn_groups").prev().remove();
    addEl();
    reset();
  });
}
//列表渲染
result_list_show = () => {
  $("#result_list").empty();
  //动态渲染结果中前两个变化的标签
  for (let j = 0; j < variable_data.bottom[active].length; j++) {
    let data = variable_data.bottom[active];
    $("#result_list").append(`<div class="loan">
      <div class="label">${data[j].label}</div>
      <div class="value">${data[j].value}</div>
      </div>`);
  }
  //动态渲染结果中后边五个不变的标签
  for (let i = 0; i < constant_data.length; i++) {
    $("#result_list").append(`<div class="loan">
      <div class="label">${constant_data[i].label}</div>
      <div class="value">${constant_data[i].value}</div>
      </div>`);
  }
};
//给计算结果父级标签动态添加子元素
function addEl() {
  //动态渲染按钮上边的标签
  let groups_data = variable_data.top[active];
  if (active === 1) {
    $("#btn_groups").before(`
    <div class="annualized">
    <div class="label"  style="width: 50px">${groups_data.label}</div>
    <div style="display:flex;"><input type="number" id="divide" style="width: 80px" placeholder="0"  value="${groups_data.divide_value}"/><div class="unit">${groups_data.divide_unit}</div></div>
    <div style="display:flex;"><input id="pct" type="number"style="width: 80px" placeholder="0" value="${groups_data.pct_value}"/><div class="unit">${groups_data.pct_unit}</div></div>
  </div>
    `);
  } else {
    $("#btn_groups").before(`
    <div class="annualized">
    <div class="label" style="width:30%">${groups_data.label}</div>
    <input class="inp" id="rates" style="width: 70%" type="number" placeholder="0" value="${groups_data.value}"/><div class="unit">${groups_data.unit}</div>
  </div>
    `);
  }
  result_list_show();
}
//绘制表格
function creat_table(table_data) {
  if (table_data) {
    $("#empty").hide();
    let rates = "";
    switch (active) {
      case 0:
        rates = $("#rates").val();
        break;
      default:
        rates = parseFloat(
          variable_data.bottom[active][1].value.replace("%", "")
        );
        break;
    }
    console.log(111, rates, $("#term").html());
    let month_num = get_monthly_payment(10000, rates, $("#term").html());
    console.log(month_num, "月供");
    let interest_sum = get_total_interest(
      month_num,
      $("#sum").text(),
      $("#term").html()
    );
    $("#sum_num").text(`${$("#sum").text()}元`);
    $("#interest_sum").text(`${interest_sum}元`);
    $("#term_num").text(`${$("#term").html()}月`);
    $("#month_num").html(month_num);

    for (let i = 0; i < table_data.length; i++) {
      $("#table").append(`<div class="list_item">
      <div class="item" style="min-width: 16.42px;">${table_data[i].term}</div>
      <div class="item" style="min-width: 44.42px;">${table_data[i].Total}</div>
      <div class="item" style="min-width: 44.42px;">${table_data[i].month_principal}</div>
      <div class="item" style="min-width: 36.22px;">${table_data[i].interest}</div>
      <div class="item" style="min-width: 52.64px;">${table_data[i].remainder}</div>
    </div>`);
    }
  } else if (!table_data) {
    $("#table").append(`<div id="empty" class="img_content">
    <img class="empty" src="./assets/empty.png"></img>
    <div class="text">暂无相关内容</div>
  </div>`);
  }
}
function modalShow() {
  // console.log($("#modal").is(":visible"));
  $("#modal").show();
}
function modalDide() {
  // console.log($("#modal").is(":visible"));
  $("#modal").hide();
}
//渲染期数选项
function creat_select() {
  // $("#term").empty();
  //选择框数据渲染
  // for (let k = 0; k < term_data.length; k++) {
  //   $("#term").append(
  //     `<option value="${term_data[k]}">${term_data[k]}</option>`
  //   );
  //   $("#term").val(36);
  // }
}

addEl();
creat_table();
//单选事件
$("input[name='killOrder']").change(function () {
  if (this.value === "0") {
    variable_data.top[0].label = "年化利率";
    $("#btn_groups").prev().remove();
    addEl();
  } else {
    variable_data.top[0].label = "费率";
    $("#btn_groups").prev().remove();
    addEl();
  }
});
//计算按钮事件
$("#compute").on("click", () => {
  // 期数
  let term = $("#term").html();
  // 费率
  let rates = $("#rates").val();
  if (!term) return;
  switch (active) {
    case 0:
      // 万元
      variable_data.bottom[active][0].value = calculateWanYuanCoefficient(
        10000,
        term,
        rates
      );
      // 月息
      let ratesData = get_rates(
        variable_data.bottom[active][0].value,
        10000,
        term
      );
      variable_data.bottom[active][1].value = get_monthly_interest(
        ratesData,
        term
      ).result;
      // 1——5年的费率
      // 年限
      for (let i = 0; i < constant_data.length; i++) {
        constant_data[i].value = get_annual_rate(
          ratesData,
          parseInt(term / 12),
          i + 1
        );
      }
      break;
    case 1:
      // 万元
      let num = parseFloat(`${$("#divide").val()}${$("#pct").val()}`);

      variable_data.bottom[active][0].value = calculateWanYuanCoefficient_yue(
        10000,
        term,
        num
      );
      //年化利率
      variable_data.bottom[active][1].value = calculateAnnualInterestRate(
        10000,
        term,
        num
      );
      // 1——5年的费率
      for (let i = 0; i < constant_data.length; i++) {
        constant_data[i].value = get_annual_rate(
          get_rates(variable_data.bottom[active][0].value, 10000, term),
          parseInt(term / 12),
          i + 1
        );
      }
      break;
    case 2:
      //费率
      let fl = get_rates($("#rates").val(), 10000, term);
      const monthly_interest = get_monthly_interest(fl, term);
      variable_data.bottom[active][0].value = monthly_interest.result;
      // 年化
      variable_data.bottom[active][1].value = calculateAnnualInterestRate(
        10000,
        term,
        monthly_interest.original
      );
      // 1——5年的费率
      for (let i = 0; i < constant_data.length; i++) {
        constant_data[i].value = get_annual_rate(
          fl,
          parseInt(term / 12),
          i + 1
        );
      }
      break;
  }
  console.log(variable_data, "variable_data");
  result_list_show();
  creatTable_fn();
});

reset = () => {
  variable_data.top[0].value = "";
  variable_data.top[1].divide_value = "";
  variable_data.top[1].pct_value = "";
  variable_data.top[2].value = "";

  variable_data.bottom[0][0].value = 0;
  variable_data.bottom[0][1].value = 0;
  variable_data.bottom[1][0].value = 0;
  variable_data.bottom[1][1].value = 0;
  variable_data.bottom[2][0].value = 0;
  variable_data.bottom[2][1].value = 0;

  for (let index = 0; index < constant_data.length; index++) {
    constant_data[index].value = 0;
  }
  $("input:radio[value='0']").prop("checked", true);
  variable_data.top[0].label = "年化利率";
  $("#total").val(10000);
  $("#rates").val(0);
  $("#term").html(36);
  $("#btn_groups").prev().remove();
  $("#sum_num").text("--");
  $("#interest_sum").text("--");
  $("#term_num").text("--");
  $("#month_num").html("0.00");
  $("#table").empty();
  table_data = [];
  creat_table();
  addEl();
};
$("#reset").on("click", reset);
creat_select();
get_monthly_payment();

$("#creat_table").on("click", function () {
  creatTable_fn();
});

function term_change() {
  var childElements = $("#listContent").children();
  $(childElements).css("background-color", "#ffffff");
  $(childElements).css("color", "#3F447A");
  $(childElements[term_active]).css("background-color", "#4948AC");
  $(childElements[term_active]).css("color", "#ffffff");
}
setIndex = (index) => {
  term_active = index;
  term_change();
};
//期限选择确定
termSure = () => {
  termText = `${term_data[term_active]}`;
  $("#term").html(termText);
  $("#modal").hide();
};

var creatTable_fn = () => {
  $("#table").empty();
  table_data = [];
  // 年化利率
  let annualized_interest_rate_num = 0;
  switch (active) {
    case 0:
      annualized_interest_rate_num = $("#rates").val();
      break;
    default:
      annualized_interest_rate_num = parseFloat(
        variable_data.bottom[active][1].value.replace("%", "")
      );
      break;
  }
  table_data = calculateMonthlyDetailsEqualPrincipalAndInterest(
    Number($("#sum").text()),
    Number($("#term").html()),
    Number(annualized_interest_rate_num)
  );
  creat_table(table_data);
};
