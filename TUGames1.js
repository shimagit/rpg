"use strict";

var TUG = TUG || {};
TUG.BG = {};
TUG.GR = {};

TUG.mCurrentFrame = 0;        // 経過フレーム数
TUG.mFPS = 60;                // フレームレート
TUG.mHeight = 120;            // 仮想画面・高さ
TUG.mWidth  = 128;            // 仮想画面・幅
TUG.mSmooth = 0;              // 補間処理

TUG.onTimer = function(){}
TUG.onPaint = function(){}

TUG.init = function( id )
{
  TUG.mID = id;
  TUG.GR.mCanvas = document.createElement( "canvas" ); // 仮想画面を作成
  TUG.GR.mCanvas.width  = TUG.mWidth;                        // 仮想画面の幅を設定
  TUG.GR.mCanvas.height = TUG.mHeight;                      // 仮想画面の高さを設定
  TUG.GR.mG = TUG.GR.mCanvas.getContext( "2d" );             // 仮想画面の2D描画コンテキストを取得

  TUG.BG.init();
  
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

TUG.wmPaint = function()
{
  {
  
  let   mx = Math.floor( TUG.BG.mX / TUG.BG.mWidth );     // プレイヤーのタイル座標X
  let   my = Math.floor( TUG.BG.mY / TUG.BG.mHeight );     // プレイヤーのタイル座標Y
  
  for( let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++ ){
    let ty = my + dy;                               // タイル座標Y
    let py = ( ty + MAP_HEIGHT ) % MAP_HEIGHT;      // ループ後タイル座標Y
    for( let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++ ){
      let tx = mx + dx                              // タイル座標X
      let px = ( tx + MAP_WIDTH  ) % MAP_WIDTH;     // ループ後タイル座標X
      DrawTile( TUG.GR.mG,
                tx * TUG.BG.mWidth  + WIDTH  /2 - TUG.BG.mX,
                ty * TUG.BG.mHeight + HEIGHT /2 - TUG.BG.mY,
                gMap[ py * MAP_WIDTH + px ]);
    }
  }
}

  TUG.onPaint();

  const ca = document.getElementById( TUG.mID ); // mainキャンバスの要素を取得
  const g  = ca.getContext("2d");             // 2D描画コンテキストを取得)
  g.drawImage( TUG.GR.mCanvas, 0, 0, TUG.GR.mCanvas.width, TUG.GR.mCanvas.height, 0, 0,TUG.mCanvas.width, TUG.mCanvas.height ); // 仮想画面のイメージを実画面に転送
  
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
    TUG.wmPaint();
  };

  requestAnimationFrame( TUG.wmTimer );
}

TUG.BG.init = function()
{
  TUG.BG.mWidth  = 8;
  TUG.BG.mHeight = 8;
}


