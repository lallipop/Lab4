const $ = require('jquery');
const Chart = require('chart.js');
const fs = require('fs');
const folderFiles = "./Texts";
const colors = ['#3cba9f', '#8e5ea2', '#3e95cd'];
let nameFiles = [];
let files = $('#custom_options');


function addword(word) {
    this.word = word;
    this.count =1;
}

function getDataset(idFile, data) {
    this.label = nameFiles[idFile].toString();
    this.data = data;
    this.borderColor = colors[idFile];
    this.fill = false;
}

function sort(arr) {
    let temp;
    let work = true;
    while (work) {
        work = false;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] < arr[i + 1]) {
                temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                work = true;
            }
        }
    }
}

function getWords(choose, words) {
    let count = 0;
    fs.readFileSync(folderFiles + '/' + nameFiles[choose]).toString().split(/\r?\n/).forEach(line => {
        let punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
        let spaceRE = /\s+/g;
        let temp = line.toLowerCase().replace(punctRE, '').replace(spaceRE, ' ');
        let length = words.length;
        let existWord;
        temp = temp.split(/\s/);
        for (let i = 0; i < temp.length; i++) {
            existWord = false;
            count++;
            for (let j = 0; j < length; j++) {
                if (temp[i] == words[j].word) {
                    existWord = true;
                    words[j].count++;
                    break;
                }
            }
            if (!existWord) {
                words.push(new addword(temp[i]));
            }
        }
    });
    return count;
}

fs.readdirSync(folderFiles).forEach(file => {
    nameFiles.push(file);
});

let c = $('#charts1');
let ctx = c[0].getContext('2d');
let words;
let rank = new Array();
let result = new Array();
let freq = new Array();
for (let i = 0; i < nameFiles.length; i++) {
    let count = new Array();
    let newOp = "<li data-value ='" + i + "'>" + nameFiles[i] + "</li>";
    files.append(newOp);
    words = new Array();
    console.log(getWords(i, words));
    for (let i = 0; i < words.length; i++) {
        if (freq.indexOf(words[i].count) == -1) {
            freq.push(words[i].count);
        }
    }
    sort(freq);
    for (let i = 0; i < freq.length; i++) {
        count[i] = 0;
        for (let j = 0; j < words.length; j++) {
            if (freq[i] == words[j].count) {
                count[i]++;
            }
        }
    }
    console.log(count);
    sort(count);
    let temp = new getDataset(i, count);
    result.push(temp);
}
freq.reverse();
drawCharts(freq, result, ctx, 1);

$("#current_option").click( () => {
    let customOptionsBlock = $("#custom_options");
    if (customOptionsBlock.is(":hidden")) {
        $("#custom_options").show();
    }
    else {
        $("#custom_options").hide();
    }
});

let choosenValue = "-1"

$("#custom_options li").click(function() {
    console.log(choosenValue);
    choosenValue = $(this).attr("data-value");
    $("select").val(choosenValue).prop("selected", true);
    $("#current_option span").text($(this).text());
    $("#current_option").attr("data-value", choosenValue);
    console.log(choosenValue);
    $("#custom_options").hide();
});


$('#analyse').click( () => {
    let c = $('#charts');
    let ctx = c[0].getContext('2d');
    words = new Array();
    freq = new Array();
    rank = new Array();
    if (choosenValue == '-1') {
        alert("Вы не выбрали файл!");
    } else {
        getWords(choosenValue, words);
        for (let i = 0; i < words.length; i++) {
            if (freq.indexOf(words[i].count) == -1) {
                freq.push(words[i].count);
            }
        }
        sort(freq);
        for (let i = 0; i < freq.length; i++) {
            if (rank.indexOf(i + 1) == -1) {
                rank.push(i + 1);
            }
        }
        let temp = new Array();
        temp.push(new getDataset(choosenValue, freq));
        console.log(temp);
        drawCharts(rank, temp, ctx, 0);
    }
});


function drawCharts(y, data, ctx, id) {
    let myChart = new Array();
    myChart[id] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: y,
            datasets: data
        },
        options: {
            title: {
                display: true,
                text: 'Законы зипфа'
            }
        }
    });
}