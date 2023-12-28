"use strict";

var TUG = TUG || {};
TUG.BG = {};
TUG.GR = {};

TUG.mCurrentFrame = 0;        // 経過フレーム数
TUG.mFPS = 60;                // フレームレート
TUG.mHeight = 180;            // 仮想画面・高さ
TUG.mWidth  = 240;            // 仮想画面・幅
TUG.mSmooth = 0;              // 補間処理

TUG.onKeyDown = function( c){}
TUG.onTimer = function(){}
TUG.onPaint = function(){}

TUG.mKey = new Uint8Array( 0x100 );		//	キー入力バッファ

// キー入力(DOWN)イベント
window.onkeydown = function( ev )
{
  let c = ev.keyCode;       // キーコード取得

  if( TUG.mKey[c] !=0 ){        // 既にキーを押下中の場合（キーリピート）
    return;
  }

  TUG.mKey[ c ] = 1;

  TUG.onKeyDown( c );
}

// キー入力(UP)イベント
window.onkeyup = function( ev )
{
  TUG.mKey[ ev.keyCode ] = 0;
}

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
  while( d -- ){
    TUG.onTimer();
    TUG.mCurrentFrame ++;
    if( d == 0 ){
      TUG.wmPaint();
    }
  };

  requestAnimationFrame( TUG.wmTimer );
}

TUG.BG.draw = function()
{
  let sy = TUG.BG.mY;
 
  for( let y = 0; y < TUG.mHeight;){
    while( sy >= 0 ){
      sy -= TUG.BG.mCanvas.height;
    }
    while( sy < 0 ){
      sy += TUG.BG.mCanvas.height;
    }
    let h = Math.min( TUG.mHeight, TUG.BG.mCanvas.height - sy );
    let sx = TUG.BG.mX;
    for( let x =0; x < TUG.mWidth;){
      while( sx >= 0 ){
        sx -= TUG.BG.mCanvas.width;
      }
      while( sx < 0 ){
        sx += TUG.BG.mCanvas.width;
      }
      let w  = Math.min( TUG.mWidth , TUG.BG.mCanvas.width  - sx );
      TUG.GR.mG.drawImage( TUG.BG.mCanvas, sx, sy, w, h, x, y, w, h );
      sx += w;
      x += w;
    }
    sy += h;
    y += h;
  }
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