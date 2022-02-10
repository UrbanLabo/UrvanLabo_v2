var ueaCode = JSON.parse($("#ueaCode").val());

/**
 * 通勤率を選択したらオプション項目のdisabled属性を外す
 */
$('#data-select').on('change', function() {
    var dataSelect = $(this).val();
    console.log(dataSelect);
    if(dataSelect == 'commuter-rate') {
        console.log("入ったよ");
        if($('#to-check').is(':disabled')) {
            $('#to-check').prop('disabled', false);
        }
        if($('#from-check').is(':disabled')) {
            $('#from-check').prop('disabled', false);
        }
        if($('#commuter-select').is(':disabled')) {
            $('#commuter-select').prop('disabled', false);
        }
    } else {
        if(!($('#to-check').is(':disabled'))) {
            $('#to-check').prop('disabled', true);
        }
        if(!($('#from-check').is(':disabled'))) {
            $('#from-check').prop('disabled', true);
        }
        if(!($('#commuter-select').is(':disabled'))) {
            $('#commuter-select').prop('disabled', true);
        }
    }
});

/**
 * マップの表示
 */
var map = L.map('map', {
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: 'topleft',
      title: 'フルスクリーン表示',
      titleCancel: '通常表示に戻す',
  //    forceSeparateButton: true
    }
  }
).setView([35.4159, 137.8234], 7);

var gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

var gsipale = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

var gsienglish = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

var gsiphoto = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

var osm = L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
        { attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
}).addTo(map);

var gsiwhite = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

function getColor_cityFlag(d) {
    return d == "C1" ? '#de2d26' :
           d == "C2" ? '#fc9272' :
           d == "S1" ? '#2171b5' :
           d == "S2" ? '#6baed6' :
           d == "S3" ? '#bdd7e7' :
           d == "S4" ? '#eff3ff' :
           d == null ?'#ffffff':
           '#ffffff';
}

