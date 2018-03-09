/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var city = document.getElementById('aqi-city-input').value;
    // 中英混字符/^[a-zA-Z\u4e00-\u9fa5]+$/

    if (!city.match(/^[A-Za-z]+$/) && !city.match(/^[\u4e00-\u9fa5]+$/)) {
        alert("城市名称只接受中文或英文字符!");
        return false;
    }
    var value = document.getElementById('aqi-value-input').value;
    if (!value.match(/^-?\d+$/)) {
        alert("空气质量只接受整数!");
        return false;
    }
    aqiData[city] = value;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var result = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
    for (var city in aqiData) {
        result += "<tr><td>" + city + "</td><td>" + aqiData[city] + "</td><td><button>删除</button></td></tr>";
    }
    document.getElementById('aqi-table').innerHTML = result;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    var confirm = addAqiData();
    if (confirm != false) {
        renderAqiList();
    }
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
    //通过当前元素父节点的父节点的第一个子节点的文本内容确定当前数组的属性并删除
    //这里不能用e，要用this来指代对象
    var cityName = this.target.parentNode.parentNode.childNodes[0].innerHTML;
    delete aqiData[cityName];
    renderAqiList();
}
var event = event || window.event;

(function init() {
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    document.getElementById('add-btn').addEventListener("click", addBtnHandle, false)

    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    //为表格绑定事件监听，if筛选出button按钮，并为button按钮添加删除函数
    document.getElementById("aqi-table").addEventListener("click", function (e) {
        //下两行适配FF和IE，将event作为函数的参数传入例如e，然后为参数e添加适配方法
        e = e || window.event;
        target = e.target || e.srcElement;
        if (e.target.nodeName.toLowerCase() == "button") {
            delBtnHandle();
        }
    }, false)
})()

