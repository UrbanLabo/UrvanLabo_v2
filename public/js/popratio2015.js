$.get({url: '/ueaData2015/' + ueaCode, dataType: 'json', type: 'GET'})
.done(function(data) {
    //データの取得
    datas = [data[0]["popDidC1"], data[0]["popOutDidC1"], data[0]["popDidC2"], data[0]["popOutDidC2"], data[0]["popS1"], data[0]["popS2"], data[0]["popS3"], data[0]["popS4"]];

    var ctx = document.getElementById('popratio');
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['中心都市[人口集中地区]', '中心都市[非人口集中地区]', '副中心（郊外中心）市町村[人口集中地区]', '副中心（郊外中心）市町村[非人口集中地区]', '1次郊外市町村', '2次郊外市町村', '3次郊外市町村', '4次郊外市町村'],
        datasets: [{
          data: datas,
          backgroundColor: [
            '#ED7179',
            '#CD69A7',
            '#F583B4',
            '#FFA3A6',
            '#8095CE',
            '#90C4E9',
            '#B1BEEA',
            '#C58ADE'
          ],
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
            text: '地域分類別人口構成'
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