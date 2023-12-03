"use strict";

const FONT   = "48px monospace";  // 使用フォント
const HEIGHT = 120;               // 仮想画面サイズ：高さ
const WIDTH  = 128;               // 仮想画面サイズ：幅

let gScreen;                      // 仮想画面
let gFrame = 0;                   // 内部カウンタ
let gImgMap;                      // 画像 マップ

function DrawMain()
{
  const g = gScreen.getContext( "2d" );

  for( let y = 0; y < 32; y++ ){
    for( let x = 0; x < 64; x++ ){
      g.drawImage( gImgMap, x * 32, y * 32 );
    }
  }
  
  g.font = FONT;                              // 文字フォントを設定
  g.fillText("Hello World" + gFrame, gFrame / 10, 64);
}


function WmPaint()
{
  DrawMain();

  const ca = document.getElementById("main"); // mainキャンバスの要素を取得
  const g  = ca.getContext("2d");             // 2D描画コンテキストを取得)
  g.drawImage( gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, ca.width, ca.height ); // 仮想画面のイメージを実画面に転送

} 

function WmSize()
{
  const ca = document.getElementById("main"); // mainキャンバスの要素を取得
  ca.width = window.innerWidth;               // キャンバスの幅をブラウザの幅へ変更
  ca.height = window.innerHeight;             // キャンバスの高さをブラウザの高さへ変更
}


//タイマーイベント発生時の処理
function WmTimer()
{
  gFrame++;                     // 内部カウンタを加算
  WmPaint();
}

//ブラウザ起動イベント
window.onload = function()
{
  gImgMap = new Image();  gImgMap.src = "img/map.png";  //マップ画像読み込み

  gScreen = document.createElement( "canvas" ); // 仮想画面を作成
  gScreen.width = WIDTH;                        // 仮想画面の幅を設定
  gScreen.height = HEIGHT;                      // 仮想画面の高さを設定

  WmSize();                                     // 画面サイズ初期化
  window.addEventListener( "resize", function(){ WmSize() } );  //ブラウザサイズ変更時、WmSizeが呼ばれる様指示
  setInterval( function(){ WmTimer() },33 );    // 33ms感覚で、WmTimer()を呼び出す様に指示(役30fps)
}