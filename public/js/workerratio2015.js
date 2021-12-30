//配色の作成
var seed = 103;
//35 103
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
var color = [];
for (let i = 0; i < 20; i++) {
	color.push('#'+Math.floor(random()*16777215).toString(16));
}

color = ["#EABEBF", //農業、林業
        "#79CEED", //漁業
        "#D1DCE2", //鉱業、採石業、砂利採取業
        "#DAE6E4", //建設業
        "#ED7179", //製造業
        "#FDD84C", //電気・ガス・熱供給・水道業
        "#C6C09C", //情報通信業
        "#F7DB70", //運輸業、郵便業
        "#8095CE", //卸売業、小売業
        "#D6A3DC", //金融業、保険業
        "#BBD5A6", //不動産業、物品賃貸業
        "#A7D676", //学術研究、専門・技術サービス業
        "#A5DEE5", //宿泊業、飲食サービス業
        "#BFE4FF", //生活関連サービス業、娯楽業
        "#FFF5E9", //教育、学習支援業
        "#F7DB70", //医療、福祉
        "#DA9C25", //複合サービス事業
        "#85CBCD", //サービス業（その他）
        "#60EFDB" //公務
      ];

$.get({url: '/ueaData2015/' + ueaCode, dataType: 'json', type: 'GET'})
.done(function(data) {
    //データの取得
    var datas = [];
    var alphabet = "ABCDEFGHIJKLMNOPQRS".split("");
    for(var i = 0; i < alphabet.length; i ++){
        datas.push(data[0]["worker" + alphabet[i]]);
    }

    var labels = ["農業、林業", "漁業", "鉱業、採石業、砂利採取業", "建設業", "製造業", "電気・ガス・熱供給・水道業", "情報通信業", "運輸業、郵便業", "卸売業、小売業", "金融業、保険業", "不動産業、物品賃貸業", "学術研究、専門・技術サービス業", "宿泊業、飲食サービス業", "生活関連サービス業、娯楽業", "教育、学習支援業", "医療、福祉", "複合サービス事業", "サービス業（その他）", "公務"];

    var ctx = document.getElementById('workerratio');
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: datas,
          backgroundColor: color,
        }]
      },
      options: {
        maintainAspectRatio: false,
        title: {
            fontSize: 20,
            fontColor: '#343a40',
            fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Noto Sans JP', Meiryo, 'メイリオ', sans-serif",
            display: false,
            position: 'top',
            text: '産業別就業者構成'
        },
        legend: {
          labels: {
            fontColor: '#343a40',
            fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Noto Sans JP', Meiryo, 'メイリオ', sans-serif",
            fontSize: 14
          },
        },
        tooltips: {
            callbacks: {
                title: function(tooltipItem, data){
                  return data.labels[tooltipItem[0].index];
                },
                label: function(tooltipItem, data){
                    return Math.round(data.datasets[0].data[tooltipItem.index]).toLocaleString() + "人";
                }
            }
        }
  
      }
    });
})
.fail(function(){
    window.alert("読み込みエラー");
});