const monsterList = document.createElement('ul')
const backButton = document.getElementById('back')
const forwardButton = document.getElementById('forward')
const form = document.getElementById('monster-form')
const monsterArray = []
const arrayOfArrays = []
let buttonCounter = 0
monsterList.style.listStyle = 'none'
document.getElementById('monster-container').appendChild(monsterList)
window.addEventListener('DOMContentLoaded', handleInitialFetch)
function handleInitialFetch() {
    fetch('http://localhost:3000/monsters')
    .then(res => res.json())
    .then(monsters => {
        monsters.map(monster => buildMonsters(monster))
        divideMonsters()
        displayMonsters(0)
        backButton.disabled = true
        backButton.addEventListener('click', e => {
            removeMonsters(buttonCounter)
            displayMonsters(buttonCounter - 1)
            buttonCounter - 1 === 0 ? backButton.disabled = true : backButton.disabled = false
            forwardButton.disabled = false
            return buttonCounter -= 1
        })
        forwardButton.addEventListener('click', e => {
            removeMonsters(buttonCounter)
            displayMonsters(buttonCounter + 1)
            buttonCounter + 2 === arrayOfArrays.length ? forwardButton.disabled = true : forwardButton.disabled = false
            backButton.disabled = false
            return buttonCounter += 1
        })
    })
    form.addEventListener('submit', e => {
        e.preventDefault()
        const monsterObj = {
            name: document.getElementById('monster-name').value,
            age: document.getElementById('monster-age').value,
            description: document.getElementById('monster-bio').value
        }
        fetch('http://localhost:3000/monsters', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(monsterObj)
        })
        .then(res => res.json())
        .then(monster => {
            buildMonsters(monster)
            const newMonster = [...monsterArray][0]
            monsterArray.pop()
            const lastArray = arrayOfArrays[arrayOfArrays.length - 1]
            if (monsterList.childElementCount < 50) {
                lastArray.push(newMonster)
                monsterList.appendChild(newMonster)
            } else {
                lastArray.length < 50 ? lastArray.push(newMonster) : arrayOfArrays.push([newMonster]), forwardButton.disabled = false
            }
        })
        document.getElementById('monster-name').value = ''
        document.getElementById('monster-age').value = ''
        document.getElementById('monster-bio').value = ''
    })
}

function buildMonsters(monster) {
    const li = document.createElement('li')
    const h2 = document.createElement('h2')
    h2.textContent = monster.name
    li.appendChild(h2)
    const h4 = document.createElement('h4')
    h4.textContent = monster.age
    li.appendChild(h4)
    const p = document.createElement('p')
    p.textContent = monster.description
    li.appendChild(p)
    monsterArray.push(li)
}

function divideMonsters() {
    if (monsterArray.length % 50 !== 0) {
        arrayOfArrays.unshift(monsterArray.splice(-(monsterArray.length % 50)))
    }
    while (monsterArray.length !== 0) {
        arrayOfArrays.unshift(monsterArray.splice(-50))
    }
    for (let i = 0; i < arrayOfArrays.length; i++) {
        arrayOfArrays[i].map(monster => monster.className = `monster-list-${i}`)
    }
}
function displayMonsters(i) {
    arrayOfArrays[i].map(monster => monsterList.appendChild(monster))
}
function removeMonsters(i) {
    arrayOfArrays[i].map(monster => monster.remove())
}