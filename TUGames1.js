"use strict";

var TUG = TUG || {};
TUG.GR = {};

TUG.mCurrentFrame = 0;        // 経過フレーム数
TUG.mFPS = 60;                // フレームレート
TUG.mHeight = 120;            // 仮想画面・高さ
TUG.mWidth  = 128;            // 仮想画面・幅
TUG.mSmooth = 0;              // 補間処理

TUG.onTimer = function(){}

TUG.init = function()
{
  TUG.GR.mCanvas = document.createElement( "canvas" ); // 仮想画面を作成
  TUG.GR.mCanvas.width  = TUG.mWidth;                        // 仮想画面の幅を設定
  TUG.GR.mCanvas.height = TUG.mHeight;                      // 仮想画面の高さを設定
  TUG.GR.mG = TUG.GR.mCanvas.getContext( "2d" );             // 仮想画面の2D描画コンテキストを取得
  
  TUG.wmSize();                                     // 画面サイズ初期化
  window.addEventListener( "resize", function(){ TUG.wmSize() } );  //ブラウザサイズ変更時、WmSizeが呼ばれる様指示

  //setInterval( function(){ TUG.wmTimer() }, 33 );    // 33ms感覚で、WmTimer()を呼び出す様に指示(役30fps)
  requestAnimationFrame( TUG.wmTimer );
}


// IE対応
TUG.Sign = function ( val )
{
  if( val == 0 ){
    return( 0 );
  }
  if( val < 0 ){
    return( -1 );
  }
  return( 1 );
}

// ブラウザサイズ変更イベント
TUG.wmSize = function()
{
  const ca = TUG.mCanvas = document.getElementById("main"); // mainキャンバスの要素を取得

  ca.style.position = "absolute";                           // キャンバスの位置を変更可へ
  if( window.innerWidth / TUG.mWidth < window.innerHeight / TUG.mHeight ){    // 縦長画面の場合
   ca.width = window.innerWidth;
   ca.height = window.innerWidth * TUG.mHeight /TUG.mWidth;
   ca.style.left = "0px";                                   // キャンバスの位置を左端へ
  }else{    // 横長画面の場合
    ca.height = window.innerHeight;
    ca.width = window.innerHeight * TUG.mWidth / TUG.mHeight;
    ca.style.left = Math.floor( ( window.innerWidth - ca.width ) / 2 ) + "px";  // キャンバスの位置を画面中央へ
  }

  const g  = ca.getContext("2d");             // 2D描画コンテキストを取得)
  g.imageSmoothingEnabled = g.imageSmoothingEnabled = TUG.mSmooth;    // 補完処理
}


TUG.wmTimer = function()
{
  if( !TUG.mCurrentStart ){                 // 初回呼び出し時
    TUG.mCurrentStart = performance.now();  // 開始時刻を設定
  }
  let d = Math.floor( ( performance.now() - TUG.mCurrentStart ) * TUG.mFPS / 1000 ) - TUG.mCurrentFrame;
  if( d > 0 ){
    TUG.onTimer( d );
    TUG.mCurrentFrame += d;
  };

  requestAnimationFrame( TUG.wmTimer );
}


