const ゲーム盤の行の数 = 13;  // ゲーム盤の大きさ
const ゲーム盤の列の数 = 13;
const マスの大きさ = 25;      // ゲーム盤のマスの大きさ
const ゲーム盤の位置x = 30; // ゲーム盤の表示位置
const ゲーム盤の位置y = 30;
const キャンバスの幅 = 400;   // キャンバスの大きさ
const キャンバスの高さ = 400;

let 爆弾;       // ゲーム盤上の爆弾を表す変数
let 開いたマス; // ゲーム盤上の開いたマスを表す変数
let 旗;         // ゲーム盤上の旗表す変数
// ゲームの状態ゲームの状態表す変数。以下の3種類の文字列を代入する
// "ゲーム中":       ゲームのプレイ中を表す
// "ゲームオーバー": ゲームオーバーを表す
// "クリア":         ゲームをクリアしたことを表す
let ゲームの状態;
window.onload = function () {
  // キャンバスの要素オブジェクトを取得する
  canvas = document.getElementById("キャンバス");
  // キャンバスの大きさを変更する
  canvas.width = キャンバスの幅;
  canvas.height = キャンバスの高さ;
  // 2次元の描画コンテキストを取得する
  ctx = canvas.getContext("2d");

  // キャンバスをクリックした時のイベントハンドラの設定
  canvas.onclick = function () {
    // クリックした場所の、ゲーム盤上の座標を計算する
    let x = Math.floor((event.offsetX - ゲーム盤の位置x) / マスの大きさ);
    let y = Math.floor((event.offsetY - ゲーム盤の位置y) / マスの大きさ);
    // (x, y) がゲーム盤の中にある場合だけクリック処理を呼び出す
    if (ゲーム盤内のマスかどうか(x, y) === true) {
      クリック処理(x, y);
    }
  };
  // キャンバスで右クリックした時のイベントハンドラの設定
  canvas.oncontextmenu = function () {
    // 旗を立てる処理を呼び出す
    let x = Math.floor((event.offsetX - ゲーム盤の位置x) / マスの大きさ);
    let y = Math.floor((event.offsetY - ゲーム盤の位置y) / マスの大きさ);
    // (x, y) がゲーム盤の中にある場合だけクリック処理を呼び出す
    if (ゲーム盤内のマスかどうか(x, y) === true && ゲームの状態 === "ゲーム中") {
      旗を立てる処理(x, y);
    }
    // メニューが表示されないようにする;
    return false;
  };

  // リセットボタンをクリックした時にゲーム初期化処理を呼び出すようにする
  document.getElementById("リセットボタン").onclick = ゲーム初期化処理;
  // ウェブページを読み込んだ時（window.onload)にゲーム初期化処理を呼び出す
  ゲーム初期化処理();
};

function クリック処理(x, y) {
  // "ゲーム中"以外の時は、return文で、この関数の処理を終了する
  if (ゲームの状態 !== "ゲーム中") {
    return;
  }

  開いたマス[x][y] = true;
  // 開いたマスが爆弾の場合は、ゲームの状態を"ゲームオーバー"にする
  if (爆弾[x][y]) {
    ゲームの状態 = "ゲームオーバー";
  }
  全ての周囲のマスを開く();
  ゲーム盤の表示の更新();
}

// 引数(x, y)のセルの上で、右クリックした時に実行される関数
function 旗を立てる処理(x, y) {
  // (x, y)の旗を反転させる処理を記述する
  旗[x][y] = !旗[x][y];

  ゲーム盤の表示の更新();
}

