"use strict";

const CHRHEIGHT = 9;                        //  キャラの高さ
const CHRWIDTH   = 8;                       // キャラの幅 
// const FONT    = "12px 'monospace'";      // 使用フォント
// const FONT    = "12px 'Ricty Diminished'";  // 使用フォント
const FONTSTYLE  = "#FFFFFF";               // 文字色
const HEIGHT     = 180;                     // 仮想画面サイズ：高さ
const WIDTH      = 240;                     // 仮想画面サイズ：幅
const INTERVAL   = 33;                      // フレーム呼び出し間隔
const MAP_HEIGHT = 32;                      // マップ高さ
const MAP_WIDTH  = 32;                      // マップ幅
const SCROLL     = 1;                       // スクロール速度
const START_HP   = 20;                      // 開始HP
const START_X    = 15;                      // 開始位置X
const START_Y    = 17;                      // 開始位置Y
const TILECOLUMN = 4;                       // タイル桁数
const TILEROW    = 4;                       // タイル行数
const TILESIZE   = 8;                       // タイルサイズ（ドット）
const WNDSTYLE   = "rgba( 0, 0, 0, 0.75)";  // ウィンドウの色

let gAngle = 0;                                   // プレイヤーの向き
let gEx = 0;                                      // プレイヤーの経験値
let gHP = START_HP;                               // プレイヤーのHP
let gMHP = START_HP;                              // プレイヤーの最大HP
let gLv = 1;                                      // プレイヤーのレベル
let gCursor = 0;                                  // カーソル位置
let gEnemyHP;                                     // 敵HP
let gEnemyType;                                   // 敵種別
let gFrame = 0;                                   // 内部カウンタ.
let gImgBoss;                                     // 画像 ラスボス
let gImgMap;                                      // 画像 マップ
let gImgMonster;                                  // 画像 モンスター
let gImgPlayer;                                   // 画像 プレイヤー
let gItem  = 0;                                   // 所持アイテム
let gMessage1 = null;                             // 表示メッセージ1行目
let gMessage2 = null;                             // 表示メッセージ2行目
let gMoveX = 0;                                   // 移動量X
let gMoveY = 0;                                   // 移動量Y
let gOrder                                         // 行動順
let gPhase = 0;                                   // 戦闘フェーズ
let gPlayerX = START_X * TILESIZE + TILESIZE /2;  // プレイヤー座標X
let gPlayerY = START_Y * TILESIZE + TILESIZE /2;  // プレイヤー座標Y

const gFileBoss    = "img/boss.png";
const gFileMap     = "img/map.png";
const gFileMonster = "img/monster.png";
const gFilePlayer  = "img/player.png";

const gEncounter = [ 0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0 ]; // 敵エンカウント確率
const gMonsterName =[ "スライム", "うさぎ", "ナイト", "ドラゴン", "魔王"]; // モンスターの名称

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
 
 // 戦闘行動処理
 function Action()
 {
  gPhase++;                                   // フェーズ経過

  if ( ( ( gPhase + gOrder ) & 1 ) == 0 ){                       // 敵の行動順の場合
    const  d = GetDamage( gEnemyType + 2 );
    SetMessage( gMonsterName[ gEnemyType ] + "の攻撃！", d + "のダメージ！");
    gHP -= d;                               // プレイヤーのHP減少
    if( gHP <= 0 ){                         // プレイヤーが死亡した場合
      gPhase = 7;                           // 死亡フェーズ
    }
    return;
  }
  
  // プレイヤーの行動順
  if( gCursor == 0 ){                         // 「戦う」選択時
    const  d = GetDamage( gLv + 1 );          // ダメージ計算結果取得
    SetMessage("あなたの攻撃！", d + "のダメージ！" );
    gEnemyHP -= d;
    if( gEnemyHP <= 0 ){
      gPhase = 5;
    }
    return;
  }

  if( Math.random() < 0.5 ) {                 // 「逃げる」成功時
    SetMessage("あなたは逃げ出した！", null );
    gPhase = 6;
    return;
  }
  // 「逃げる」失敗時
  SetMessage("あなたは逃げ出した！", "しかし回り込まれた！" );
 }

// 経験値加算
function AddExp( val )
{
  gEx += val;                                           // 経験値加算
  while( gLv * (gLv + 1) * 2 <= gEx ){                    // レベルアップ条件を満たしている場合
    gLv++;                                              // レベルアップ
    gMHP += 4 + Math.floor( Math.random() * 3 );        // 最大HP上昇4〜6
  }
}

// 敵出現処理
function AppearEnemy( t )
{
  gPhase = 1;                                 // 敵出現フェーズ
  gEnemyHP = t * 3 + 5;                       // 敵HP
  gEnemyType = t;
  SetMessage( "敵が現れた！", null );
}


