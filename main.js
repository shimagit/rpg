"use strict";

const CHRHEIGHT  = 9;                       // キャラの高さ
const CHRWIDTH   = 8;                       // キャラの幅 
// const FONT    = "12px 'monospace'";        // 使用フォント
const FONT    = "12px 'Ricty Diminished'";        // 使用フォント
const FONTSTYLE  = "#FFFFFF";               // 文字色
const HEIGHT     = 120;                     // 仮想画面サイズ：高さ
const WIDTH      = 128;                     // 仮想画面サイズ：幅
const INTERVAL   = 33;                      // フレーム呼び出し間隔
const MAP_HEIGHT = 32;                      // マップ高さ
const MAP_WIDTH  = 32;                      // マップ幅
const SCR_HEIGHT = 8;                       // 画面タイルサイズの半分の高さ
const SCR_WIDTH  = 8;                       // 画面タイルサイズの半分の幅
const SCROLL     = 2;                       // スクロール速度
const SMOOTH     = 0;                       // 補間処理
const START_HP   = 20;                      // 開始HP
const START_X    = 15;                      // 開始位置X
const START_Y    = 17;                      // 開始位置Y
const TILECOLUMN = 4;                       // タイル桁数
const TILEROW    = 4;                       // タイル行数
const TILESIZE   = 8;                       // タイルサイズ（ドット）
const WNDSTYLE   = "rgba( 0, 0, 0, 0.75)";  // ウィンドウの色

const	gKey = new Uint8Array( 0x100 );		//	キー入力バッファ

let gAngle = 0;                                   // プレイヤーの向き
let gEx = 0;                                      // プレイヤーの経験値
let gHP = START_HP;                               // プレイヤーのHP
let gMHP = START_HP;                              // プレイヤーの最大HP
let gLv = 1;                                      // プレイヤーのレベル
let gFrame = 0;                                   // 内部カウンタ.
let gHeight                                       // 実画面の高さ
let gWidth                                        // 実画面の幅
let gMessage1 = null;                             // 表示メッセージ1行目
let gMessage2 = null;                             // 表示メッセージ2行目
let gMoveX = 0;                                   // 移動量量X
let gMoveY = 0;                                   // 移動量量Y
let gImgMap;                                      // 画像 マップ
let gImgMonster;                                  // 画像 モンスター
let gImgPlayer;                                   // 画像 プレイヤー
let gItem  = 0;                                   // 所持アイテム
let gPhase = 0;                                   // 戦闘フェーズ
let gPlayerX = START_X * TILESIZE + TILESIZE /2;  // プレイヤー座標X
let gPlayerY = START_Y * TILESIZE + TILESIZE /2;  // プレイヤー座標Y
let gScreen;                                      // 仮想画面

const gFileMap     = "img/map.png";
const gFileMonster = "img/monster.png";
const gFilePlayer  = "img/player.png";

const gEncounter = [ 0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0 ]; // 敵エンカウント確率

// マップ
const	gMap = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
  0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6,13, 6, 0, 0, 0,
  0, 3, 3,10,11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
  0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3,12, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
  7,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
 ];

// 戦闘画面処理
function DrawFight( g )
{
  g.fillStyle = "#000000";
  g.fillRect( 0, 0, WIDTH, HEIGHT);

  g.drawImage( gImgMonster, WIDTH /2, HEIGHT / 2 );
}


// マップ描画処理
function DrawMap( g )
{
  let   mx = Math.floor( gPlayerX / TILESIZE );     // プレイヤーのタイル座標X
  let   my = Math.floor( gPlayerY / TILESIZE );     // プレイヤーのタイル座標Y

  for( let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++ ){
    let ty = my + dy;                               // タイル座標Y
    let py = ( ty + MAP_HEIGHT ) % MAP_HEIGHT;      // ループ後タイル座標Y
    for( let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++ ){
      let tx = mx + dx                              // タイル座標X
      let px = ( tx + MAP_WIDTH  ) % MAP_WIDTH;     // ループ後タイル座標X
      DrawTile( g,
                tx * TILESIZE + WIDTH  /2 - gPlayerX,
                ty * TILESIZE + HEIGHT /2 - gPlayerY,
                gMap[ py * MAP_WIDTH + px ]);
    }
  }

  // プレイヤー
  g.drawImage( gImgPlayer,
               ( gFrame >> 4 & 1) * CHRWIDTH, gAngle * CHRHEIGHT, CHRWIDTH, CHRHEIGHT,
              WIDTH / 2 - CHRWIDTH / 2, HEIGHT / 2 - CHRHEIGHT + TILESIZE / 2 , CHRWIDTH, CHRHEIGHT);
}
function DrawMain()
{
  const g = gScreen.getContext( "2d" );             // 仮想画面の2D描画コンテキストを取得
  
  if(gPhase == 0 ){
    DrawMap( g );                                     // マップ描画
  }else{
    DrawFight( g );
  }
  // ステータスウィンドウ
  g.fillStyle = WNDSTYLE;                     // ウィンドウの色
  g.fillRect( 2, 2, 44, 37 );               // 矩形描画
  
  DrawStatus( g );                            // ステータス描画
  DrawMessage( g );                           // メッセージ描画
  
  /*
  g.fillStyle = WNDSTYLE;                     // ウィンドウの色
  g.fillRect( 20, 3, 105, 15 );               // 矩形描画   
  
  g.font = FONT;                              // 文字フォントを設定
  g.fillStyle = FONTSTYLE;                    // 文字色
  g.fillText("x=" + gPlayerX + " y=" + gPlayerY + " m=" + gMap[ my * MAP_WIDTH + mx ], 25, 15);
  */
}