// ゲームを新しく開始する際の初期化処理を行う関数
function ゲーム初期化処理() {
  // ゲーム盤上の爆弾をすべてクリアする。開いたマスも同様にクリアする
  // 爆弾と開いたマスと旗を空の配列で初期化する
  爆弾 = [];
  開いたマス = [];
  旗 = [];
  // 各列に対する繰り返し処理を行う
  for (let x = 0; x < ゲーム盤の列の数; x++) {
    // x列の要素に空の配列を代入する
    爆弾[x] = [];
    開いたマス[x] = [];
    旗[x] = [];
    // x列の各行に対する繰り返し処理を行う
    for (let y = 0; y < ゲーム盤の行の数; y++) {
      // 全ての(x, y) の組み合わせで下記のプログラムが実行される
      // 結果として「爆弾」と「開いたマス」と「旗旗」のゲーム盤の全てのマスが false になる
      爆弾[x][y] = false;
      開いたマス[x][y] = false;
      旗[x][y] = false;
    }
  }

  let 爆弾の数;
  // どのラジオボタンがチェックされているかで配置する爆弾の数変える
  if (document.getElementById("易しい").checked) {
    // 易しい場合は全体のマスの10%だけ配置する
    爆弾の数 = ゲーム盤の行の数 * ゲーム盤の列の数 * 0.1;
  }
  else if (document.getElementById("普通").checked) {
    // 普通の場合は全体のマスの20%だけ配置する
    爆弾の数 = ゲーム盤の行の数 * ゲーム盤の列の数 * 0.2;
  }
  else {
    // 難しい場合は全体のマスの30%だけ配置する
    爆弾の数 = ゲーム盤の行の数 * ゲーム盤の列の数 * 0.3;
  }


  let 配置した爆弾の数 = 0;
  while (配置した爆弾の数 < 爆弾の数) {
    // 爆弾を1つランダムに配置する
    let x = サイコロを振る(ゲーム盤の列の数) - 1;
    let y = サイコロを振る(ゲーム盤の行の数) - 1;
    // 既に爆弾が（x, y）に配置済かどうかをチェックする
    if (爆弾[x][y] === false) {
      // 配置済でなければ、配置し、「配置した爆弾の数」数を1増やす
      爆弾[x][y] = true;
      配置した爆弾の数++;
    }
  }

  // ゲームの状態を"ゲーム中"で初期化する
  ゲームの状態 = "ゲーム中";

  // ゲーム盤の表示を更新する
  ゲーム盤の表示の更新();
}

//  ゲーム盤の表示を更新更新する
function ゲーム盤の表示の更新() {
  // キャンバスの描画をすべてクリアする
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ゲーム盤の枠を表示する
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.rect(ゲーム盤の位置x, ゲーム盤の位置y,
    ゲーム盤の列の数 * マスの大きさ,
    ゲーム盤の行の数 * マスの大きさ);
  ctx.stroke();

  // クリアまでの残りのマスの数を表す変数を「0」で初期化する
  let 残りのマスの数 = 0;
  // 繰り返しを入れ子にすることで、全てのマスに対して繰り返す
  for (let x = 0; x < ゲーム盤の列の数; x++) {
    for (let y = 0; y < ゲーム盤の行の数; y++) {
      // この中は、全ての(x, y)に対して1回ずつ実行される
      // (x, y)のマスの要素オブジェクトを取得する
      let 要素オブジェクト = document.getElementById(`${x},${y}`);
      let 塗りつぶしの色;
      let 表示する文字 = "";
      // (x, y) のマスが開いているかどうかをチェックする
      if (開いたマス[x][y] === false) {
        // マスが開いていなければ薄い灰色で塗りつぶす
        塗りつぶしの色 = "lightgray";
        // 閉じたマスで、爆弾がないマスの場合、「残りのマスの数」を1増やす
        if (爆弾[x][y] === false) {
          残りのマスの数++;
        }
        // 閉じたマスで、旗が立っている場合は薄い緑色で塗りつぶす
        if (旗[x][y]) {
          塗りつぶしの色 = "lightgreen";
        }
      }
      else {
        // マスが開いている場合の処理
        // (x, y) のマスに爆弾マスがなければ、そのマスを白で塗りつぶす
        if (爆弾[x][y] === false) {
          表示する文字 = 周囲の爆弾の数(x, y);
          塗りつぶしの色 = "white";
        }
        // そうでなければ、そのマスを赤で塗りつぶす
        else {
          塗りつぶしの色 = "red";
        }
      }
      // (x, y)のマスの左上の座標を計算する
      const マスの位置x = 要素オブジェクト;
      const マスの位置y = 要素オブジェクト;
      // マスを塗りつぶし、枠を描画する処理
      ctx.beginPath();
      ctx.fillStyle = 塗りつぶしの色;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      // マスを表す正方形の図形を登録する
      ctx.rect(ゲーム盤の位置x + x * マスの大きさ,
        ゲーム盤の位置y + y * マスの大きさ,
        マスの大きさ, マスの大きさ);
      // マスを塗りつぶす
      ctx.fill();
      // マスの枠を描画する
      ctx.stroke();
      // マスに文字列を描画する処理
      ctx.fillStyle = "black";
      ctx.font = "20px Century";
      // 文字列の描画位置は、文字列の左下の座標なので、
      // マスの真ん中に表示するために位置を少しずらす必要がある
      // ？？？は試行錯誤して調整すること
      ctx.fillText(表示する文字, マスの位置x + 10, マスの位置y + 10);
    }
  }

  // クリアまでの残りのマスが「0」の場合、ゲームの状態を"クリア"にする
  if (残りのマスの数 === 0) {
    ゲームの状態 = "クリア";
  }

  // ゲーム盤の上にメッセージを表示する
  let メッセージ;
  let メッセージの要素オブジェクト = document.getElementById("メッセージ");
  // ゲームの状態をチェックする
  if (ゲームの状態 === "ゲーム中") {
    // ゲーム中の場合のメッセージに、残りのマスを設定する
    メッセージ = `あと ${残りのマスの数} マス`;
  }
  else if (ゲームの状態 === "ゲームオーバー") {
    // ゲームオーバーのメッセージを設定する
    メッセージ = "Game Over";
  }
  else {
    // クリア時のメッセージを設定する
    メッセージ = "クリア！！";
  }
  // メッセージを表示する
  メッセージの要素オブジェクト.innerHTML = メッセージ;
}

