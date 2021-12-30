//uea2000のデータをajaxで取得
var ueadata2000 = [];
$.ajax({
    url: '/ueadata2000',
    type: 'GET',
    dataType: 'json',
    async: false
})
.done(function(data) {
    ueadata2000 = data;
})
.fail(function(error) {
    window.alert('読み込みエラー');
});
console.log(ueadata2000);

//データ結合関数の定義
function joinData(data, feature){
    for(var i=0; i < data.length; i++){
        for(var j=0; j < feature.features.length; j++){
            if(data[i]["ueaCode"] == parseInt(feature.features[j].properties.UEAcode)){
                feature.features[j].properties.subName = data[i]["subName"];
                feature.features[j].properties.ueaFlag = data[i]["ueaFlag"];
                feature.features[j].properties.pop2000 = data[i]["pop2000"];
                feature.features[j].properties.popCenter = data[i]["popCenter"];
                feature.features[j].properties.popDidC1 = data[i]["popDidC1"];
                feature.features[j].properties.ageMedian = data[i]["ageMedian"];
                feature.features[j].properties.annualSalesOfMarchandize = data[i]["annualSalesOfMarchandize"];
                feature.features[j].properties.shipmentOfIndustry = data[i]["shipmentOfIndustry"];
            }
        }
    }
    return feature;
}

uea2000 = joinData(ueadata2000, uea2000);