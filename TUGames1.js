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

TUG.createCanvas = function( width, height )
{
  let r = document.createElement( "canvas" ); // 仮想画面を作成
  r.width  = width;                           // 仮想画面の幅を設定
  r.height = height;                          // 仮想画面の高さを設定
  return( r ); 
}

TUG.init = function( id )
{
  TUG.mID = id;
  TUG.GR.mCanvas = TUG.createCanvas( TUG.mWidth, TUG.mHeight); // 仮想画面を作成
  TUG.GR.mG = TUG.GR.mCanvas.getContext( "2d" );             // 仮想画面の2D描画コンテキストを取得

  TUG.BG.init( 8, 8, 32, 32 );
  
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
  const ca = TUG.mCanvas = document.getElementById( TUG.mID ); // mainキャンバスの要素を取得
  TUG.mMC = ca.getContext("2d");             // 2D描画コンテキストを取得)

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
  TUG.BG.draw();
  TUG.onPaint();
  TUG.mMC.drawImage( TUG.GR.mCanvas, 0, 0, TUG.GR.mCanvas.width, TUG.GR.mCanvas.height, 0, 0,TUG.mCanvas.width, TUG.mCanvas.height ); // 仮想画面のイメージを実画面に転送
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

TUG.BG.draw = function()
{
/*  
    let   mx = Math.floor( TUG.BG.mX / TUG.BG.mWidth );     // プレイヤーのタイル座標X
    let   my = Math.floor( TUG.BG.mY / TUG.BG.mHeight );     // プレイヤーのタイル座標Y
  
    let SCR_HEIGHT = 8;                       // 画面タイルサイズの半分の高さ
    let SCR_WIDTH  = 8;                       // 画面タイルサイズの半分の幅
    
    for( let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++ ){
      let ty = my + dy;                               // タイル座標Y
      let py = ( ty + TUG.BG.mRow ) % TUG.BG.mRow;      // ループ後タイル座標Y
      for( let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++ ){
        let tx = mx + dx                              // タイル座標X
        let px = ( tx + TUG.BG.mColumn  ) % TUG.BG.mColumn;     // ループ後タイル座標X
        DrawTile( TUG.BG.mG,
                  tx * TUG.BG.mWidth  + TUG.mWidth  /2 - TUG.BG.mX,
                  ty * TUG.BG.mHeight + TUG.mHeight /2 - TUG.BG.mY,
                  TUG.BG.mData[ TUG.BG.getIndex( px, py ) ] );
      }
    }
  */
    TUG.GR.mG.drawImage( TUG.BG.mCanvas, -TUG.BG.mX, -TUG.BG.mY );
    // TUG.GR.mG.drawImage( TUG.BG.mCanvas, 0, 0 );
}

TUG.BG.getIndex = function( x, y )
{
  return( y * TUG.BG.mColumn + x );
}

TUG.BG.init = function( width, height, column, row )
{
  TUG.BG.mWidth  = width;
  TUG.BG.mHeight = height;
  TUG.BG.mColumn = column;      // 桁数
  TUG.BG.mRow    = row;         // 行数
  TUG.BG.mData   = new Uint16Array( column * row );
  TUG.BG.mCanvas = TUG.createCanvas( width * column, height * row ); // 仮想画面を作成
  TUG.BG.mG      = TUG.BG.mCanvas.getContext( "2d" );             // 仮想画面の2D描画コンテキストを取得
}

TUG.BG.setVal = function( x, y, val )
{
  TUG.BG.mData[ TUG.BG.getIndex( x, y ) ] = val;

  DrawTile( TUG.BG.mG,
    x * TUG.BG.mWidth,
    y * TUG.BG.mHeight,
    TUG.BG.mData[ TUG.BG.getIndex( x, y ) ] );
}