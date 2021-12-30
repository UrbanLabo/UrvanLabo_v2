$.get({url: '/ueaData2015/' + ueaCode, dataType: 'json', type: 'GET'})
.done(function(data) {
  datas = [];
  var no = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
  for(var i=0; i < 11; i++){
    datas.push(data[0]["gup" + no[i]]);
  }
    var ctx = document.getElementById("gupratio");
    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["農林水産業", "鉱業", "製造業", "卸売・小売業", "建設業", "運輸郵便業", "宿泊業・飲食サービス業", "情報通信業", "金融業、保険業", "不動産業", "その他のサービス業等"],
            datasets: [{
                backgroundColor: [
                  "#EABEBF", //農林水産業
                  "#D1DCE2", //鉱業
                  "#ED7179", //製造業
                  "#8095CE", //卸売・小売業
                  "#DAE6E4", //建設業
                  "#F7DB70", //運輸郵便業
                  "#A5DEE5", //宿泊業・飲食サービス業
                  "#C6C09C", //情報通信業
                  "#D6A3DC", //金融業、保険業
                  "#BBD5A6", //不動産業
                  "#85CBCD" //その他のサービス産業
                ],
                data: datas
            }
        ]
    },
    options: {
      maintainAspectRatio: false,
      title: {
        display: false,
        text: '域内総生産比率',
        fontSize: 24,
        fontColor: '#343a40',
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Noto Sans JP', Meiryo, 'メイリオ', sans-serif"
      },
      legend: {
        labels: {
          fontColor: '#343a40',
          fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Noto Sans JP', Meiryo, 'メイリオ', sans-serif",
          fontSize: 14
        }
        
      },
      tooltips: {
          callbacks: {
              title: function(tooltipItem, data){
                return data.labels[tooltipItem[0].index];
              },
              label: function(tooltipItem, data){
                  return Math.round(data.datasets[0].data[tooltipItem.index]).toLocaleString() + "百万円";
              }
          }
      }
    }
    });
})
.fail(function(){
    window.alert("読み込みエラー");
});