/**
 * 都市圏一覧表示時のサイドバーやモーダルの高さを調整するjs
 * !!CSSにてoverflow-y: scroll;の設定が必要!!
 */
$(window).on('load resize', function(){ //windowがロードあるいはサイズ変更が起こった場合に処理を実行
    setTimeout(function(){ //最大化ボタンを押したときはブラウザ側の処理が追いつかない場合があるため、jqueryの処理を遅らせる
        /**
         * サイドバー表示時の調整
         */
        var mainAreaHeight = $('#main-area').outerHeight(); //メインコンテンツ表示エリアの高さを取得
        $('#uea-list-area').outerHeight(mainAreaHeight); //サイドバーの表示をメインコンテンツの高さに合わせる

        /**
         * モーダル表示時の調整
         */
        var bodyHeight = $(window).outerHeight(true); //画面の高さを取得
        $('.modal-content').outerHeight(bodyHeight); //モーダルの高さを画面の高さに合わせる
        var modalHeaderHeight = $('.modal-header').outerHeight(true); //モーダルのヘッダの高さを取得
        var modalFooterHeight = $('.modal-footer').outerHeight(true); //モーダルのフッタの高さを取得
        $('.modal-body').height(bodyHeight-modalHeaderHeight-modalFooterHeight); //モーダルのリスト部分の高さを設定
    }, 0.00001);
});