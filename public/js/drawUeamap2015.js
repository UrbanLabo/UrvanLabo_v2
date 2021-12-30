
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

const mapBounds = [[16.944, 118.007],[50.819, 156.298]];
map.setMaxBounds(mapBounds);

//年齢中位数
function getColor_ueaMidAge(d){
    return d >= 60 ? '#67000d' :
        d >= 57.5 ? '#a50f15':
        d >= 55 ? '#cb181d' :
        d >= 52.5 ? '#ef3b2c':
        d >= 50 ? '#fb6a4a' :
        d >= 47.5 ? '#fc9272' :
        d >= 45 ? '#fcbba1' :
        d >= 42.5 ? '#fee0d2':
        d >= 40 ? '#fff5f0' :
        '#ffffff';
}

function style_ueaMidAge(feature) {
    return {
        fillColor: getColor_ueaMidAge(feature.properties.ageMedian),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_midAge(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">年齢中位数<br>（年齢の中央値）: '+(feature.properties.ageMedian).toFixed(3)+' 歳</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_midAge_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' +parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>'+'</p><hr><p class="tipstyle01">年齢中位数<br>（年齢の中央値）: '+(feature.properties.ageMedian).toFixed(3)+' 歳</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

//

var midAge = L.geoJson(uea2015,  {style: style_ueaMidAge, onEachFeature: onEachFeature_midAge_popup});


//人口
function getColor_pop2015(d){
    return d >= 10000000 ? '#99000d' :
        d >= 5000000 ? '#cb181d' :
        d >= 1000000 ? '#ef3b2c' :
        d >= 500000 ? '#fb6a4a' :
        d >= 100000 ? '#fc9272':
        d >= 50000 ? '#fcbba1' :
        d >= 10000 ? '#fee5d9':
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

// function onEachFeature_pop2015(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">人口: '+feature.properties.pop2015+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_pop2015_popup(feature, layer){
    layer.bindPopup('<p class="popup">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>'+ '</p><hr><p clas="popupData">人口：' + feature.properties.pop2015.toLocaleString() + '人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var pop2015 = L.geoJson(uea2015,  {style: style_pop2015, onEachFeature: onEachFeature_pop2015_popup}).addTo(map);

//中心DID人口
function getColor_popDid(d){
    return d >= 1000000 ? '#a50f15' :
        d >= 500000 ? '#de2d26' :
        d >= 100000 ? '#fb6a4a' :
        d >= 50000 ? '#fcae91':
        d >= 10000 ? '#fee5d9' :
        '#ffffff';
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

// function onEachFeature_popDid(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">1次中心都市DID人口: '+feature.properties.popDid+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_popDid_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>'+ '</p><hr><p class="tipstyle01">中心都市DID人口: '+feature.properties.popDid.toLocaleString()+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var popDid = L.geoJson(uea2015,  {style: style_popDid, onEachFeature: onEachFeature_popDid_popup});

//中心都市人口
function getColor_popCenter(d){
    return d >= 1000000 ? '#a50f15' :
        d >= 500000 ? '#de2d26' :
        d >= 100000 ? '#fb6a4a' :
        d >= 50000 ? '#fcae91':
        d >= 10000 ? '#fee5d9' :
        '#ffffff';
}

function style_popCenter(feature) {
    return {
        fillColor: getColor_popCenter(feature.properties.popCenter),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_popCenter(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">中心都市人口: '+feature.properties.popCenter+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_popCenter_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>'+ '</p><hr><p class="tipstyle01">中心市町村人口: '+feature.properties.popCenter.toLocaleString()+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var popCenter = L.geoJson(uea2015,  {style: style_popCenter, onEachFeature: onEachFeature_popCenter_popup});

//可住地人口密度
function getColor_densityHabi(d){
    return d >= 50000 ? '#a50f15' :
        d >= 1000 ? '#de2d26' :
        d >= 500 ? '#fb6a4a' :
        d >= 100 ? '#fcae91':
        d >= 0 ? '#fee5d9' :
        '#ffffff';
}

function style_densityHabi(feature) {
    return {
        fillColor: getColor_densityHabi(feature.properties.densityHab),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_densityHabi(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">可住地人口密度: '+(feature.properties.densityHab).toFixed(3)+' 人/㎢</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_densityHabi_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>'+ '</p><hr><p class="tipstyle01">可住地人口密度: '+(feature.properties.densityHab).toFixed(3).toLocaleString() +' 人/㎢</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var densityHabi = L.geoJson(uea2015,  {style: style_densityHabi, onEachFeature: onEachFeature_densityHabi_popup});

//圏内総生産
function getColor_gup(d){
    return d >= 100000000 ? '#99000d':
        d >= 50000000 ? '#cb181d' :
        d >= 10000000 ? '#ef3b2c':
        d >= 5000000 ? '#fb6a4a' :
        d >= 1000000 ? '#fc9272' :
        d >= 500000 ? '#fcbba1' :
        d >= 100000 ? '#fee0d2':
        d >= 50000 ? '#fff5f0' :
        '#ffffff';
}

function style_gup(feature) {
    return {
        fillColor: getColor_gup(feature.properties.gup),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_gup(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">圏内総生産: '+(feature.properties.gup/100).toFixed(3)+' 億円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_gup_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>' + '</p><hr><p class="tipstyle01">圏内総生産: '+(feature.properties.gup/100).toFixed(3).toLocaleString() +' 億円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

//

var gup = L.geoJson(uea2015,  {style: style_gup, onEachFeature: onEachFeature_gup_popup});

//1人当たりの圏内総生産
function getColor_gupPer(d){
    return d >= 8 ? '#99000d':
        d >= 7 ? '#cb181d' :
        d >= 6 ? '#ef3b2c':
        d >= 5 ? '#fb6a4a' :
        d >= 4 ? '#fc9272' :
        d >= 3 ? '#fcbba1' :
        d >= 2 ? '#fee0d2':
        d >= 1 ? '#fff5f0' :
        '#ffffff';
}

function style_gupPer(feature) {
    return {
        fillColor: getColor_gupPer(feature.properties.gupPer),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_gupPer(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">' +feature.properties.subName+'</p><hr><p class="tipstyle01">1人当たりの生産額 : '+(feature.properties.gupPer).toFixed(3) + '百万円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_gupPer_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>' + '</p><hr><p class="tipstyle01">1人当たりの生産額 : '+(feature.properties.gupPer).toFixed(3).toLocaleString() + '百万円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

//

var gupPer = L.geoJson(uea2015,  {style: style_gupPer, onEachFeature: onEachFeature_gupPer_popup});

//フォーム制御
/**
 * 背景地図変更制御
 */
var nowMap = osm; //現在の地図情報を格納する変数
$('#map-select').on('change', function(){
    map.removeLayer(nowMap);
    var select = $(this).val();
    switch (select) {
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
});
/**
 * データ変更制御
 */
var nowData = pop2015;
$('#data-select').on('change', function(){
    map.removeLayer(nowData);
    var select = $(this).val();
    switch (select) {
        case 'pop':
            pop2015.addTo(map);
            nowData = pop2015;
            break;
        case 'pop-did':
            popDid.addTo(map);
            nowData = popDid;
            break;
        case 'pop-center':
            popCenter.addTo(map);
            nowData = popCenter;
            break;
        case 'age':
            midAge.addTo(map);
            nowData = midAge;
            break;
        case 'density-habi':
            densityHabi.addTo(map);
            nowData = densityHabi;
            break;
        case 'gup':
            gup.addTo(map);
            nowData = gup;
            break;
        case 'gup-per':
            gupPer.addTo(map);
            nowData = gupPer;
            break;
    }
});