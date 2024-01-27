console.log('beging')
import { connect, io } from './_snowpack/pkg/socket.io-client.js'

const socket = io('http://localhost:3000')

let room_id = ''
let message = ''
let messagelist = undefined
const secondlightcolor = generateLightColor()
const firstlightcolor = generateLightColor()
let roomsarray = []
let control1 = 0
let control2 = 0
let control3 = 0
let control4 = 0
let numrooms = 0

//when clien make a put request  on the room button
document
  .getElementById('roominput')
  .addEventListener('keydown', function (event) {
    if (event.key === 'c' && !event.shiftKey) {
      event.preventDefault()
      event.stopPropagation()
      handlinginfo()
    }
  })
document.getElementById('roombutton').addEventListener('touchend', e => {
  if ((e.target.id = 'roombutton')) {
    e.preventDefault()
    e.stopPropagation
    handlinginfo()
  }
})
document.getElementById('roombutton').addEventListener('click', e => {
  if ((e.target.id = 'roombutton')) {
    e.preventDefault()
    e.stopPropagation
    handlinginfo()
  }
})
//handling the infos

function handlinginfo () {
  //getting the value of the room from the html element
  room_id = document.getElementById('roominput').value

  if (room_id && room_id.trim() !== '' && !/\s/.test(room_id)) {
    //Emitting the value of the room
    socket.emit('setroomId', room_id, (joined, roomid) => {
      if (joined) {
        console.log('the room id has changed', roomid)
      } else {
        console.log('the room id has not changed')
      }
    })
    //creating a room id element
    let roominfo = document.getElementById('roominfo')
    roominfo.textContent = room_id
    roominfo.classList.add('inforoom')
    document.getElementById('info').innerHTML = roominfo.outerHTML
  }
}
//generate color
function generateLightColor () {
  const min = 200
  const max = 255

  const randomColor = () => Math.floor(Math.random() * (max - min + 1) + min)

  const red = randomColor()
  const green = randomColor()
  const blue = randomColor()

  return `rgb(${red}, ${green}, ${blue})`
}

console.log(firstlightcolor, secondlightcolor)

//client changing his dom ad he receives the messages
function updatingmessages (list) {
  const options = {
    hour: '2-digit',
    minute: '2-digit'
  }

  console.log('present in message function', list)
  document.getElementById('messages_').textContent = ''
  for (let e of list) {
    const element = Object.values(e)
    //choosing client color
    let line = document.createElement('p')
    let sentime = document.createElement('div')
    line.classList.add('message')
    sentime.classList.add('sentime')
    if (element[1] === socket.id) {
      console.log(socket.id, element[0])
      document.documentElement.style.setProperty(
        '--firstcolor',
        firstlightcolor
      )
      document.documentElement.style.setProperty(
        '--secondcolor',
        secondlightcolor
      )
    } else {
      line.classList.add('messagec')
      sentime.classList.add('sentimec')
    }

    line.textContent = element[3]
    sentime.textContent = new Date(element[4]).toLocaleTimeString(
      'en-US',
      options
    )
    console.log(new Date(element[3]).toLocaleTimeString('en-US', options))
    sentime.style.width = `70px`
    document.getElementById('messages_').appendChild(line)
    line.appendChild(sentime)
  }
  console.log(
    'Before scrolling:',
    document.getElementById('displayarea').scrollTop
  )
  document.getElementById('displayarea').scrollTop =
    document.getElementById('displayarea').scrollHeight
  console.log(
    'After scrolling:',
    document.getElementById('displayarea').scrollTop
  )
}
// getting  messagelist for the server
socket.on('messagestoclient', mg => {
  messagelist = mg
  console.log(mg)
  updatingmessages(mg)
})
socket.on('messagest', objm => {
  console.log(objm.t)
  getfromothers(objm.m, objm.t)
})

function getfromothers (ms, tm) {
  const options = {
    hour: '2-digit',
    minute: '2-digit'
  }
  let line = document.createElement('p')
  let sentime = document.createElement('div')
  line.classList.add('message')
  sentime.classList.add('sentime')
  line.classList.add('messagec')
  sentime.classList.add('sentimec')
  line.textContent = ms
  console.log(tm)
  sentime.textContent = new Date(tm).toLocaleTimeString('en-US', options)
  console.log(new Date(tm).toLocaleTimeString('en-US', options))
  sentime.style.width = `70px`
  document.getElementById('messages_').appendChild(line)
  line.appendChild(sentime)
  console.log(
    'Before scrolling:',
    document.getElementById('displayarea').scrollTop
  )
  document.getElementById('displayarea').scrollTop =
    document.getElementById('displayarea').scrollHeight
  console.log(
    'After scrolling:',
    document.getElementById('displayarea').scrollTop
  )
}
// getting room ifo for the server