// 戦闘コマンド
function CommandFight()
{
  gPhase = 2;             // 戦闘コマンド選択フェーズ
  gCursor = 0;
  SetMessage("  戦う","  逃げる");
}

// 戦闘画面処理
function DrawFight( g )
{
  g.fillStyle = "#000000";                              // 背景色
  g.fillRect( 0, 0, WIDTH, HEIGHT);                     // 画面全体を矩形描画

  if( gPhase <= 5 ){     // 敵が生存している場合
    if( IsBoss() ){   // ラスボスの場合
      g.drawImage( gImgBoss, WIDTH / 2 - gImgBoss.width /2, HEIGHT / 2 ^gImgBoss.height /2 );     // ↓
    }else{
      let w = gImgMonster.width / 4;
      let h = gImgMonster.height;
      g.drawImage( gImgMonster, gEnemyType * w, 0, w, h, Math.floor( WIDTH / 2 ), Math.floor( HEIGHT / 2 ), w,h );     // ↓
    }
  }  
}

// フィールド画面描画
function DrawField( g )
{
  // プレイヤー
  g.drawImage( gImgPlayer,
               ( gFrame >> 4 & 1) * CHRWIDTH, gAngle * CHRHEIGHT, CHRWIDTH, CHRHEIGHT,
              WIDTH / 2 - CHRWIDTH / 2, HEIGHT / 2 - CHRHEIGHT + TILESIZE / 2 , CHRWIDTH, CHRHEIGHT);
}

// メッセージ描画
function DrawMessage( g )                     
{
  if( !gMessage1 ) {                             // メッセージ内容が存在しない場合
    return;
  }

  TUG.TX.fillRect( 4, 84, 120, 30, WNDSTYLE );

  //g.fillStyle = WNDSTYLE;                     // ウィンドウの色
  //g.fillRect( 4, 84, 120, 30 );               // 矩形描画

  // g.font = FONT;                                // 文字フォントを設定
  g.fillStyle = FONTSTYLE;                      // 文字色

  // g.fillText( gMessage1, 6,  96 );               // メッセージ1行目描画
  TUG.TX.fillText( gMessage1, 6,  96 );               // メッセージ1行目描画
  if( gMessage2 ){
    // g.fillText( gMessage2, 6, 110 );             // メッセージ2行目描画
    TUG.TX.fillText( gMessage2, 6, 110 );             // メッセージ2行目描画
  }

}

// ステータス描画
function DrawStatus( g )
{
  // g.font = FONT;                                // 文字フォントを設定
  g.fillStyle = FONTSTYLE;                      // 文字色
  TUG.TX.fillText( "Lv", 4, 13 ); DrawTextR( g, gLv, 36,13 ); // Lv
  TUG.TX.fillText( "HP", 4, 25 ); DrawTextR( g, gHP, 36,25 ); // HP
  TUG.TX.fillText( "Ex", 4, 37 ); DrawTextR( g, gEx, 36,37 ); // Ex
}

function DrawTextR( g, str, x, y )
{
  g.textAlign = "right";
  TUG.TX.fillText( str, x, y );
  g.textAlign = "left";
}

function DrawTile( g, x, y, idx )
{
  const ix = ( idx % TILECOLUMN ) * TILESIZE;
  const iy = Math.floor( idx / TILECOLUMN ) * TILESIZE;
  g.drawImage( gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE );
}

// ダメージ量算出
function GetDamage( a )
{
  return( Math.floor( a * ( 1 + Math.random() ) ) ); // 攻撃力の1~2倍
}

function IsBoss()
{
  return( gEnemyType == gMonsterName.length - 1 );
}

function LoadImage()
{
  gImgBoss    = new Image();  gImgBoss.src    = gFileBoss;    // ラスボス画像読み込み
  gImgMonster = new Image();  gImgMonster.src = gFileMonster; // モンスター画像読み込み
  gImgPlayer  = new Image();  gImgPlayer.src  = gFilePlayer;  // プレイヤー画像読み込み
  gImgMap     = new Image();  gImgMap.src     = gFileMap;     // マップ画像読み込み
  gImgMap.onload = function()
  {
    for( let y = 0; y < MAP_HEIGHT; y++){
      for( let x = 0; x < MAP_WIDTH; x++){
        TUG.BG.setVal( x, y, gMap[ y * MAP_WIDTH + x ] );
      }
    }
  }

}

// メッセージ描画
function SetMessage( v1, v2)
{
  gMessage1 = v1;
  gMessage2 = v2;
}