// メッセージ描画
function DrawMessage( g )                     
{
  if( !gMessage1 ) {                             // メッセージ内容が存在しない場合
    return;
  }

  g.fillStyle = WNDSTYLE;                     // ウィンドウの色
  g.fillRect( 4, 84, 120, 30 );               // 矩形描画

  g.font = FONT;                                // 文字フォントを設定
  g.fillStyle = FONTSTYLE;                      // 文字色

  g.fillText( gMessage1, 6,  96 );               // メッセージ1行目描画
  if( gMessage2 ){
    g.fillText( gMessage2, 6, 110 );             // メッセージ2行目描画
  }
}

// ステータス描画
function DrawStatus( g )
{
  g.font = FONT;                                // 文字フォントを設定
  g.fillStyle = FONTSTYLE;                      // 文字色
  g.fillText( "Lv" + gLv, 4, 13 );              // Lv
  g.fillText( "HP" + gHP, 4, 25 );              // HP
  g.fillText( "Ex" + gEx, 4, 37 );              // Ex
}

function DrawTile( g, x, y, idx )
{
  const ix = ( idx % TILECOLUMN ) * TILESIZE;
  const iy = Math.floor( idx / TILECOLUMN ) * TILESIZE;
  g.drawImage( gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE );
}

function LoadImage()
{
  gImgMap     = new Image();  gImgMap.src     = gFileMap;     // マップ画像読み込み
  gImgMonster = new Image();  gImgMonster.src = gFileMonster; // モンスター画像読み込み
  gImgPlayer  = new Image();  gImgPlayer.src  = gFilePlayer;  // プレイヤー画像読み込み
}

// メッセージ描画
function SetMessage( v1, v2)
{
  gMessage1 = v1;
  gMessage2 = v2;
}

// IE対応
function Sign( val)
{
  if( val == 0 ){
    return( 0 );
  }
  if( val < 0 ){
    return( -1 );
  }
  return( 1 );
}


