//const
const URLDATA = './data.json'

//DOM
const outputMonth = document.getElementById('outputMonth'),
	calendar = document.getElementById('calendar'),
	allDays = document.getElementById('allDays'),
	weektodayDOM = document.getElementById('today')

//DOM for modalWindow
const modal = document.querySelector('.modal'),
	formModalWindow = document.querySelector('.form'),
	inputModalWindow = document.getElementById('input'),
	modalOverlay = document.getElementById('overlay')

let titleModalWindow = document.querySelector('.title')
// getMonth
let dateTime = new Date,
	currentMonth = dateTime.getMonth(),
	currentDay = dateTime.getDate(),
	weekToday = dateTime.getDay(),
	monthNow = dateTime.getMonth()

// helpers for modalWindow Input
let allEvents = []
let textOnModal

// if localStorageEvents = true 
const arrayItemLocalST = localStorage.getItem('events')

//const date 
const nowMonth = dateTime.getMonth()

if (arrayItemLocalST) {
	const temp = JSON.parse(arrayItemLocalST)
	allEvents = temp
}


const data = async (url) => {
	const resp = await fetch(url)
	const responce = await resp.json()
	getMonth(responce.months)
	for (let i = 0; i < allEvents.length; i++) {
		const item = allEvents[i]
		if (currentDay == item.day && nowMonth == item.month) {
			modal.classList.add('open')
			formModalWindow.classList.add('hide')
			viewModalTitle(item)
			allEvents.splice(i, 1);
			addToLocalStorage()
		}

	}
	getDays(responce.months)
	today()

}
data(URLDATA)
function getMonth(data) {
	if (currentMonth == data.length) {
		currentMonth = 0
	} else if (currentMonth <= 0) {
		currentMonth = 11
	}
	monthForEach(data, currentMonth)
}
function monthForEach(data, index) {
	data.forEach(item => {
		if (item.id == index) {
			outputMonth.textContent = item.name
		}
	})
}

function getDays(data) {
	allDays.innerHTML = ''
	data.forEach(item => {
		if (item.id == currentMonth) {
			for (let i = 1; i < item.days + 1; i++) {
				const day = document.createElement('div')
				day.classList.add('item')
				if (i < 10) {
					day.style.padding = '3px 9.4px'
					day.textContent = i
					allDays.appendChild(day)
				} else {
					day.textContent = i
					allDays.appendChild(day)
				}
			}
			if (allEvents) {
				allEvents.forEach(el => {
					if (el.month == currentMonth) {
						let allDaysEl = document.querySelectorAll('.item')
						allDaysEl.forEach(itemElem => {
							if (itemElem.textContent == el.day) {
								itemElem.style.backgroundColor = 'red'
							}
						})
					}
				})
			}
			// TODO: сделать возможность удаления событий.
		}

	})
}
//можно улучшить календарь путём расчитывания днейнедель


function today() {
	if (currentMonth !== monthNow) {
		const days = document.querySelectorAll('.item')
		for (let item of days) {
			if (currentDay == item.textContent) {
				item.classList.remove('active')
			}
		}
		weektodayDOM.textContent = ''
	} else {
		const days = document.querySelectorAll('.item')
		for (let item of days) {
			if (currentDay == item.textContent) {
				item.classList.add('active')
			}
		}
		getWeek()
	}



}
async function getWeek() {
	const resp = await fetch('./week.json')
	const responce = await resp.json()
	setWeek(responce.weeks)
}
function setWeek(data) {
	data.forEach(item => {
		if (weekToday == item.id) {
			weektodayDOM.textContent = 'Сегодня: ' + item.name
		}
	})

}

let textTemp = ''

function openChangeEvent(element) {
	if (element.style.backgroundColor == 'red') {
		modal.classList.add('open')
		formModalWindow.classList.add('hide')
		allEvents.forEach(item => {
			if (element.textContent == item.day && item.month == currentMonth) {
				viewModalTitle(item)
			}
		})
	} else {
		titleModalWindow.textContent = 'Событие не заданно: '
		formModalWindow.classList.remove('hide')
		element.style.backgroundColor = 'red'
		modal.classList.add('open')
		textTemp = element.textContent
	}

}
function viewModalTitle(item) {
	let temp
	if (item.month < 10) {
		temp = '0' + item.month
	} else {
		temp = item.month
	}

	titleModalWindow.textContent = `Событие на ${item.day}.${temp}: ${item.text}`
}

//listeners for modalWindow
formModalWindow.addEventListener('submit', e => {
	sentEvent(e)
})
modalOverlay.addEventListener('click', () => {
	modal.classList.remove('open')
})

////// create array Events
function sentEvent(e) {
	e.preventDefault()
	textOnModal = inputModalWindow.value
	allEvents.push({ text: textOnModal, day: textTemp, month: currentMonth })
	inputModalWindow.value = ''
	modal.classList.remove('open')
	addToLocalStorage()
}

function addToLocalStorage() {
	const arrayItem = JSON.stringify(allEvents)
	const loc = localStorage.setItem('events', arrayItem)
}

calendar.addEventListener('click', e => {
	if (e.target.dataset.button == 'next') {
		currentMonth++
		data(URLDATA)
	}
	if (e.target.dataset.button == 'prev') {
		currentMonth--
		data(URLDATA)
	}
	if (e.target.className == 'item' || e.target.className == 'item active') {
		openChangeEvent(e.target)
	}

})