socket.on('numroom', (numroom, rooms) => {
  roomsarray = rooms
  numrooms = numroom
})
//send a message to the server
function sendMessage () {
  message = document.getElementById('textinput').value

  if (message) {
    console.log('control1', control1)
    control4++
    console.log('control2', control2)
    console.log('control3', control3)
    console.log('control4', control4)
    const time = new Date()

    console.log(numrooms, 'numroom')
    if (numrooms === 0) {
      alert('please join a room first')
    } else {
      socket.emit(
        'mymessage',
        message,
        time,
        roomsarray[2],
        (received, message_, currenttime_, roomid) => {
          if (received) {
            const options = {
              hour: '2-digit',
              minute: '2-digit'
            }
            let line = document.createElement('p')
            let sentime = document.createElement('div')
            line.classList.add('message')
            sentime.classList.add('sentime')
            document.documentElement.style.setProperty(
              '--firstcolor',
              firstlightcolor
            )
            document.documentElement.style.setProperty(
              '--secondcolor',
              secondlightcolor
            )
            line.textContent = message
            sentime.textContent = time.toLocaleTimeString('en-US', options)
            console.log(time.toLocaleTimeString('en-US', options))
            sentime.style.width = `70px`
            document.getElementById('messages_').appendChild(line)
            line.appendChild(sentime)
            console.log(
              'Before scrolling:',
              document.getElementById('displayarea').scrollTop
            )
            document.getElementById('displayarea').scrollTop =
              document.getElementById('displayarea').scrollHeight
            console.log(
              'After scrolling:',
              document.getElementById('displayarea').scrollTop
            )
            document.getElementById('textinput').value = ''
            document.getElementById('textinput').style.height = '19.2px'

            console.log(
              'data received',
              ' ',
              message_,
              ' ',
              currenttime_,
              ' ',
              roomid
            )
          } else {
            console.log('data not received')
          }
        }
      )
    }
  }
}

document
  .getElementById('textinput')
  .addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      control1++
      event.preventDefault() // Prevent the default behavior (line break)
      sendMessage() // Call the sendMessage function
    }
  })
document.getElementById('messagebutton').addEventListener('touchend', e => {
  if ((e.target.id = 'roombutton')) {
    control2++
    e.preventDefault()
    e.stopPropagation
    sendMessage()
  }
})
document.getElementById('messagebutton').addEventListener('click', e => {
  if ((e.target.id = 'roombutton')) {
    control3++
    e.preventDefault()
    e.stopPropagation
    sendMessage()
  }
})

document.getElementById('textinput').addEventListener('input', () => {
  console.log(document.getElementById('textinput').value)
  document.getElementById('textinput').style.height = '0px'
  document.getElementById('textinput').style.height =
    document.getElementById('textinput').scrollHeight + 'px'
})

console.log('envent has been targeted')
document.getElementById('scissorsbutton').addEventListener('touchend', game)
document.getElementById('rockbutton').addEventListener('click', game)
document.getElementById('rockbutton').addEventListener('touchend', game)
document.getElementById('paperbutton').addEventListener('click', game)
document.getElementById('paperbutton').addEventListener('touchend', game)
document.getElementById('scissorsbutton').addEventListener('click', game)
const rock = 'rock'
const paper = 'paper'
let yo = 0
let co = 0
const scissors = 'scissors'
let games = 3

