function Questionaire() {
  this.init();
  // this.requestInfo = decodeURI(location.search.substring(9));//主键的名称
  this.strPage = "";
}
Questionaire.prototype = {
  init: function () {
    console.log("init Questionaire & IDB", this);
    /**
     * IndexedDB储存
     */
    var request;
    request = indexedDB.open("Questionaire", 1); //打开(创建)数据库

    request.onerror = function (event) {
      alert("创建/打开数据库失败，失败MSG：" + event.target.error.message);
    };

    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      var objStore = db.createObjectStore("myQuestionaire", {
        keyPath: "subject"
      });

      objStore.createIndex("count", "count", {
        unique: false
      });
      objStore.createIndex("date", "date", {
        unique: false
      });
      objStore.createIndex("state", "state", {
        unique: false
      });
      objStore.createIndex("allData", "allData", {
        unique: false
      });
      objStore.createIndex("time", "time", { //是否唯一，true的话这个第二次储存的时候就无效
        unique: true
      });
    };
    var strURL = window.location.href,
      arrURL = strURL.split("/"),
      lastStr = arrURL[arrURL.length - 1];

    this.strPage = lastStr.slice(0, lastStr.indexOf("."));
    switch (this.strPage) {
      case "edit":
        this.edit.init();
        break;
      case "index":
        this.index.init();
        break;
      case "write":
        this.write.init();
        break;
      case "detail":
        this.detail.init();
        break;
      default:
        break;
    }
  },
  detail: {
    init: function () {
      console.log("init detail page");
      this.requestInfo = decodeURI(location.search.substring(9));
      this.DBtoOBJ();
    },
    DBtoOBJ: function () { //把已有的数据渲染到HTML
      var request;
      request = indexedDB.open("Questionaire", 1); //打开(创建)数据库

      request.onerror = function (event) {
        alert("创建/打开数据库失败，失败MSG：" + event.target.error.message);
      };
      var that = this; //底下this的作用域改变，提前复制一份
      request.onsuccess = function (event) {
        db = event.target.result;

        var transaction = db.transaction("myQuestionaire", "readwrite");
        var store = transaction.objectStore("myQuestionaire");
        var obj = store.get(that.requestInfo);
        obj.onsuccess = function () {
          that.OBJtoOBJ(obj.result);
        };
      };
    },
    OBJtoOBJ: function (obj) { //接收IDB读取出来的OBJ
      this.currentObj = obj;

      //下面两个data用来储存数据，直接放到echarts里面渲染
      var dataArr = [],
        subjectData = [];

      var html = "", i;
      for (i = 0; i < obj.allData.length; i++) {
        var tempArrTemp = [];
        switch (obj.allData[i].type) {
          case "radio":
            html += "<div class='detail-box'><div><span>" + obj.allData[i].name + "</span><span>单选题</span><div id='" + obj.allData[i].name + "' class='echart''>";
            break;
          case "checkbox":
            html += "<div class='detail-box'><div><span>" + obj.allData[i].name + "</span><span>多选题</span><div id='" + obj.allData[i].name + "' class='echart''>";
            break;
          case "textarea":
            html += "<div class='detail-box'><div><span>" + obj.allData[i].name + "</span><span>文本题</span><div id='" + obj.allData[i].name + "' class='echart''>";
            break;
          default:
            break;
        }
        var newArr = [];
        for (var j = 0; j < obj.allData[i].data.length; j++) {
          newArr.push(this.calculatePersent(obj.allData[i].data[j].count, obj.count));
          tempArrTemp.push(obj.allData[i].data[j].content);
        }
        subjectData.push(tempArrTemp);
        dataArr.push(newArr);

        html += "</div></div></div>";
      }
      document.getElementById("page_subject").innerHTML = this.requestInfo;
      document.getElementById("content_area").innerHTML = html;

      var tempStr, x;

      for (x = 0; x < obj.allData.length; x++) {
        // 基于准备好的dom，初始化echarts实例
        // Echart设置区。
        tempStr = "Q" + (x + 1);
        var nowSub = obj.allData[x].subject;
        var questTotalSubmit = "该问卷总提交数" + obj.count + "次";

        var myChart = echarts.init(document.getElementById(tempStr));

        option = {
          baseOption: {
            title: {
              text: nowSub,
              subtext: questTotalSubmit,
              left: '1%'
            },
            color: ['#f97a4b'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
              position: ['50%', '50%']
            },
            grid: {
              containLabel: true,
              right: "10%"
            },
            xAxis: [
              {
                type: 'category',
                data: subjectData[x],
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                axisLabel: {
                  show: true,
                  interval: 'auto',
                  formatter: '{value} %'
                }
              }
            ],
            series: [
              {
                name: '直接访问',
                type: 'bar',
                barWidth: '30%',
                data: dataArr[x]
              }
            ]
          },
          media: [
            {
              option: {
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                },
                series: [
                  {
                    // barWidth: '60%'
                  }
                ]
              }
            }
          ]
        };
        switch (obj.allData[x].type) {
          case "radio":
          case "checkbox":
            option.baseOption.series[0].name = "被选择的比例";
            break;
          case "textarea":
            option.baseOption.series[0].name = "该文本题的有效率";
            break;
        }
        myChart.setOption(option);
      }
    },
    calculatePersent: function (currentNum, totalNum) {
      var result = (Number(currentNum) / Number(totalNum) * 100).toFixed(2);
      if (isNaN(result)) {
        result = '数据不够,请先填写数据！';
        return result;
      }
      return result;
    },
  },
  write: {
    init: function () {
      console.log("init write page");
      this.requestInfo = decodeURI(location.search.substring(9));
      this.DBtoOBJ();
      this.currentObj = {};
    },
    DBtoOBJ: function () { //把已有的数据渲染到HTML
      var request;
      request = indexedDB.open("Questionaire", 1); //打开(创建)数据库

      request.onerror = function (event) {
        alert("创建/打开数据库失败，失败MSG：" + event.target.error.message);
      };
      var that = this; //底下this的作用域改变，提前复制一份
      request.onsuccess = function (event) {
        db = event.target.result;

        var transaction = db.transaction("myQuestionaire", "readwrite");
        var store = transaction.objectStore("myQuestionaire");
        var obj = store.get(that.requestInfo);
        obj.onsuccess = function () {
          that.OBJtoHTML(obj.result);
        };
      };
    },
    OBJtoHTML: function (obj) { //接收IDB读取出来的OBJ
      this.currentObj = obj;//先储存到this里面，其它函数就不用这么麻烦了
      var html = "";
      for (var i = 0; i < obj.allData.length; i++) {

        switch (obj.allData[i].type) {
          case "radio":
            html += "<div class='questions'><div class='radio'><span>" + obj.allData[i].name + "</span><span>单选题</span><span class='subject'>" + obj.allData[i].subject + "</span></div><div>";
            break;
          case "checkbox":
            html += "<div class='questions'><div class='checkbox'><span>" + obj.allData[i].name + "</span><span>多选题</span><span class='subject'>" + obj.allData[i].subject + "</span></div><div>";
            break;
          case "textarea":
            html += "<div class='questions'><div class='textarea'><span>" + obj.allData[i].name + "</span><span>文本题</span><span class='subject'>" + obj.allData[i].subject + "</span></div><div>";
            break;
          default:
            break;
        }

        for (var j = 0; j < obj.allData[i].data.length; j++) {
          switch (obj.allData[i].type) {
            case "radio":
              html += "<div class='radios'><input type='radio' name='" + obj.allData[i].data[j].randomNumberId + "' ><span>" + obj.allData[i].data[j].content + "</span></div>";
              break;
            case "checkbox":
              html += "<div class='checkboxs'><input type='checkbox' ><span>" + obj.allData[i].data[j].content + "</span></div>";
              break;
            case "textarea":
              if (obj.allData[i].data[j].status == "true") { //checked属性，想把勾选状态改成不勾选状态，貌似只有删除checked属性。把checked设置成什么东西，都会勾上。只有再加一层if了
                html += "<span class='true'>此题必填</span> <div><textarea cols='20' rows='10' placeholder='请填写你的回答' class='textareas' ></textarea></div>";
              } else {
                html += "<span class='false'>此题选填</span> <div><textarea cols='20' rows='10' placeholder='请填写你的回答' class='textareas' ></textarea></div>";
              }
              break;
            default:
              break;
          }
        }
        html += "</div></div>";
      }
      document.getElementById("page_subject").innerHTML = this.requestInfo;
      document.getElementById("content_area").innerHTML = html;
    },
    putDataToDB: function () {
      var request, database;
      request = indexedDB.open("Questionaire", 1); //打开(创建)数据库

      request.onerror = function (event) {
        alert("创建/打开数据库失败，失败MSG：" + event.target.error.message);
        return;
      };

      var that = this; //下面作用域this改变
      request.onsuccess = function (event) {
        database = event.target.result;

        var transaction = database.transaction("myQuestionaire", "readwrite");
        store = transaction.objectStore("myQuestionaire");

        store.put({ //不用通过Get先查询再操作，因为subject索引是唯一，直接Put会自动更新相应的OBJ
          "count": that.currentObj.count,
          "subject": that.currentObj.subject,
          "date": that.currentObj.date,
          "state": that.currentObj.state,
          "allData": that.currentObj.allData,
          "time": that.currentObj.time
        });
        alert("问卷提交成功，1秒后自动跳转到主页。");
        setTimeout(function () {
          window.location.href = "index.html";
        }, 1500);
      };
    },
    saveObj: function () {
      var collecion = document.getElementsByClassName("questions"); //把每一个Question的数据内容以OBJ的形式储存到DATA数组中
      var type = "", j;
      for (var i = 0; i < collecion.length; i++) {

        type = collecion[i].firstElementChild.className; //问题类型
        switch (type) {
          case "radio":
            var radios = collecion[i].getElementsByClassName("radios");
            for (j = 0; j < radios.length; j++) {
              if (radios[j].firstElementChild.checked) {
                this.currentObj.allData[i].data[j].count++;
              }
            }
            break;
          case "checkbox":
            var checkboxs = collecion[i].getElementsByClassName("checkboxs");
            for (j = 0; j < checkboxs.length; j++) {
              if (checkboxs[j].firstElementChild.checked) {
                this.currentObj.allData[i].data[j].count++;
              }
            }
            break;
          case "textarea": //这里没有再套for循环了，因为设计的时候就只存一条数据进来，改设计的时候要过来加for循环
            var textarea = collecion[i].getElementsByTagName("textarea")[0];
            if (textarea.parentNode.previousElementSibling.className === "true" && textarea.value === "") { //必填时，无内容就无效
              break;
            }
            this.currentObj.allData[i].data[0].content = textarea.value;
            this.currentObj.allData[i].data[0].count++;
            break;
          default:
            break;
        }
      }
      this.currentObj.count++;
      this.putDataToDB();
    },
  },
  index: {
    init: function () {
      this.renderTbody();
      this.needDeleteArr = [];
      console.log("init index page");
    },
    toggleMask: function (e) {
      var oEvent = e || window.event,
        oTarget = oEvent.target || oEvent.srcElement,
        curStatus = document.getElementById("maskControl").className;
      if (curStatus === "show") {
        document.getElementById("maskControl").className = "hide";
      } else {
        document.getElementById("maskControl").className = "show";
      }

      if (oTarget.id == "delete_some") { //判断是否是删除多个的按钮
        var chekckedLines = document.getElementById("checkBox").getElementsByClassName("checked");
        for (var i = 0; i < chekckedLines.length; i++) {
          this.needDeleteArr.push(chekckedLines[i].lastElementChild.id);
        }
        return this.needDeleteArr;
      }
      this.needDeleteArr.push(oTarget.parentNode.id);
      return this.needDeleteArr;
    },
    toggleCheck: function (e) {
      var oEvent = e || window.event,
        oTarget = oEvent.target || oEvent.srcElement;

      if (oTarget.checked) {
        oTarget.parentNode.parentNode.className = "checked";
      } else {
        if (document.getElementById("checkAll").checked) {
          document.getElementById("checkAll").checked = "";
        }
        oTarget.parentNode.parentNode.className = "";
      }
    },
    checkAll: function (e) {
      var oEvent = e || window.event,
        oTarget = oEvent.target || oEvent.srcElement;

      var inputs = document.getElementsByName("myQN"), i;
      if (oTarget.checked) {
        for (i = 0; i < inputs.length; i++) {
          inputs[i].checked = "checked";
          inputs[i].parentNode.parentNode.className = "checked";
        }
      } else {
        for (i = 0; i < inputs.length; i++) {
          inputs[i].checked = "";
          inputs[i].parentNode.parentNode.className = "";
        }
      }
    },
    renderTbody: function () {
      //IndexedDB操作
      var request, htmlCont = "", hasContent = 0;
      request = indexedDB.open("Questionaire", 1);

      var that = this; //等会要变作用域
      request.onsuccess = function () {
        var db = this.result;

        var transaction = db.transaction("myQuestionaire", "readwrite");
        var store = transaction.objectStore("myQuestionaire");
        var req = store.openCursor();

        var stateText = "",
          stateClass = "",
          inputStyle = "";
        req.onsuccess = function (event) {
          var cursor = event.target.result;
          if (cursor) {
            switch (cursor.value.state) { //判断状态
              case "-1":
                stateText = "未发布";
                stateClass = "unpub";
                inputStyle = "<a href='edit.html?subject=" + encodeURI(cursor.value.subject) + "'><input type='button' value='编辑问卷'></a><input type='button' value='删除问卷' onclick='myQuestionaire.index.toggleMask(event)'>";
                break;
              case "0":
                stateText = "发布中";
                stateClass = "pubing";
                inputStyle = "<a href='write.html?subject=" + encodeURI(cursor.value.subject) + "'><input type='button' value='填写数据'></a><a href='detail.html?subject=" + encodeURI(cursor.value.subject) + "'><input type='button' value='查看数据'></a>";
                break;
              case "1":
                stateText = "已结束";
                stateClass = "pubed";
                inputStyle = "<a href='detail.html?subject=" + encodeURI(cursor.value.subject) + "'><input type='button' value='查看数据'></a><input type='button' value='删除问卷' onclick='myQuestionaire.index.toggleMask(event)'>";
                break;
              default:
                break;
            }

            //判断问卷是否过期，过期就更新state
            //先获取要更改的值并且得到回执，回执的onsuccess里面把event.target.result用Put更新
            if (that.getTimeCompare(cursor.value.date)) {
              var value = cursor.value.subject;
              var tempRequest = store.get(value);
              tempRequest.onsuccess = function (event) {
                var myTarget = event.target.result;
                myTarget.state = "1";
                store.put(myTarget);
              };
            }

            //渲染HTML内容
            htmlCont += "<tr><td><input type='checkbox' name='myQN' onchange='myQuestionaire.index.toggleCheck(event)' ></td><td>" + cursor.value.subject + "</td><td>" + cursor.value.date + "</td><td class='" + stateClass + "'>" + stateText + "</td><td id=" + cursor.value.subject + ">" + inputStyle + "</td></tr>";

            hasContent++;
            cursor.continue();
          } else {
            if (hasContent === 0) {
              alert("还没有问卷，先去创建吧！将自动跳转至新建页面。");
              window.location.href = "add.html";
            }
            document.getElementById("checkBox").innerHTML = htmlCont;
          }
        };
      };
    },
    getTimeCompare: function (targetTime) { //更新了时间的比较法，这个简洁明了
      var uniTime1 = targetTime.replace(/-/g, "/");

      var date = new Date(),
        nowYear = date.getFullYear(),
        nowMonth = date.getMonth() + 1,
        nowDay = date.getDate(),
        uniTime2 = nowYear + "/" + nowMonth + "/" + nowDay,
        oDate1 = new Date(uniTime1),
        oDate2 = new Date(uniTime2);

      if (oDate1.getTime() >= oDate2.getTime()) {
        return false;
      } else {
        return true;
      }

    },
    deleteQuestionaire: function () {
      var request;
      request = indexedDB.open("Questionaire", 1);

      var that = this; //作用域问题
      request.onsuccess = function () {
        var db = this.result;

        var transaction = db.transaction("myQuestionaire", "readwrite");
        var store = transaction.objectStore("myQuestionaire");
        for (var i = 0; i < that.needDeleteArr.length; i++) {
          var rq = store.delete(that.needDeleteArr[i]);
          rq.onsuccess = function (event) {
            that.renderTbody();
          };
        }
        document.getElementById("maskControl").className = "hide"; //确定完后隐藏mask

        if (document.getElementById("checkAll").checked) { //保证全选删除后，全选框是非选中状态
          document.getElementById("checkAll").checked = "";
        }
      };
    },
  },
  edit: {
    init: function () {
      this.requestInfo = decodeURI(location.search.substring(9));
      if (this.requestInfo !== '') {
        this.DBtoOBJ();
      }
      console.log("init edit page");
    },
    DBtoOBJ: function () { //把已有的数据渲染到HTML
      var request;
      request = indexedDB.open("Questionaire", 1); //打开(创建)数据库

      request.onerror = function (event) {
        alert("创建/打开数据库失败，失败MSG：" + event.target.error.message);
      };
      var that = this; //底下this的作用域改变，提前复制一份
      request.onsuccess = function (event) {
        db = event.target.result;

        var transaction = db.transaction("myQuestionaire", "readwrite");
        var store = transaction.objectStore("myQuestionaire");
        var obj = store.get(that.requestInfo);
        obj.onsuccess = function () {
          that.OBJtoHTML(obj.result);
        };
      };
    },
    OBJtoHTML: function (obj) { //接收IDB读取出来的OBJ
      var html = "";
      for (var i = 0; i < obj.allData.length; i++) {

        switch (obj.allData[i].type) {
          case "radio":
            html += "<div class='questions'><div class='radio'><span>" + obj.allData[i].name + "</span><span>单选题</span><input type='text' class='subject' placeholder='单选标题' value='" + obj.allData[i].subject + "'></div><div>";
            break;
          case "checkbox":
            html += "<div class='questions'><div class='radio'><span>" + obj.allData[i].name + "</span><span>多选题</span><input type='text' class='subject' placeholder='多选标题' value='" + obj.allData[i].subject + "'></div><div>";
            break;
          case "textarea":
            html += "<div class='questions'><div class='textarea'><span>" + obj.allData[i].name + "</span><span>文本题</span><input type='text' class='subject' placeholder='文本标题' value='" + obj.allData[i].subject + "'></div><div>";
            break;
          default:
            break;
        }

        for (var j = 0; j < obj.allData[i].data.length; j++) {
          switch (obj.allData[i].type) {
            case "radio":
              html += "<div class='radios'><input type='radio' name='" + Math.random() + "'  disabled='disabled'><input type='text' placeholder='单选内容' value='" + obj.allData[i].data[j].content + "'><span onclick='myQuestionaire.edit.deleSelf(event)' class='dele-self'>X</span></div>";
              break;
            case "checkbox":
              html += "<div class='checkboxs'><input type='checkbox'  disabled='disabled'><input type='text' placeholder='多选内容' value='" + obj.allData[i].data[j].content + "'><span onclick='myQuestionaire.edit.deleSelf(event)' class='dele-self'>X</span></div>";
              break;
            case "textarea":
              if (obj.allData[i].data[j].status == "true") { //checked属性，想把勾选状态改成不勾选状态，貌似只有删除checked属性。把checked设置成什么东西，都会勾上。只有再加一层if了
                html += "<input type='checkbox' checked='checked'><span>此题是否必填</span> <div><textarea cols='20' rows='10' placeholder='请填写你的回答' class='textareas'  disabled='disabled'></textarea></div>";
              } else {
                html += "<input type='checkbox' ><span>此题是否必填</span> <div><textarea cols='20' rows='10' placeholder='请填写你的回答' class='textareas'  disabled='disabled'></textarea></div>";
              }
              break;
            default:
              break;
          }
        }
        switch (obj.allData[i].type) {
          case "radio":
          case "checkbox":
            html += "</div><div class='add-line'><span onclick='myQuestionaire.edit.newLine(event)'>++++++++++++</span></div><div class='tool-line'><span onclick='myQuestionaire.edit.moveUp(event)'>上移</span><span onclick='myQuestionaire.edit.moveDown(event)'>下移</span><span onclick='myQuestionaire.edit.copy(event)'>复用</span><span onclick='myQuestionaire.edit.deleQuestion(event)'>删除</span></div></div>";
            break;
          case "textarea":
            html += "</div><div class='tool-line'><span onclick='myQuestionaire.edit.moveUp(event)'>上移</span><span onclick='myQuestionaire.edit.moveDown(event)'>下移</span><span onclick='myQuestionaire.edit.copy(event)'>复用</span><span onclick='myQuestionaire.edit.deleQuestion(event)'>删除</span></div></div>";
            break;
          default:
            break;
        }
      }
      document.getElementById("page_subject").value = this.requestInfo;
      document.getElementById("edit-qbox").innerHTML = html;
      document.getElementsByClassName("date")[0].value = obj.date;
    },
    topPart: function (type) {
      var div = document.createElement("div"),
        html;

      switch (type) {
        case "radio":
          div.className = "radio";
          html = "<span></span><span>单选题</span><input type='text' class='subject' placeholder='单选标题'>";
          div.innerHTML = html;
          break;
        case "checkbox":
          div.className = "checkbox";
          html = "<span></span><span>多选题</span><input type='text' class='subject' placeholder='多选标题'>";
          div.innerHTML = html;
          break;
        case "textarea":
          div.className = "textarea";
          html = "<span></span><span>文本题</span><input type='text' class='subject' placeholder='文本标题'>";
          div.innerHTML = html;
          break;
        default:
          break;
      }
      return div;
    },
    middlePart: function (type, randomNumber) {
      var divParent = document.createElement("div"),
        html;

      switch (type) {
        case "radio":
          html = "<div class='radios'><input type='radio' name='radio" + randomNumber + "' disabled><input type='text' placeholder='单选内容' ><span onclick='myQuestionaire.edit.deleSelf(event)' class='dele-self'>X</span></div>";
          divParent.innerHTML = html;
          return divParent;

        case "checkbox":
          html = "<div class='checkboxs'><input type='checkbox' disabled' /><input type='text' placeholder='多选内容'><span onclick='myQuestionaire.edit.deleSelf(event)' class='dele-self'>X</span></div>";
          divParent.innerHTML = html;
          return divParent;

        case "textarea":
          html = "<input type='checkbox'><span>此题是否必填</span><div><textarea cols='20' rows='10' disabled class='textareas'></textarea></div>";
          divParent.innerHTML = html;
          return divParent;
        default:
          break;
      }
    },
    bottomPart: function () { //创建上移、下移、复用、删除那一行
      var div = document.createElement("div"),
        html;
      div.setAttribute("class", "tool-line");

      html = "<span onclick='myQuestionaire.edit.moveUp(event)'>上移</span><span onclick='myQuestionaire.edit.moveDown(event)'>下移</span><span onclick='myQuestionaire.edit.copy(event)'>复用</span><span onclick='myQuestionaire.edit.deleQuestion(event)'>删除</span>";

      div.innerHTML = html;
      return div;
    },
    addPart: function () {
      var div = document.createElement("div"),
        html;
      div.setAttribute("class", "add-line");
      html = "<span onclick='myQuestionaire.edit.newLine(event)'>++++++++++++</span>";
      div.innerHTML = html;

      return div;
    },
    newRadio: function () { //创建新的单选，如果已经有数据则传入
      var randomNumber = Math.random();

      var contentDiv = document.createElement("div");
      contentDiv.className = "questions";

      contentDiv.appendChild(this.topPart("radio"));
      contentDiv.appendChild(this.middlePart("radio", randomNumber));
      contentDiv.appendChild(this.addPart());
      contentDiv.appendChild(this.bottomPart());

      document.getElementById("edit-qbox").appendChild(contentDiv);
      myQuestionaire.edit.queueUp();
    },
    newCheckbox: function () { //创建新的多选
      var contentDiv = document.createElement("div");
      contentDiv.className = "questions";

      contentDiv.appendChild(this.topPart("checkbox"));
      contentDiv.appendChild(this.middlePart("checkbox"));
      contentDiv.appendChild(this.addPart());
      contentDiv.appendChild(this.bottomPart());

      document.getElementById("edit-qbox").appendChild(contentDiv);
      myQuestionaire.edit.queueUp();
    },
    newTextarea: function () { //创建新的文本框
      var contentDiv = document.createElement("div");
      contentDiv.className = "questions";

      contentDiv.appendChild(this.topPart("textarea"));
      contentDiv.appendChild(this.middlePart("textarea"));
      contentDiv.appendChild(this.bottomPart());

      document.getElementById("edit-qbox").appendChild(contentDiv);
      myQuestionaire.edit.queueUp();
    },
    newLine: function (e) { //整合单选和多选的添加行函数
      var oEvent = e || window.event,
        oTarget = oEvent.target || oEvent.srcElement;

      var div = document.createElement("div"),
        html;
      switch (this.getQuestionType(oTarget)) {
        case "radio":
          var namebefore = oTarget.parentNode.previousElementSibling.firstElementChild.firstElementChild.name;
          html = "<input type='radio' name='" + namebefore + "' disabled><input type='text' placeholder='单选内容' ><span onclick='myQuestionaire.edit.deleSelf(event)' class='dele-self'>X</span>";

          div.className = "radios";
          break;
        case "checkbox":
          html = "<input type='checkbox' disabled'><input type='text' placeholder='多选内容'><span onclick='myQuestionaire.edit.deleSelf(event)' class='dele-self'>X</span>";

          div.className = "checkboxs";
          break;
        default:
          break;
      }

      div.innerHTML = html;
      oTarget.parentNode.previousSibling.appendChild(div);
    },
    deleSelf: function (e) {
      var oEvent = e || window.event,
        oTarget = oEvent.target || oEvent.srcElement,
        thisNode = oTarget.parentNode,
        parent = thisNode.parentNode;
      if (parent.getElementsByTagName("div").length != 1) {
        parent.removeChild(thisNode);
      }
    },
    saveObj: function () {
      this.info = {};
      this.data = [];

      var collecion = document.getElementsByClassName("questions"); //把每一个Question的数据内容以OBJ的形式储存到DATA数组中
      for (var i = 0; i < collecion.length; i++) {
        var perObj = {
          name: "",
          type: "",
          subject: "",
          data: []
        };

        perObj.name = collecion[i].firstElementChild.firstElementChild.innerHTML;
        perObj.type = collecion[i].firstElementChild.className;
        perObj.subject = collecion[i].getElementsByClassName("subject")[0].value.trim();

        var detailObj = {}, j;
        switch (perObj.type) {
          case "radio":
            var radios = collecion[i].getElementsByClassName("radios");
            var randomNumberId = Math.random();
            for (j = 0; j < radios.length; j++) {
              detailObj = {
                status: 0,
                content: "",
                count: 0,
                randomNumberId: randomNumberId //方便渲染的时候单选按钮不串流
              };
              detailObj.status = radios[j].firstElementChild.checked ? "checked" : "";
              detailObj.content = radios[j].firstElementChild.nextElementSibling.value;
              perObj.data.push(detailObj);
            }
            this.data.push(perObj);
            break;
          case "checkbox":
            var checkboxs = collecion[i].getElementsByClassName("checkboxs");
            for (j = 0; j < checkboxs.length; j++) {
              detailObj = {
                status: 0,
                content: "",
                count: 0
              };
              detailObj.status = checkboxs[j].firstElementChild.checked ? "checked" : "";
              detailObj.content = checkboxs[j].firstElementChild.nextElementSibling.value;
              perObj.data.push(detailObj);
            }
            this.data.push(perObj);
            break;
          case "textarea":
            var textarea = collecion[i].getElementsByTagName("textarea")[0];
            detailObj = {
              status: 0,
              content: "",
              count: 0
            };
            detailObj.status = textarea.parentNode.previousElementSibling.previousElementSibling.checked ? "true" : "false";
            detailObj.content = textarea.value;
            perObj.data.push(detailObj);
            this.data.push(perObj);
            break;
          default:
            break;
        }
      }

      //储存Question以外的数据
      var headValue = document.getElementById("page_subject").value;
      this.info.subject = this.trim(headValue, "g"); //标题，也是唯一的索引
      this.info.allData = this.data; //Question数据的集合
      this.info.date = document.querySelector("[data-calendar]").value; //截止日期
      document.getElementById("limitedDate").innerHTML = document.querySelector("[data-calendar]").value;
      this.info.count = 0; //记录总的提交次数
      this.info.time = this.getCurrentTime().time;
    },
    trim: function (str, is_global) {
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g, "");
      if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
      }
      return result;
    },
    save: function () {
      this.saveObj();
      if (this.isDateChoose()) {
        this.info.state = "-1"; //未发布：-1，发布中：0，已结束：1
        this.addDataToDB(this.requestInfo);
        alert("保存成功");
        // window.location.href = "index.html";
      }
    },
    confirmPost: function () {
      this.saveObj();
      var curStatus = document.getElementById("maskControl").className;
      if (curStatus === "show") {
        document.getElementById("maskControl").className = "hide";
      } else {
        document.getElementById("maskControl").className = "show";
      }
    },
    post: function () {
      this.saveObj();
      if (this.isDateChoose()) {
        if (this.isRightNum()) {
          document.getElementById("maskControl").className = "hide";
          this.info.state = "0"; //未发布：-1，发布中：0，已结束：1
          this.addDataToDB(this.requestInfo);
          alert("发布成功,1秒后自动跳转到主页。");
          setTimeout(function () { window.location.href = "index.html"; }, 2000); //edge里测试的时候，跳转的太快，导致没能储存成功，所以加个延迟
        }
      }
    },
    isRightNum: function () { //至少一个问题，最多十个问题
      var questionNum = this.info.allData.length;
      if (questionNum < 1 || questionNum > 10) {
        alert("问题数量，至少一个，最多十个才能发布，请重新填写！");
        this.confirmPost();
        return false;
      } else {
        return true;
      }
    },
    isDateChoose: function () { //判断是否选择日期
      if (this.info.date === "") {
        alert("必须选择一个日期！");
        return false;
      } else {
        return true;
      }
    },
    moveUp: function (e) {
      var oEvent = e || window.event,
        oldEle = oEvent.target.parentNode.parentNode,
        targetNode = oldEle.previousElementSibling;
      if (targetNode !== null) {
        var cloneEle = oldEle.cloneNode(true);
        oldEle.parentNode.removeChild(oldEle);
        targetNode.parentNode.insertBefore(cloneEle, targetNode);
      } else {
        alert("移到头了！");
      }
      this.queueUp();
    },
    queueUp: function () {
      var wrapBox = document.getElementById("edit-qbox"),
        j;

      for (var i = 0; i < wrapBox.children.length; i++) {
        j = i + 1;
        wrapBox.children[i].firstElementChild.firstElementChild.innerHTML = "Q" + j;
      }
    },
    moveDown: function (e) {
      var oEvent = e || window.event,
        oTarget = oEvent.target || oEvent.srcElement,
        oldEle = oTarget.parentNode.parentNode,
        targetNode = oldEle.nextElementSibling;

      if (targetNode !== null) {
        var cloneEle = oldEle.cloneNode(true);
        oldEle.parentNode.removeChild(oldEle);
        targetNode.parentNode.insertBefore(cloneEle, targetNode.nextElementSibling);
      } else {
        alert("移到头了！");
      }
      this.queueUp();
    },
    copy: function (e) {
      var oEvent = e || window.event,
        oTarget = oEvent.target || oEvent.srcElement,
        oldEle = oTarget.parentNode.parentNode,
        cloneNode = oldEle.cloneNode(true),
        str = "Q" + this.getQuestionRank(e);

      cloneNode.firstElementChild.firstChild.innerHTML = str;

      //如果是单选，更改单选的name，防止选项串流
      var randomNumber = Math.random();
      if (cloneNode.firstElementChild.className == "radio") {
        var radios = cloneNode.getElementsByClassName("radios");
        for (var i = 0; i < radios.length; i++) {
          cloneNode.getElementsByClassName("radios")[i].firstElementChild.name = "radio" + randomNumber;
        }
      }

      oldEle.parentNode.appendChild(cloneNode);
    },
    deleQuestion: function (e) {
      var oEvent = e || window.event,
        oTarget = oEvent.target || oEvent.srcElement,
        currentDiv = oTarget.parentNode.parentNode;

      currentDiv.parentNode.removeChild(currentDiv);
      this.queueUp();
    },
    getQuestionRank: function () {
      return document.getElementById("edit-qbox").children.length + 1;
    },
    getQuestionType: function (target) { //基于添加新行所在的位置获得当前问题的类型
      return target.parentNode.parentNode.firstElementChild.className;
    },
    getCurrentTime: function () { //获取当前的时间
      var nowDate = new Date(),
        year = nowDate.getFullYear(),
        month = nowDate.getMonth(),
        date = nowDate.getDate(),
        hour = nowDate.getHours(),
        minute = nowDate.getMinutes(),
        second = nowDate.getSeconds(),
        day = nowDate.getDay(),
        time = nowDate.getTime();
      return {
        "year": year,
        "month": month,
        "date": date,
        "hour": hour,
        "minute": minute,
        "second": second,
        "day": day,
        "time": time
      };
    },
    addDataToDB: function () {
      var request;
      request = indexedDB.open("Questionaire", 1); //打开(创建)数据库

      request.onerror = function (event) {
        alert("创建/打开数据库失败，失败MSG：" + event.target.error.message);
      };

      var that = this; //下面作用域this改变
      request.onsuccess = function (event) {
        var database = event.target.result;

        var transaction = database.transaction("myQuestionaire", "readwrite");
        store = transaction.objectStore("myQuestionaire");

        store.put({ //不用通过Get先查询再操作，因为subject索引是唯一，直接Put会自动更新相应的OBJ
          "count": that.info.count,
          "subject": that.info.subject,
          "date": that.info.date,
          "state": that.info.state,
          "allData": that.info.allData,
          "time": that.info.time
        });
      };
    },
    toggleShowBtn: function (e) {
      var oEvent = e || window.event,
        oTarget = oEvent.target || oEvent.srcElement;

      if (oTarget.parentNode.firstElementChild.className == "hide") {
        oTarget.parentNode.firstElementChild.className = "show";
      } else {
        oTarget.parentNode.firstElementChild.className = "hide";
      }
    }
  },
};


if (navigator.appName.indexOf("Microsoft Internet Explorer") != -1 && document.all) {//IE
  if (navigator.userAgent.split(";")[1].toLowerCase().indexOf("msie 10.0") == "-1") {//IE10以下
    alert("IE9及以下版本浏览器不兼容，为了您的体验请更换其他高级浏览器(Chrome/Firefox/Edge/Safiri等等)再尝试！2秒后自动前往我的主页。");
    setTimeout(function () { window.location.href = "http://pkjy.github.io"; }, 2000);
  }
}
var myQuestionaire = new Questionaire(); //必须用myQuestionaire，写的时候是用的myQuestionaire为指针
// window.indexedDB.deleteDatabase("Questionaire");
