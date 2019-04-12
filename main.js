"use strict";

var URL = "https://api.datamuse.com/words?ml=";
var WORDS = ["affiliate", "marketing", "influencer"];

async function fetchRelated(word, url = URL) {
  const fetchedObjects = await fetch(url + word).then(x => x.json());
  return fetchedObjects.map(obj => obj.word);
}

function _fetchWordsToDB(words = WORDS) {
  words.map(word => fetchRelated(word).then(results => insertWords(results, word)));
}

//make and display report
//usually should be created dynamically and/or  View and DB should be separated
//but this task make them coupled anyway (db table for each endpoint) and web sql dosent support async/await
function _makeReport() {
  document.getElementById("reportTable").hidden = false;
  document.getElementById("chartContainer").hidden = false;
  updateReportFromDB();
}

function updateReportFromDB() {
  db.transaction(function(tx) {
    tx.executeSql("SELECT COUNT(*) AS c FROM INFLUENCER", [], function(tx, r) {
      document.getElementById("influencer").innerHTML = r.rows.item(0).c;
      chart.options.data[0].dataPoints[0].y = r.rows.item(0).c;
      chart.render();
    });
    tx.executeSql("SELECT COUNT(*) AS c FROM MARKETING", [], function(tx, r) {
      document.getElementById("marketing").innerHTML = r.rows.item(0).c;
      chart.options.data[0].dataPoints[1].y = r.rows.item(0).c;
      chart.render();
    });
    tx.executeSql("SELECT COUNT(*) AS c FROM AFFILIATE", [], function(tx, r) {
      document.getElementById("affiliate").innerHTML = r.rows.item(0).c;
      chart.options.data[0].dataPoints[2].y = r.rows.item(0).c;
      chart.render();
    });
  });
}

var chart = new CanvasJS.Chart("chartContainer", {
  animationEnabled: true,

  title: {
    text: "cool chart represent report"
  },
  axisX: {
    interval: 1
  },
  axisY2: {
    interlacedColor: "rgba(1,77,101,.2)",
    gridColor: "rgba(1,77,101,.1)",
    title: "Number of relevant words"
  },
  data: [
    {
      type: "bar",
      name: "tags",
      axisYType: "secondary",
      color: "#014D65",
      dataPoints: [{ y: 3, label: "influencer" }, { y: 2, label: "marketing" }, { y: 5, label: "affiliate" }]
    }
  ]
});
