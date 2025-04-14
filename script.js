const allInsects = [
  // レア度1
  { name: 'カブトムシ', img: 'images/kabuto.png', hand: 'paper', rarity: 1, hp: 100, atk: 30 },
  { name: 'ノコギリクワガタ', img: 'images/kuwa.png', hand: 'scissors', rarity: 1, hp: 100, atk: 30 },
  { name: 'ニジイロクワガタ', img: 'images/niji.png', hand: 'rock', rarity: 1, hp: 100, atk: 30 },
  // レア度2
  { name: 'アトラスオオカブト', img: 'images/atlas.png', hand: 'paper', rarity: 2, hp: 120, atk: 35 },
  { name: 'ミヤマクワガタ', img: 'images/miyama.png', hand: 'scissors', rarity: 2, hp: 120, atk: 35 },
  { name: 'ヒラタクワガタ', img: 'images/hirata.png', hand: 'rock', rarity: 2, hp: 120, atk: 35 },
  // レア度3
  { name: 'コーカサスオオカブト', img: 'images/kokasasu.png', hand: 'paper', rarity: 3, hp: 140, atk: 40 },
  { name: 'セアカフタマタクワガタ', img: 'images/seaka.png', hand: 'scissors', rarity: 3, hp: 140, atk: 40 },
  { name: 'オオクワガタ', img: 'images/ookuwa.png', hand: 'rock', rarity: 3, hp: 140, atk: 40 },
  // レア度4
  { name: 'ヘラクレスオオカブト', img: 'images/hera.png', hand: 'paper', rarity: 4, hp: 160, atk: 45 },
  { name: 'ギラファノコギリクワガタ', img: 'images/girafa.png', hand: 'scissors', rarity: 4, hp: 160, atk: 45 },
  { name: 'エレファスゾウカブトムシ', img: 'images/elephas.png', hand: 'rock', rarity: 4, hp: 160, atk: 45 },
];

let player = null;
let cpu = null;
let cpuLevel = 1;
let gameOver = false;
let playerHP = 0;
let cpuHP = 0;
let battleStarted = false;

function pullGacha() {
  const result = allInsects[Math.floor(Math.random() * allInsects.length)];
  player = result;
  playerHP = result.hp;

  document.getElementById('playerImage').src = result.img;
  document.getElementById('playerImage').style.marginBottom = '20px';
  document.getElementById('playerName').innerHTML = `<div class='rank'>[★${result.rarity}]<br>${result.name}</div>`;

  document.getElementById('gacha-result').textContent = '';

  generateCpu();

  gameOver = false;
  battleStarted = false;
  document.getElementById('result').textContent = '';
  document.getElementById('specialMoveText').textContent = '';
  document.getElementById('resetBtn').style.display = 'inline-block';
  document.getElementById('nextBattleBtn').style.display = 'none';
  document.getElementById('startBattleBtn').style.display = 'inline-block';
  document.getElementById('gachaButton').style.display = 'none';
  updateHPBars();
}

function generateCpu() {
  const cpuCandidate = allInsects[Math.floor(Math.random() * allInsects.length)];
  cpu = {
    ...cpuCandidate,
    hp: cpuCandidate.hp + cpuLevel * 10,
    atk: cpuCandidate.atk + cpuLevel * 5,
  };
  cpuHP = cpu.hp;

  document.getElementById('cpuImage').src = cpu.img;
  document.getElementById('cpuImage').style.marginBottom = '20px';
  document.getElementById('cpuName').innerHTML = `<div class='rank'>[★${cpu.rarity} Lv${cpuLevel}]<br>${cpu.name}</div>`;
}

function startBattle() {
  if (player && cpu) {
    battleStarted = true;
    document.getElementById('startBattleBtn').style.display = 'none';
  }
}

function playGame(playerMove) {
  if (!player || !cpu || gameOver || !battleStarted) return;

  const moves = ['rock', 'scissors', 'paper'];
  const cpuMove = moves[Math.floor(Math.random() * 3)];
  let resultText = '';
  let playerAtk = player.atk;
  let cpuAtk = cpu.atk;

  if (
    playerMove === player.hand &&
    (playerMove === 'rock' && cpuMove === 'scissors' ||
     playerMove === 'scissors' && cpuMove === 'paper' ||
     playerMove === 'paper' && cpuMove === 'rock')
  ) {
    playerAtk *= 2;
    document.getElementById('specialMoveText').textContent = '必殺技!!';
  } else {
    document.getElementById('specialMoveText').textContent = '';
  }

  if (playerMove === cpuMove) {
    resultText = 'あいこ';
  } else if (
    (playerMove === 'rock' && cpuMove === 'scissors') ||
    (playerMove === 'scissors' && cpuMove === 'paper') ||
    (playerMove === 'paper' && cpuMove === 'rock')
  ) {
    cpuHP -= playerAtk;
    if (cpuHP < 0) cpuHP = 0;
    resultText = `勝利！　相手に${playerAtk}ダメージ`;
  } else {
    playerHP -= cpuAtk;
    if (playerHP < 0) playerHP = 0;
    resultText = `敗北！　自分は${cpuAtk}ダメージ`;
  }

  updateHPBars();
  document.getElementById('result').textContent = resultText;

  if (playerHP <= 0 || cpuHP <= 0) {
    gameOver = true;
    if (cpuHP <= 0) {
      cpuLevel += 1;
      document.getElementById('nextBattleBtn').style.display = 'inline-block';
    }
    document.getElementById('resetBtn').style.display = 'inline-block';
  }
}

function nextBattle() {
  cpuLevel++;
  generateCpu();
  playerHP = player.hp;
  cpuHP = cpu.hp;
  gameOver = false;
  battleStarted = false;
  document.getElementById('result').textContent = '';
  document.getElementById('specialMoveText').textContent = '';
  document.getElementById('resetBtn').style.display = 'inline-block';
  document.getElementById('nextBattleBtn').style.display = 'none';
  document.getElementById('startBattleBtn').style.display = 'inline-block';
  updateHPBars();
}

function updateHPBars() {
  const playerMax = player ? player.hp : 100;
  const cpuMax = cpu ? cpu.hp : 100;

  document.getElementById('playerHP').style.width = (100 * playerHP / playerMax) + '%';
  document.getElementById('playerDamage').style.width = (100 * (playerMax - playerHP) / playerMax) + '%';

  document.getElementById('cpuHP').style.width = (100 * cpuHP / cpuMax) + '%';
  document.getElementById('cpuDamage').style.width = (100 * (cpuMax - cpuHP) / cpuMax) + '%';
}