// フィールド進行処理
function TickField()
{
  if ( gPhase !=0 ){
    return;
  }

  if( gMoveX !=0 || gMoveY !=0 || gMessage1 ){}            // 移動中又はメッセージ表示中はキャンセル
  else if( TUG.mKey[ 37 ] ){ gAngle = 1; gMoveX = -TILESIZE; }   // 左
  else if( TUG.mKey[ 38 ] ){ gAngle = 3; gMoveY = -TILESIZE; }   // 上
  else if( TUG.mKey[ 39 ] ){ gAngle = 2; gMoveX =  TILESIZE; }   // 右
  else if( TUG.mKey[ 40 ] ){ gAngle = 0; gMoveY =  TILESIZE; }   // 下

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
      gHP = gMHP                            // HP全回復
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
      AppearEnemy( gMonsterName.length - 1 );
    }

    if( Math.random() * 8 < gEncounter[ m ] ){    // ランダムエンカウント
      let t = Math.abs( gPlayerX / TILESIZE - START_X ) +
              Math.abs( gPlayerY / TILESIZE - START_Y );
      if( m == 6 ){     // マップタイプが林だった場合
        t += 8;                                   // 敵レベルを0.5上昇
      }
      if( m == 7 ){     // マップタイプが山だった場合
        t += 16;                                  // 敵レベルを1上昇
      }
      t += Math.random() * 8;                     // 敵レベルを0~0.5上昇
      t = Math.floor( t / 16 );
      t = Math.min( t, gMonsterName.length - 2 ); // 上限処理
      AppearEnemy( t );
    }
  }

  gPlayerX += TUG.Sign( gMoveX ) * SCROLL;            // プレイヤー座標移動X
  gPlayerY += TUG.Sign( gMoveY ) * SCROLL;            // プレイヤー座標移動X
  gMoveX -= TUG.Sign( gMoveX ) * SCROLL;              // 移動料消費X
  gMoveY -= TUG.Sign( gMoveY ) * SCROLL;              // 移動料消費X

  // マップループ処理
  gPlayerX += ( MAP_WIDTH  * TILESIZE );
  gPlayerX %= ( MAP_WIDTH  * TILESIZE );
  gPlayerY += ( MAP_HEIGHT * TILESIZE );
  gPlayerY %= ( MAP_HEIGHT * TILESIZE );

  TUG.BG.mX = gPlayerX - WIDTH / 2;
  TUG.BG.mY = gPlayerY - HEIGHT / 2;

}


TUG.onPaint = function( g, tx )
{
 
  if(gPhase <= 1 ){
    DrawField( g );                                     // フィールド画面描画
  }else{
    DrawFight( g );
  }

  // ステータスウィンドウ
  // tx.fillStyle = WNDSTYLE;                     // ウィンドウの色
  TUG.TX.fillRect( 2, 2, 44, 37, WNDSTYLE );               // 矩形描画
  
  DrawStatus( tx );                                      // ステータス描画
  DrawMessage( tx );                                     // メッセージ描画

  if( gPhase == 2) {                                    // 戦闘フェーズがコマンド選択中の場合
    TUG.TX.fillText( "➡︎", 6, 96 + 14 * gCursor );                 // カーソル描画
  }
} 

//タイマーイベント発生時の処理
//function WmTimer()
TUG.onTimer = function()
{
  if( gMessage1 ){
    return;
  }
  gFrame++;                     // 内部カウンタを加算
  TickField();              // フィールド進行処理
}


TUG.onKeyDown = function( c )
{
  if ( gPhase == 1 ){       // 敵が現れた場合
    CommandFight();         // 戦闘コマンド選択フェーズ
    SetMessage("  戦う","  逃げる");
    return;
  }

  if( gPhase ==2 ){           // 戦闘コマンド選択中の場合
    if( c == 13 || c == 90 ){ // Enterキー、又はZキーの場合
      gOrder = Math.floor( Math.random() * 2 );  // 戦闘行動順
      Action();               // 戦闘行動処理
    }else{
      gCursor= 1 - gCursor;  // カーソル移動
    }
    return;
  }
  if( gPhase == 3 ){
    Action();                 // 戦闘行動処理
    return;
  }

  if( gPhase == 4 ){
    CommandFight();         // 戦闘コマンド
    return;
  }

  if( gPhase == 5 ){
    gPhase = 6;
    SetMessage( "敵をやっつけた！", null );
    AddExp( gEnemyType + 1 ); //経験値加算
    return;
  }

  if( gPhase == 6 ){
    if ( IsBoss() && gCursor == 0){     // 敵がラスボスで、且つ「戦う」選択時
      SetMessage( "魔王を倒し", "世界に平和が訪れた" );
      return;
    }
    gPhase = 0;           // マップ移動フェーズ
  }

  if( gPhase == 7 ){
    gPhase = 8;
    SetMessage( "あなたは死亡した", null );
    return;
  }

  if( gPhase == 8 ){
    SetMessage( "ゲームオーバー", null );
    return;
  }

  gMessage1 = null;
  
}

//ブラウザ起動イベント
window.onload = function()
{
  TUG.init( "main" );
  
  LoadImage();
}