function style_cityFlag(feature) {
    if(feature.properties.cityFlag == null){
        return {
            fillColor: getColor_cityFlag(feature.properties.cityFlag),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }else{
        return {
            fillColor: getColor_cityFlag(feature.properties.cityFlag),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
}

function getCityFlag(d) {
    return d == "C1" ? '中心都市' :
           d == "C2" ? '副中心（郊外中心）市町村' :
           d == "S1" ? '1次郊外市町村' :
           d == "S2" ? '2次郊外市町村' :
           d == "S3" ? '3次郊外市町村' :
           d == "S4" ? '4次郊外市町村' :
           d == null ? '都市圏域外':
           '都市圏域外';
}

function getCityStr(feature) {
    if(feature.properties.subName2 != null && feature.properties.subName2.length > 0){
        return '<p class="tipstyle02">市町村名 : '+feature.properties.cityName+'</p><hr><p class="tipstyle01">都市圏名 : '+feature.properties.subName+'<br>（'+feature.properties.subName2+'）</p>';
    }else{
        return '<p class="tipstyle02">市町村名 : '+feature.properties.cityName+'</p><hr><p class="tipstyle01">都市圏名 : '+feature.properties.subName + '</p>';
    }
}

function onEachFeature_city_popup(feature, layer){
    layer.bindPopup(getCityStr(feature) +'<hr><p>中心・郊外分類 : '+getCityFlag(feature.properties.cityFlag)+'</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var code = "" + ueaCode;
if(code.length == 4){
    code = "0" + ueaCode;

}else{
    code = "" + ueaCode;
}
function datafilter(feature){
    return feature.properties.ueaCode == code;
}

/**
 * 通勤率制御
 */
function popupComment(feature){
    if(feature.properties.commuterRate > 0){
        return (feature.properties.commuterRate*100).toFixed(3) + '%';
    }else{
        return '通勤実態なし';
    }
}

var cityFlags = L.geoJson(city2015,  {style: style_cityFlag, onEachFeature: onEachFeature_city_popup, filter: datafilter}).addTo(map);

map.fitBounds(cityFlags.getBounds());
map.setMaxBounds(cityFlags.getBounds());

var drawCommuterRate = function(fromToSelect, feature, cityCode, cityName, ueaCode) {
    var commuterRate = null

    function getColor_commuterRate(d) {
        return d > 0.4 ? '#a50f15' :
               d > 0.3 ? '#de2d26' :
               d > 0.2 ? '#fb6a4a' :
               d > 0.1 ? '#fc9272' :
               d > 0.05 ? '#fcbba1' :
               d > 0 ? '#fee5d9' :
               d == null ? '#d3d3d3':
               '#d3d3d3';
    }
    function style_commuterRate(feature) {
        if(feature.properties.commuterRate == null){
            return {
                fillColor: getColor_commuterRate(feature.properties.commuterRate),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }else{
            return {
                fillColor: getColor_commuterRate(feature.properties.commuterRate),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
    }

    //通勤率を初期化
    for(var i=0; i < feature.features.length; i++){
        if(feature.features[i].properties.commuterRate) {
            feature.features[i].properties.commuterRate = null;
            feature.features[i].properties.fromName = null;
            feature.features[i].properties.toName = null;
        }
    }

    if(fromToSelect == 'to') {
        $.get({url: '/commuterData2015/to/' + ueaCode + '/' + cityCode, dataType: 'json', type: 'GET', async: false})
        .done(function(data) {
            for(var i=0; i < data.length; i++){
                for(var j=0; j < feature.features.length; j++){
                    if(data[i]["fromCode"] == parseInt(feature.features[j].properties.cityCode)){
                        feature.features[j].properties.commuterRate = data[i]["commuterRate"];
                        feature.features[j].properties.fromName = data[i]["fromName"];
                        feature.features[j].properties.toName = data[i]["toName"];
                    }
                }
            }
        }).fail(function(){
            window.alert("読み込みエラー");
        });
        function onEachFeature_commuterRate_popup(feature, layer){
            layer.bindPopup('<p>'+feature.properties.cityName + 'から<br>'+ cityName + 'への通勤率：' + popupComment(feature) +'</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
        }
        commuterRate = L.geoJson(feature,  {style: style_commuterRate, onEachFeature: onEachFeature_commuterRate_popup, filter: datafilter});
    } else {
        $.get({url: '/commuterData2015/from/' + ueaCode + '/' + cityCode, dataType: 'json', type: 'GET', async: false})
        .done(function(data) {
            for(var i=0; i < data.length; i++){
                for(var j=0; j < feature.features.length; j++){
                    if(data[i]["toCode"] == parseInt(feature.features[j].properties.cityCode)){
                        feature.features[j].properties.commuterRate = data[i]["commuterRate"];
                        feature.features[j].properties.toName = data[i]["toName"];
                        feature.features[j].properties.fromName = data[i]["fromName"];
                    }
                }
            }
        }).fail(function(){
            window.alert("読み込みエラー");
        });
        function onEachFeature_commuterRate_popup(feature, layer){
            layer.bindPopup('<p>'+ cityName + 'から<br>'+ feature.properties.cityName + 'への通勤率：' + popupComment(feature) +'</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
        }
        commuterRate = L.geoJson(feature,  {style: style_commuterRate, onEachFeature: onEachFeature_commuterRate_popup, filter: datafilter});
    }
    return commuterRate;
}

//通勤率以外のデータを挿入
$.get({url: '/cityData2015/' + ueaCode, dataType: 'json', type: 'GET', async: false})
.done(function(data) {
    for(var i=0; i < data.length; i++){
        for(var j=0; j < city2015.features.length; j++){
            if(data[i]["cityCode"] == parseInt(city2015.features[j].properties.cityCode)){
                city2015.features[j].properties.employmentResideseRatio = data[i]["employmentResideseRatio"];
                city2015.features[j].properties.popDid = data[i]["popDid"];
                city2015.features[j].properties.pop2015 = data[i]["pop2015"];
                city2015.features[j].properties.pop1975 = data[i]["pop1975"];
                city2015.features[j].properties.pop1995 = data[i]["pop1995"];
                city2015.features[j].properties.pop2045 = data[i]["pop2045"];
            }
        }
    }
}).fail(function(){
    window.alert("読み込みエラー");
});

//人口
function getColor_pop2015(d){
    return d >= 1000000 ? '#99000d' :
        d >= 500000 ? '#cb181d' :
        d >= 100000 ? '#ef3b2c' :
        d >= 50000 ? '#fb6a4a' :
        d >= 10000 ? '#fc9272':
        d >= 5000 ? '#fcbba1' :
        d >= 0 ? '#fee5d9':
        '#ffffff';
}
function style_pop2015(feature) {
    return {
        fillColor: getColor_pop2015(feature.properties.pop2015),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
function onEachFeature_pop2015_popup(feature, layer){
    layer.bindPopup('<p class="popup">'+ feature.properties.cityName + '</p><hr><p clas="popupData">人口：' + (feature.properties.pop2015).toLocaleString() + '人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
var pop2015 = L.geoJson(city2015,  {style: style_pop2015, onEachFeature: onEachFeature_pop2015_popup, filter: datafilter});

//1975年人口
function getColor_pop1975(d){
    return d >= 1000000 ? '#99000d' :
        d >= 500000 ? '#cb181d' :
        d >= 100000 ? '#ef3b2c' :
        d >= 50000 ? '#fb6a4a' :
        d >= 10000 ? '#fc9272':
        d >= 5000 ? '#fcbba1' :
        d >= 0 ? '#fee5d9':
        '#ffffff';
}
function style_pop1975(feature) {
    return {
        fillColor: getColor_pop1975(feature.properties.pop1975),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
function onEachFeature_pop1975_popup(feature, layer){
    layer.bindPopup('<p class="popup">'+ feature.properties.cityName + '</p><hr><p clas="popupData">1975年人口：' + (feature.properties.pop1975).toLocaleString() + '人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
var pop1975 = L.geoJson(city2015,  {style: style_pop1975, onEachFeature: onEachFeature_pop1975_popup, filter: datafilter});

//1995年人口
function getColor_pop1995(d){
    return d >= 1000000 ? '#99000d' :
        d >= 500000 ? '#cb181d' :
        d >= 100000 ? '#ef3b2c' :
        d >= 50000 ? '#fb6a4a' :
        d >= 10000 ? '#fc9272':
        d >= 5000 ? '#fcbba1' :
        d >= 0 ? '#fee5d9':
        '#ffffff';
}
function style_pop1995(feature) {
    return {
        fillColor: getColor_pop1995(feature.properties.pop1995),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
function onEachFeature_pop1995_popup(feature, layer){
    layer.bindPopup('<p class="popup">'+ feature.properties.cityName + '</p><hr><p clas="popupData">1995年人口：' + (feature.properties.pop1995).toLocaleString() + '人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
var pop1995 = L.geoJson(city2015,  {style: style_pop1995, onEachFeature: onEachFeature_pop1995_popup, filter: datafilter});

//2045年人口
function getColor_pop2045(d){
    return d >= 1000000 ? '#99000d' :
        d >= 500000 ? '#cb181d' :
        d >= 100000 ? '#ef3b2c' :
        d >= 50000 ? '#fb6a4a' :
        d >= 10000 ? '#fc9272':
        d >= 5000 ? '#fcbba1' :
        d > 0 ? '#fee5d9':
        '#d3d3d3';
}
function style_pop2045(feature) {
    return {
        fillColor: getColor_pop2045(feature.properties.pop2045),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
function onEachFeature_pop2045_popup(feature, layer){
    if(feature.properties.pop2045 != null  && feature.properties.pop2045 > 0) {
        layer.bindPopup('<p class="popup">'+ feature.properties.cityName + '</p><hr><p clas="popupData">2045年推計人口：' + (feature.properties.pop2045).toLocaleString() + '人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
    } else {
        layer.bindPopup('<p class="popup">'+ feature.properties.cityName + '</p><hr><p clas="popupData">2045年推計人口：推計結果なし</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
    }
    
}
var pop2045 = L.geoJson(city2015,  {style: style_pop2045, onEachFeature: onEachFeature_pop2045_popup, filter: datafilter});

//従業常住比率
function getColor_empResiRatio(d){
    return d >= 1.1 ? '#ca0020' :
        d >= 1.0 ? '#f4a582' :
        d >= 0.9 ? '#92c5de' :
        d < 0.9 ? '#0571b0' :
        '#ffffff';
}
function style_empResiRatio(feature) {
    return {
        fillColor: getColor_empResiRatio(feature.properties.employmentResideseRatio),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
function onEachFeature_empResiRatio_popup(feature, layer){
    layer.bindPopup('<p class="popup">'+ feature.properties.cityName + '</p><hr><p clas="popupData">従業常住比率：' + feature.properties.employmentResideseRatio.toFixed(3) + '</p>' ,{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
var employmentResideseRatio = L.geoJson(city2015,  {style: style_empResiRatio, onEachFeature: onEachFeature_empResiRatio_popup, filter: datafilter});

//中心DID人口
function getColor_popDid(d){
    return d >= 1000000 ? '#a50f15' :
        d >= 500000 ? '#de2d26' :
        d >= 100000 ? '#fb6a4a' :
        d >= 50000 ? '#fc9272':
        d >= 10000 ? '#fcbba1' :
        d > 0 ? '#fee5d9':
        '#d3d3d3';
}
function style_popDid(feature) {
    return {
        fillColor: getColor_popDid(feature.properties.popDid),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
function onEachFeature_popDid_popup(feature, layer){
    if(feature.properties.popDid > 0) {
        layer.bindPopup('<p class="popup">'+ feature.properties.cityName + '</p><hr><p clas="popupData">DID人口：' + (feature.properties.popDid).toLocaleString() + '人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
    } else {
        layer.bindPopup('<p class="popup">'+ feature.properties.cityName + '</p><hr><p clas="popupData">DID設定なし</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
    }
    
}
var popDid = L.geoJson(city2015,  {style: style_popDid, onEachFeature: onEachFeature_popDid_popup, filter: datafilter});


/**
 * ボタンが押されたときの変更制御
 */
nowMap = osm;
nowData = cityFlags;
$('#display-map-btn').on('click', function() {
    /**
     * 背景地図変更処理
     */
    map.removeLayer(nowMap);
    var selectMap = $('#map-select').val();
    switch (selectMap) {
        case 'osm':
            osm.addTo(map);
            nowMap = osm;
            break;
        case 'gsi':
            gsi.addTo(map);
            nowMap = gsi;
            break;
        case 'gsi-pale':
            gsipale.addTo(map);
            nowMap = gsipale;
            break;
        case 'gsi-eng':
            gsienglish.addTo(map);
            nowMap = gsienglish;
            break;
        case 'gsi-pho':
            gsiphoto.addTo(map);
            nowMap = gsiphoto;
            break;
        case 'gsi-whi':
            gsiwhite.addTo(map);
            nowMap = gsiwhite;
            break;
    }

    /**
     * データ変更処理
     */
    map.removeLayer(nowData);
    var selectData = $('#data-select').val();
    switch (selectData) {
        case 'center-suburb':
            cityFlags.addTo(map);
            nowData = cityFlags;
            break;
        case 'commuter-rate': //通勤率
            var fromToSelect = $('input:radio[name="from-to-select"]:checked').val(); //従業地常住地基準かを取得
            var selectUeaCode = $('#commuter-select option:selected').data('ueacode'); //ueaCodeを取得
            var selectCityName = $('#commuter-select option:selected').data('cityname'); //市町村名を取得
            var selectCityCode = $('#commuter-select option:selected').val(); //市町村コードを取得
            var commuterRate = drawCommuterRate(fromToSelect, city2015, selectCityCode, selectCityName, selectUeaCode);
            commuterRate.addTo(map);
            nowData = commuterRate;
            break;
        case 'pop2015':
            pop2015.addTo(map);
            nowData = pop2015;
            break;
        case 'pop1975':
            pop1975.addTo(map);
            nowData = pop1975;
            break;
        case 'pop1995':
            pop1995.addTo(map);
            nowData = pop1995;
            break;
        case 'pop2045':
            pop2045.addTo(map);
            nowData = pop2045;
            break;
        case 'employment-residese-ratio':
            employmentResideseRatio.addTo(map);
            nowData = employmentResideseRatio;
            break;
        case 'pop-did':
            popDid.addTo(map);
            nowData = popDid;
            break;
    }
});
