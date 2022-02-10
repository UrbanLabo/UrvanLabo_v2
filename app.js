const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//MySQLへの接続
/* const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysmue861',
  database: 'uea'
}); */

/* const connection = mysql.createConnection({
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'bb1497301ec843',
  password: '8fe11df3',
  database: 'heroku_60f1468f3eac4a0'
}); */

//heroku用プール接続
const pool = mysql.createPool({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'bb1497301ec843',
    password: '8fe11df3',
    database: 'heroku_60f1468f3eac4a0'
});

//ローカル用プール
/* const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysmue861',
  database: 'uea'
}); */

//接続が出来ない時のエラー表示
pool.getConnection((err, connection) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
    console.log('success');
    connection.release();

});

//トップページへ
app.get('/', (req, res) => {
    res.render('top.ejs');
});

//サイトの目的ページへ
app.get('/aboutThisSite', (req, res) => {
    res.render('about-this-site.ejs');
});

//都市雇用圏とはのページへ
app.get('/aboutUEA', (req, res) => {
    res.render('about-uea.ejs');
});

//都市雇用圏データ表のページへ
app.get('/dataTable', (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM ueadata2015',
            (error, results_ueadata) => {
                res.render('datatable.ejs', {items_ueadata: results_ueadata, year: "2015"});
            }
        );
    });
});

app.post('/dataTable',(req, res) => {
    var sql = 'SELECT * FROM ueadata'
    switch (req.body["year-select"]) {
        case "2015":
            sql += 2015;
            break;
        case "2000":
            sql = "SELECT *, replace(subName, '都市圏', '') AS ueaNameOmitted FROM ueadata2000";
            break;
        default:
            sql += 2015;
            break;
    }
    pool.getConnection((err, connection) => {
        connection.query(sql,
        (error, results_ueadata) => {
                res.render('datatable.ejs', {items_ueadata: results_ueadata, year: req.body["year-select"]});
        });
    });
});

//全国都市雇用圏マップ2015へ
app.get('/ueamap2015', (req, res) => {
    pool.getConnection((err, connection) => {
    connection.query(
        'SELECT ueaCode, subName FROM ueadata2015',
            (error, results_ueaIndex) => {
            res.render('ueamap2015.ejs', {items_ueaIndex: results_ueaIndex});
            }
    );
    });
});

//全国都市雇用圏マップ2000へ
app.get('/ueamap2000', (req, res) => {
    res.render('ueamap2000.ejs');
});


//ダウンロードページへ
app.get('/downloads', (req, res) => {
    res.render('downloads.ejs');
});

//全国都市雇用圏マップ用データをを取得し送信
app.get('/ueadata2000', (req, res) => {
    pool.getConnection((err, connection) => {
    connection.query(
        'SELECT * FROM ueadata2000',
        (error, results_uea2000) => {
        res.json(results_uea2000);
        }
    )
    })
});

//都市雇用圏詳細情報2015へ
app.get('/uea2015/:ueaCode', (req, res) => {
    //都市圏データの取得
    pool.getConnection((err, connection) => {
    connection.query(
        'SELECT * FROM ueadata2015view WHERE ueaCode=?',
            [req.params.ueaCode],
            (error, results_uea) => {
                //市町村データの取得
                pool.getConnection((err, connection) => {
                connection.query(
                    'SELECT * FROM citydata2015 WHERE ueaCode=?',
                    [req.params.ueaCode],
                    (error_2, results_city) => {
                    //都市圏一覧情報の取得
                    connection.query(
                        'SELECT ueaCode, subName FROM ueadata2015',
                        (error, results_ueaIndex) => {
                            res.render('detail2015.ejs', {items_uea: results_uea, items_city: results_city, items_ueaIndex: results_ueaIndex});
                        }
                        
                    );
                    connection.release();
                    }
                );
                });
            }
    );
    connection.release();
    })
});

//市町村通勤率2015のデータをcitymapInUea2015.jsに送信
app.get('/commuterData2015/to/:ueaCode/:cityCode', (req, res) => {
    pool.getConnection((err, connection) => {
    connection.query(
        'SELECT a.toCode AS toCode, b.cityName AS toName, b.ueaCode AS toUeaCode, a.fromCode AS fromCode, c.cityName AS fromName, c.ueaCode AS fromUeaCode, a.commuterRate AS commuterRate ' +
        'FROM commuternetwork2015 AS a ' +
        'JOIN citydata2015 AS b ON a.toCode = b.cityCode ' +
        'JOIN citydata2015 AS c ON a.fromCode = c.cityCode ' +
        'WHERE b.ueaCode = ? AND c.ueaCode = ? AND a.toCode = ? ',
        [req.params.ueaCode, req.params.ueaCode, req.params.cityCode],
        (error, results) => {
            //console.log(results);
            res.json(results);
            connection.release();
        }
    );
    });
});
app.get('/commuterData2015/from/:ueaCode/:cityCode', (req, res) => {
    pool.getConnection((err, connection) => {
    connection.query(
        'SELECT a.toCode AS toCode, b.cityName AS toName, b.ueaCode AS toUeaCode, a.fromCode AS fromCode, c.cityName AS fromName, c.ueaCode AS fromUeaCode, a.commuterRate AS commuterRate ' +
        'FROM commuternetwork2015 AS a ' +
        'JOIN citydata2015 AS b ON a.toCode = b.cityCode ' +
        'JOIN citydata2015 AS c ON a.fromCode = c.cityCode ' +
        'WHERE b.ueaCode = ? AND c.ueaCode = ? AND a.fromCode = ? ',
        [req.params.ueaCode, req.params.ueaCode, req.params.cityCode],
        (error, results) => {
            //console.log(results);
            res.json(results);
            connection.release();
        }
    );
    });
});
//市町村マップ描画用データ送信
app.get('/cityData2015/:ueaCode', (req, res) => {
    pool.getConnection((err, connection) => {
    connection.query(
        'SELECT a.*, b.employmentResideseRatio '+
        'FROM citydata2015v02 AS a ' + 
        'JOIN citydata2015 AS b ON a.cityCode = b.cityCode ' + 
        'WHERE a.ueaCode = ? ',
        [req.params.ueaCode],
        (error, results) => {
            //console.log(results);
            res.json(results);
            connection.release();
        }
    );
    });
});

//2015年基準の人口推移データをpoptransition.jsに送信
app.get('/ueaData2015/:ueaCode', (req, res) => {
    pool.getConnection((err, connection) => {
    connection.query(
        'SELECT * FROM ueadata2015 WHERE ueaCode=?',
        [req.params.ueaCode],
        (error, results) => {
        res.json(results);
        connection.release();
        }
    );
    });
});

//herokuデプロイ用

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);   

//ローカル環境用
//app.listen(3000);