// フィールド進行処理
function TickField()
{

  if( gMoveX !=0 || gMoveY !=0 || gMessage1 ){}            // 移動中又はメッセージ表示中はキャンセル
  else if( gKey[ 37 ] ){ gAngle = 1; gMoveX = -TILESIZE; }   // 左
  else if( gKey[ 38 ] ){ gAngle = 3; gMoveY = -TILESIZE; }   // 上
  else if( gKey[ 39 ] ){ gAngle = 2; gMoveX =  TILESIZE; }   // 右
  else if( gKey[ 40 ] ){ gAngle = 0; gMoveY =  TILESIZE; }   // 下

  // 移動後のタイル座標判定
  let mx = Math.floor( ( gPlayerX + gMoveX ) / TILESIZE ); //移動後のタイル座標X
  let my = Math.floor( ( gPlayerY + gMoveY ) / TILESIZE ); //移動後のタイル座標Y
  mx += MAP_WIDTH;                            // マップリープ処理X  
  mx %= MAP_WIDTH;                            // マップリープ処理X  
  my += MAP_HEIGHT;                           // マップリープ処理Y  
  my %= MAP_HEIGHT;                           // マップリープ処理Y
  let m = gMap[ my * MAP_WIDTH + mx ];        // タイル番号
  if ( m < 3) {                               // 侵入不可の地形の場合
    gMoveX = 0;                               // 移動禁止x
    gMoveY = 0;                               // 移動禁止Y
  }

  if( Math.abs( gMoveX ) + Math.abs( gMoveY ) == SCROLL ){  // マス目移動が終わる直前
    if( m == 8 || m == 9 ){   // お城
      SetMessage( "魔王を倒して", null );
    }
  
    if( m == 10 || m == 11 ){   // 街
      SetMessage( "西の果てにも", "村があります" );
    }
  
    if( m == 12 ){   // 村
      SetMessage( "カギは、", "洞窟にあります" );
    }
  
    if( m == 13 ){   // 洞窟
      gItem = 1;     // カギ入手
      SetMessage( "カギを手に入れた", null );
    }
  
    if( m == 14 ){   // 扉
      if( gItem == 0 ){                   // カギを保持していない場合
        gPlayerY -= TILESIZE                //1マス上に戻る
        SetMessage( "カギが必要です", null );
      }else{
        SetMessage( "扉が開いた", null );
      }
    }
  
    if( m == 15 ){   // ボス
      SetMessage( "魔王を倒し", "世界に平和が訪れた" );
    }

    if( Math.random() * 4 < gEncounter[ m ] ){    // ランダムエンカウント
      gPhase = 1;                                 // 敵出現フェーズ
      SetMessage( "敵が現れた！", null);
    }
  }

  gPlayerX += Sign( gMoveX ) * SCROLL;            // プレイヤー座標移動X
  gPlayerY += Sign( gMoveY ) * SCROLL;            // プレイヤー座標移動X
  gMoveX -= Sign( gMoveX ) * SCROLL;              // 移動料消費X
  gMoveY -= Sign( gMoveY ) * SCROLL;              // 移動料消費X

  // マップループ処理
  gPlayerX += ( MAP_WIDTH  * TILESIZE );
  gPlayerX %= ( MAP_WIDTH  * TILESIZE );
  gPlayerY += ( MAP_HEIGHT * TILESIZE );
  gPlayerY %= ( MAP_HEIGHT * TILESIZE );

}


function WmPaint()
{
  DrawMain();

  const ca = document.getElementById("main"); // mainキャンバスの要素を取得
  const g  = ca.getContext("2d");             // 2D描画コンテキストを取得)
  
  g.drawImage( gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0,gWidth, gHeight ); // 仮想画面のイメージを実画面に転送
  
} 

// ブラウザサイズ変更イベント
function WmSize()
{
  const ca = document.getElementById("main"); // mainキャンバスの要素を取得
  ca.width = window.innerWidth;               // キャンバスの幅をブラウザの幅へ変更
  ca.height = window.innerHeight;             // キャンバスの高さをブラウザの高さへ変更
  
  const g  = ca.getContext("2d");             // 2D描画コンテキストを取得)
  g.imageSmoothingEnabled = g.imageSmoothingEnabled = SMOOTH;    // 補完処理
  // じつ画面サイズを計測。ドットのアスペクト比を維持したままでの最大サイズを計算する。
  gWidth = ca.width;
  gHeight =ca.height;
  if( gWidth / WIDTH < gHeight / HEIGHT){
    gHeight = gWidth * HEIGHT / WIDTH;
  }else{
    gWidth = gHeight * WIDTH /HEIGHT;
  }
}



//タイマーイベント発生時の処理
function WmTimer()
{
  gFrame++;                     // 内部カウンタを加算
  TickField();              // フィールド進行処理
  WmPaint();
}
// キー入力(DOWN)イベント
window.onkeydown = function( ev )
{
  let c = ev.keyCode;       // キーコード取得

  if( gKey[c] !=0 ){        // 既にキーを押下中の場合（キーリピート）
    return;
  }

  gKey[ c ] = 1;

  if ( gPhase == 1 ){
    gPhase = 0;
  }

  gMessage1 = null;
  
}

// キー入力(UP)イベント
window.onkeyup = function( ev )
{
  gKey[ ev.keyCode ] = 0;
}

//ブラウザ起動イベント
window.onload = function()
{
  LoadImage();

  gScreen = document.createElement( "canvas" ); // 仮想画面を作成
  gScreen.width = WIDTH;                        // 仮想画面の幅を設定
  gScreen.height = HEIGHT;                      // 仮想画面の高さを設定

  WmSize();                                     // 画面サイズ初期化
  window.addEventListener( "resize", function(){ WmSize() } );  //ブラウザサイズ変更時、WmSizeが呼ばれる様指示
  setInterval( function(){ WmTimer() },INTERVAL );    // 33ms感覚で、WmTimer()を呼び出す様に指示(役30fps)
}