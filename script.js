let bottles=[]
let selected=null
let history=[]
let seconds=0
let timer
let coins=50
let mode="normal"

const colors=["red","blue","green","yellow","purple","orange"]

// TIMER
function startTimer(){

clearInterval(timer)

seconds=0

timer=setInterval(()=>{

seconds++

let m=Math.floor(seconds/60)
let s=seconds%60

document.getElementById("timer").innerText=
String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")

},1000)

}

// LEVEL GENERATOR
function generateLevel(seed=null){

let arr=[]

colors.slice(0,4).forEach(c=>{
for(let i=0;i<4;i++) arr.push(c)
})

if(seed){

let random=seeded(seed)

arr.sort(()=>random()-0.5)

}else{

arr.sort(()=>Math.random()-0.5)

}

bottles=[[],[],[],[],[],[]]

let index=0

for(let i=0;i<4;i++){

for(let j=0;j<4;j++){

bottles[i].push(arr[index])
index++

}

}

startTimer()

}

function seeded(seed){

return function(){

seed=(seed*9301+49297)%233280
return seed/233280

}

}

// RENDER
function render(){

document.getElementById("coins").innerText="Coins: "+coins

const game=document.getElementById("game")

game.innerHTML=""

bottles.forEach((b,i)=>{

const div=document.createElement("div")

div.className="bottle"

if(i===selected) div.classList.add("selected")

b.forEach(c=>{

const w=document.createElement("div")
w.className="water "+c

div.appendChild(w)

})

div.onclick=()=>selectBottle(i)

game.appendChild(div)

})

}

// SELECT
function selectBottle(i){

if(selected===null){

selected=i
render()
return

}

if(selected===i){

selected=null
render()
return

}

history.push(JSON.stringify(bottles))

pour(selected,i)

selected=null

render()

checkWin()

}

// POUR
function pour(a,b){

let from=bottles[a]
let to=bottles[b]

if(from.length===0||to.length===4) return

let color=from[from.length-1]

if(to.length===0||to[to.length-1]===color){

playSound(420)

to.push(from.pop())

}

}

// WIN
function checkWin(){

let win=true

bottles.forEach(b=>{

if(b.length===0) return
if(b.length!==4) win=false
if(!b.every(c=>c===b[0])) win=false

})

if(win){

playSound(800)

setTimeout(()=>{

alert("Challenge Complete!")

coins+=10

nextChallenge()

},200)

}

}

// MULTIPLE HINTS
function hint(){

if(coins<3){

alert("Need more coins")

return

}

coins-=3

for(let i=0;i<bottles.length;i++){

for(let j=0;j<bottles.length;j++){

if(i===j) continue

let a=bottles[i]
let b=bottles[j]

if(a.length===0||b.length===4) continue

let color=a[a.length-1]

if(b.length===0||b[b.length-1]===color){

alert("Hint: "+(i+1)+" → "+(j+1))
playSound(600)
render()
return

}

}

}

}

// UNDO
function undo(){

if(history.length===0) return

bottles=JSON.parse(history.pop())

render()

}

// MODES
function startNormal(){

mode="normal"
document.getElementById("mode").innerText="Normal"

generateLevel()

render()

}

function startDaily(){

mode="daily"
document.getElementById("mode").innerText="Daily"

let seed=Math.floor(Date.now()/86400000)

generateLevel(seed)

render()

}

function startWeekly(){

mode="weekly"
document.getElementById("mode").innerText="Weekly"

let seed=Math.floor(Date.now()/(86400000*7))

generateLevel(seed)

render()

}

// NEXT CHALLENGE
function nextChallenge(){

if(mode==="normal") generateLevel()

if(mode==="daily"){

let seed=Math.floor(Date.now()/86400000)+1
generateLevel(seed)

}

if(mode==="weekly"){

let seed=Math.floor(Date.now()/(86400000*7))+1
generateLevel(seed)

}

render()

}

// SOUND
function playSound(freq){

const ctx=new AudioContext()

const osc=ctx.createOscillator()

osc.frequency.value=freq
osc.type="triangle"

osc.connect(ctx.destination)

osc.start()

osc.stop(ctx.currentTime+0.15)

}

// RESTART
function restart(){

generateLevel()
render()

}

// START
generateLevel()
render()