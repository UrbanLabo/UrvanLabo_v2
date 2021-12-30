
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
    return d >= 55 ? '#67000d' :
        d >= 52.5 ? '#a50f15':
        d >= 50 ? '#cb181d' :
        d >= 47.5 ? '#ef3b2c':
        d >= 45 ? '#fb6a4a' :
        d >= 42.5 ? '#fc9272' :
        d >= 40 ? '#fcbba1' :
        d >= 37.5 ? '#fee0d2':
        d >= 35 ? '#fff5f0' :
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
    layer.bindPopup('<p class="tipstyle02">'  + feature.properties.subName +'</p><hr><p class="tipstyle01">年齢中位数<br>（年齢の中央値）: '+(feature.properties.ageMedian).toFixed(3)+' 歳</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

//

var midAge = L.geoJson(uea2000,  {style: style_ueaMidAge, onEachFeature: onEachFeature_midAge_popup});


//人口
function getColor_pop2000(d){
    return d >= 10000000 ? '#99000d' :
        d >= 5000000 ? '#cb181d' :
        d >= 1000000 ? '#ef3b2c' :
        d >= 500000 ? '#fb6a4a' :
        d >= 100000 ? '#fc9272':
        d >= 50000 ? '#fcbba1' :
        d >= 10000 ? '#fee5d9':
        '#ffffff';
}

function style_pop2000(feature) {
    return {
        fillColor: getColor_pop2000(feature.properties.pop2000),
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

function onEachFeature_pop2000_popup(feature, layer){
    layer.bindPopup('<p class="popup">' + feature.properties.subName + '</p><hr><p clas="popupData">人口：' + feature.properties.pop2000.toLocaleString() + '人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var pop2000 = L.geoJson(uea2000,  {style: style_pop2000, onEachFeature: onEachFeature_pop2000_popup}).addTo(map);

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
        fillColor: getColor_popDid(feature.properties.popDidC1),
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
    layer.bindPopup('<p class="tipstyle02">'  + feature.properties.subName + '</p><hr><p class="tipstyle01">中心都市DID人口: '+feature.properties.popDidC1.toLocaleString()+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var popDid = L.geoJson(uea2000,  {style: style_popDid, onEachFeature: onEachFeature_popDid_popup});


//年間商品販売額
function getColor_productsales(d){
    return d >= 50000000 ? '#99000d':
        d >= 10000000 ? '#cb181d' :
        d >= 5000000 ? '#ef3b2c':
        d >= 1000000 ? '#fb6a4a' :
        d >= 500000 ? '#fc9272' :
        d >= 100000 ? '#fcbba1' :
        d >= 50000 ? '#fee0d2':
        d >= 10000 ? '#fff5f0' :
        '#ffffff';
}

function style_productsales(feature) {
    return {
        fillColor: getColor_productsales(feature.properties.annualSalesOfMarchandize),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

function onEachFeature_productsales_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + feature.properties.subName + '</p><hr><p class="tipstyle01">年間商品販売額: '+(feature.properties.annualSalesOfMarchandize/100).toLocaleString() +' 億円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var productsales = L.geoJson(uea2000,  {style: style_productsales, onEachFeature: onEachFeature_productsales_popup});

//製造品出荷額等
function getColor_industryshipment(d){
    return d >= 10000000 ? '#99000d':
        d >= 5000000 ? '#cb181d' :
        d >= 1000000 ? '#ef3b2c':
        d >= 500000 ? '#fb6a4a' :
        d >= 100000 ? '#fc9272' :
        d >= 50000 ? '#fcbba1' :
        d >= 10000 ? '#fee0d2':
        d >= 5000 ? '#fff5f0' :
        '#ffffff';
}

function style_industryshipment(feature) {
    return {
        fillColor: getColor_industryshipment(feature.properties.shipmentOfIndustry),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_industryshipment(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">' +feature.properties.subName+'</p><hr><p class="tipstyle01">1人当たりの生産額 : '+(feature.properties.industryshipment).toFixed(3) + '百万円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_industryshipment_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + feature.properties.subName + '</p><hr><p class="tipstyle01">製造品出荷額等 : '+(feature.properties.shipmentOfIndustry).toLocaleString() + '百万円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

//

var industryshipment = L.geoJson(uea2000,  {style: style_industryshipment, onEachFeature: onEachFeature_industryshipment_popup});

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
var nowData = pop2000;
$('#data-select').on('change', function(){
    map.removeLayer(nowData);
    var select = $(this).val();
    switch (select) {
        case 'pop':
            pop2000.addTo(map);
            nowData = pop2000;
            break;
        case 'pop-did':
            popDid.addTo(map);
            nowData = popDid;
            break;
        case 'age':
            midAge.addTo(map);
            nowData = midAge;
            break;
        case 'productsales':
            productsales.addTo(map);
            nowData = productsales;
            break;
        case 'industryshipment':
            industryshipment.addTo(map);
            nowData = industryshipment;
            break;
    }
});