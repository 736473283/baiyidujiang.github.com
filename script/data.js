function getHttp({
                     url,
                     params,
                     success,
                     error
                 }) {
    let xhr = new XMLHttpRequest()
    if (params) {
        xhr.open('get', url + '?' + params, true)
    } else {
        xhr.open('get', url, true)
    }
    xhr.send()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 304) {
                success(JSON.parse(xhr.responseText));
            } else {
                error('请求失败');
            }
        }
    }
}

function initData() {
    getHttp({
      // url: 'https://ghproxy.com/https://raw.githubusercontent.com/McMug2020/XXQG_TiKu/main/%E9%A2%98%E5%BA%93_McMug2020.json',
      url: 'https://raw.githubusercontent.com/mondayfirst/XXQG_TiKu/main/%E9%A2%98%E5%BA%93_%E6%8E%92%E5%BA%8F%E7%89%88.json',
      params: '',
        success: (res) => {
            if (localStorage.getItem("data")) {
                console.log('数据从localStorage加载完毕')
            } else {
                localStorage.setItem("data", JSON.stringify(res));
                console.log('数据重新加载完成，')
            }
        }
    });
}

function flushCache() {
    localStorage.removeItem("data")
    document.getElementById("answerList").innerHTML = null;
    document.getElementById("question").value = null;
    document.getElementById("getAnswer").innerHTML = null;
    initData();
}

function getAnswer() {
    document.getElementById("getAnswer").innerHTML = '<span style="color: red">检索中...</span>';
    if (!(document.getElementById("question").value && document.getElementById("question").value !== null && document.getElementById("question").value !== undefined)) {
        document.getElementById("getAnswer").innerHTML = "<span style='color: red'>请输入问题</span>";
        return;
    }
    let question = document.getElementById("question").value;
    console.log(question, "question");
    if (!localStorage.getItem("data")) {
        initData();
    }

    let jsonData = JSON.parse(localStorage.getItem("data"));
    let answerList = [];
    Object.keys(jsonData).forEach((item, x, index) => {
        if (item.indexOf(question) > -1) {
            answerList.push({
                index: x,
                queryKey: question,
                fullQuestion: item,
                answer: jsonData[item]
            })
        }
    })
    console.log(answerList, "answer")
    if (answerList && answerList.length > 0) {
        let stringAns = "";
        answerList.forEach(item => {
            stringAns = stringAns + `<tr><td>${item.answer}</td><td>${item.fullQuestion.replaceAll(item.queryKey, `<span style='color: red'>${item.queryKey}</span>`)}</td><td>${item.index}</td></tr>`;
        })
        console.log(stringAns, 'res');
        document.getElementById("answerList").innerHTML = stringAns;
    }
    document.getElementById("getAnswer").innerHTML = `<span style='color: red'>检索完成，共有${answerList.length}个答案</span>`;
    event.preventDefault();
    return false;
}