function game (event) {
  event.preventDefault()

  const max = 3

  const randomInt = Math.floor(Math.random() * max) + 1

  // console.log(randomInt.toString());
  document.getElementById('computer').innerHTML = document.getElementById(
    randomInt.toString()
  ).outerHTML
  console.log(
    document.getElementById(event.currentTarget.id).querySelector('img')
      .outerHTML
  )
  let mychoice_img = document
    .getElementById(event.currentTarget.id)
    .querySelector('img').outerHTML
  let mychoice_alt = event.currentTarget
    .querySelector('img')
    .getAttribute('alt')
  let mychoice_id = event.currentTarget.querySelector('img').getAttribute('id')
  //console.log("my choice is" + mychoice_alt);

  //console.log(mychoice_id, randomInt.toString());

  if (randomInt.toString() === mychoice_id) {
    document.getElementById('actgamresult').innerHTML = 'Tie'
  } else {
    switch (mychoice_id) {
      case '1':
        switch (randomInt.toString()) {
          case '2':
            document.getElementById('actgamresult').innerHTML = 'Computer wins'
            co++
            break
          default:
            document.getElementById('actgamresult').innerHTML = 'You win'
            yo++
            break
        }
        break
      case '2':
        switch (randomInt.toString()) {
          case '1':
            document.getElementById('actgamresult').innerHTML = 'You win'
            yo++
            break

          default:
            document.getElementById('actgamresult').innerHTML = 'Computer wins'
            co++
            break
        }
        break
      default:
        switch (randomInt.toString()) {
          case '1':
            document.getElementById('actgamresult').innerHTML = 'Computer wins'
            co++
            break
          case '2':
            document.getElementById('actgamresult').innerHTML = 'You win'
            yo++
            break
          default:
            break
        }
        break
    }
  }

  setTimeout(() => {
    games += 1
    document.getElementById('round').innerHTML = `Round ${
      games - 3
    } <div id="R1" ></div>`
    document.getElementById('computer').innerHTML = null
    document.getElementById('actgamresult').innerHTML = null

    console.log(mychoice_img)
    document.getElementById(
      'previousgames'
    ).innerHTML += `<div id="${games}"> ${mychoice_img} ${
      document.getElementById(randomInt.toString()).outerHTML
    }  <div id="O${games}"></div> <div id="F${games}">${games - 3}</div></div>`

    function decoration () {
      document.getElementById(`${games}`).classList.add('decor')

      document.getElementById(`O${games}`).classList.add('decorO')
      document.getElementById(`F${games}`).classList.add('decorF')
      document.getElementById('R1').classList.add('decorO')

      // console.log(document.getElementById("R1").id);

      document.getElementById(
        'Y'
      ).innerHTML = ` <legend>You</legend>${yo} <div id="Y1" ></div>`
      document.getElementById(
        'C'
      ).innerHTML = ` <legend>Computer</legend>${co} <div id="C1" ></div>`
      document.getElementById('Y1').classList.add('decorO')

      document.getElementById('C1').classList.add('decorO')
    }
    switch (mychoice_id) {
      case '1':
        switch (randomInt.toString()) {
          case '2':
            decoration()
            document.getElementById(`O${games}`).style.background = 'red'
            document.getElementById('R1').style.backgroundColor = 'red'

            break
          case '1':
            decoration()

            document.getElementById(`O${games}`).style.background = 'lightgray'
            document.getElementById('R1').style.backgroundColor = 'lightgray'
            break
          default:
            decoration()
            document.getElementById(`O${games}`).style.background = 'green'
            document.getElementById('R1').style.backgroundColor = 'green'
            break
        }
        break
      case '2':
        switch (randomInt.toString()) {
          case '1':
            decoration()
            document.getElementById(`O${games}`).style.background = 'green'
            document.getElementById('R1').style.backgroundColor = 'green'
            break
          case '2':
            decoration()
            document.getElementById(`O${games}`).style.background = 'lightgray'
            document.getElementById('R1').style.backgroundColor = 'lightgray'
          default:
            decoration()
            document.getElementById(`O${games}`).style.background = 'red'
            document.getElementById('R1').style.backgroundColor = 'red'
            break
        }
        break
      default:
        switch (randomInt.toString()) {
          case '1':
            decoration()
            document.getElementById(`O${games}`).style.background = 'red'
            document.getElementById('R1').style.backgroundColor = 'red'
            break
          case '2':
            decoration()
            document.getElementById(`O${games}`).style.background = 'green'
            document.getElementById('R1').style.backgroundColor = 'green'
            break
          default:
            decoration()
            document.getElementById(`O${games}`).style.background = 'lightgray'
            document.getElementById('R1').style.backgroundColor = 'lightgray'
            break
        }
        break
    }

    if (yo == co) {
      document.getElementById('Y1').style.backgroundColor = 'lightgray'
      document.getElementById('C1').style.backgroundColor = 'lightgray'
    } else {
      if (yo > co) {
        document.getElementById('Y1').style.backgroundColor = 'green'
        document.getElementById('C1').style.backgroundColor = 'red'
      } else {
        document.getElementById('Y1').style.backgroundColor = 'red'
        document.getElementById('C1').style.backgroundColor = 'green'
      }
    }
  }, 1500)
  document.getElementById('R1').style.backgroundColor = 'white'
  document.getElementById('round').innerHTML = `Round ${
    games - 2
  } <div id="R1" ></div>`
}