function サイコロを振る(出目の最大値) {
  return Math.floor(Math.random() * 出目の最大値) + 1;
}

// 引数で指定した、(x, y) のマスの周囲8マスの爆弾の数を数え、
// 返り値として返す関数
function 周囲の爆弾の数(x, y) {
  // 周囲の爆弾の数を数を数えるための変数を「0」で初期化する
  let 爆弾の数 = 0;
  // 列方向の差分を表すカウンタ変数「dx」を使って -1 ～ 1 まで繰り返す
  for (let dx = -1; dx <= 1; dx++) {
    // 行方向の差分を表すカウンタ変数「dy」を使って -1 ～ 1 まで繰り返す
    for (let dy = -1; dy <= 1; dy++) {
      // 全ての(dx, dy) の組み合わせで下記のプログラムが実行される
      // 結果として、(x, y)に差分を加えた(x + dx, x + dy)のマスに
      // 対して下記のプログラムが実行される
      // 爆弾が存在しない場合に「爆弾の数」を1増やす
      if (ゲーム盤内のマスかどうか(x + dx, y + dy) && 爆弾[x + dx][y + dy]) {
        爆弾の数++;
      }
    }
  }
  return 爆弾の数;
}

// 引数(x, y)のマスが、ゲーム盤の中にある場合は「true」
// そうでなければ、「false」を返す関数
function ゲーム盤内のマスかどうか(x, y) {
  return 0 <= x && x < ゲーム盤の列の数 && 0 <= y && y < ゲーム盤の行の数;
}

// 引数(x, y)のマスの周囲の爆弾の数「0」の場合、周囲のマスを開き、開いた数を返す
function 周囲のマスを開く(x, y) {
  // 開いたマスの数を数える変数を「0」で初期化する
  let 開いたマスの数 = 0;
  if (周囲の爆弾の数(x, y) === 0) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (!(dx === 0 && dy === 0) && ゲーム盤内のマスかどうか(x + dx, y + dy)) {
          // 全ての(dx, dy) の組み合わせで下記のプログラムが実行される
          // 周囲8マスを開いたことにする
          if (開いたマス[x + dx][y + dy] === false) {
            // そのマスが開かれていない場合は、マスを開き、
            // 「開いたマスの数」に1を足す
            開いたマスの数++;
            開いたマス[x + dx][y + dy] = true;
          }
        }
      }
    }
  }
  // 開いたマスの数を返り値として返す
  return 開いたマスの数;
}

// 開いているマスで、周囲の爆弾の数が「0」の周囲のマスを全て開く
function 全ての周囲のマスを開く() {
  while (true) {
    // 新しく開いたマスの数を数える変数を「0」で初期化する
    let 新しく開いたマスの数 = 0;
    for (let x = 0; x < ゲーム盤の列の数; x++) {
      for (let y = 0; y < ゲーム盤の行の数; y++) {
        if (開いたマス[x][y] === true && 周囲の爆弾の数(x, y) === 0) {
          // 「周囲のマスを開く」を呼び出して、周囲のマスを開く
          // この関数は、開いたマスの数をを返すので、
          // その値値を「新しく開いたマスの数」に加算する
          新しく開いたマスの数 += 周囲のマスを開く(x, y);
        }
      }
    }
    if (新しく開いたマスの数 === 0) {
      break;
    }
  }
}

