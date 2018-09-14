'use strict';

// получить рандомное число
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// получить рандомное значение из массива с повтором
function getRandomValue(items) {
  var rand = Math.floor(Math.random() * items.length);
  var randomValue = items[rand];
  return randomValue;
}

// получить рандомный массив
function getRandomArray(items) {
  var randomArray = [];
  while (randomArray.length < items.length) {
    var randomValue = items[getRandomNumber(0, items.length)];
    if (randomArray.indexOf(randomValue) === -1) {
      randomArray.push(randomValue);
    }
  }
  return randomArray;
}

// получить рандомный массив
// function getRandomArray(items) {
//   var j;
//   var temp;
// 	for(var i = items.length - 1; i > 0; i--) {
//     j = Math.floor(Math.random() * (i + 1));
//     temp = items[j];
//     items[j] = items[i];
//     items[i] = temp;
// 	}
//   return items;
// }


// исходные данные
var COUNT_OFFERS = 8;
var MIN_ROOM = 1;
var MAX_ROOM = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 50;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ADDRESS = 0;
var MAX_ADDRESS = 600;
var LOCATION_X = {
  min: 300,
  max: 1000
};
var LOCATION_Y = {
  min: 130,
  max: 630
};
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var avatar = getRandomArray(['01', '02', '03', '04', '05', '06', '07', '08']);
var title = getRandomArray(['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде']);
var type = ['palace', 'flat', 'house', 'bungalo'];
var time = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


// создать массив из 8 объектов
var offers = [];
for (var i = 0; i < COUNT_OFFERS; i++) {

  var ticket = {

    author: {
      avatar: 'img/avatars/user' + avatar[i] + '.png'
    },

    offer: {
      title: title[i],
      address: getRandomNumber(MIN_ADDRESS, MAX_ADDRESS + 1) + ', ' + getRandomNumber(MIN_ADDRESS, MAX_ADDRESS + 1),
      price: getRandomNumber(MIN_PRICE, MAX_PRICE + 1),
      type: getRandomValue(type),
      rooms: getRandomNumber(MIN_ROOM, MAX_ROOM + 1),
      guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS + 1),
      checkin: getRandomValue(time),
      checkout: getRandomValue(time),
      features: getRandomArray(features).slice(getRandomNumber(0, 6)),
      description: '',
      photos: getRandomArray(photos)
    },

    location: {
      x: getRandomNumber(LOCATION_X.min, LOCATION_X.max + 1),
      y: getRandomNumber(LOCATION_Y.min, LOCATION_Y.max + 1)
    }

  };

  offers.push(ticket);
}

// перевести названия типов комнат
function changeNameType() {
  for (var i = 0; i < 8; i++) {
    var nameType = offers[i].offer.type;
    if (nameType === 'flat') {
      nameType = 'Квартира';
    } else if (nameType === 'bungalo') {
      nameType = 'Бунгало';
    } else if (nameType === 'house') {
      nameType = 'Дом';
    } else {
      nameType = 'Дворец';
    }
  }
  return nameType;
}

// склонение слова с разным количеством комнат
function changeTextWithRooms() {
  for (var i = 0; i < 8; i++) {
    var offerRooms = 'комнаты';
    var name = offers[i].offer.rooms;
    if (name === 1) {
      offerRooms = 'комната';
    }
    if (name === 5) {
      offerRooms = 'комнат';
    }
    return offerRooms;
  }
}

function makeElement(tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
}

function makeImg(tagName, className, url, width, height, desc) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  element.src = url;
  element.width = width;
  element.height = height;
  element.alt = desc;
  return element;
}


// создать метки
function renderPin(offers) {
  var pinElement = mapPinTemplate.cloneNode(true); // полностью клонировать шаблон

  pinElement.style = 'left: ' + (offers.location.x - PIN_WIDTH) + 'px; top: ' + (offers.location.y - PIN_HEIGHT) + 'px;';
  pinElement.querySelector('img').src = offers.author.avatar;
  pinElement.querySelector('img').alt = offers.offer.title;

  return pinElement;
}


// создать объявление
function renderCard(offers) {
  var cardElement = cardTemplate.cloneNode(true); // полностью клонировать шаблон

  var offerGuests = (offers.offer.guests === 1) ? 'гостя' : 'гостей';
  var offerFeatures = offers.offer.features;
  var listFeatures = cardElement.querySelector('.popup__features');
  var offerPhotos = offers.offer.photos;
  var listPhotos = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = offers.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offers.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offers.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offers.offer.checkin + ', выезд до ' + offers.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = offers.offer.description;
  cardElement.querySelector('.popup__avatar').src = offers.author.avatar;
  cardElement.querySelector('.popup__type').textContent = changeNameType(offers);
  cardElement.querySelector('.popup__text--capacity').textContent = offers.offer.rooms + ' ' + changeTextWithRooms(offers) + ' для ' + offers.offer.guests + ' ' + offerGuests;

  for (var i = 0; i < offerFeatures.length; i++) {
    var valueFeatures = offerFeatures[i];
    var elementFeatures = makeElement('li', 'popup__feature');
    elementFeatures.classList.add('popup__feature--' + valueFeatures);
    listFeatures.appendChild(elementFeatures);
  }

  for (var j = 0; j < offerPhotos.length; j++) {
    var valuePhotos = offerPhotos[j];
    var elementPhotos = makeImg('img', 'popup__photo', valuePhotos, '45', '40', 'Фотография жилья');
    listPhotos.appendChild(elementPhotos);
  }


  // 2 вариант добавления features
  // var offerFeatures = offers.offer.features;
  // var listFeatures = cardElement.querySelector('.popup__features');
  // for (var i = 0; i < offerFeatures.length; i++) {
  //   var valueFeatures = offerFeatures[i];
  //   var elementFeatures = document.createElement('li');
  //   elementFeatures.className = 'popup__feature popup__feature--' + valueFeatures;
  //   listFeatures.appendChild(elementFeatures);
  // }

  // 2 вариант добавления img
  // var offerPhotos = offers.offer.photos;
  // var listPhotos = cardElement.querySelector('.popup__photos');
  // for (var j = 0; j < offerPhotos.length; j++) {
  //   var valuePhotos = offerPhotos[j];
  //   var elementPhotos = document.createElement('img');
  //   elementPhotos.src = valuePhotos;
  //   elementPhotos.classList.add('popup__photo');
  //   elementPhotos.width = '45';
  //   elementPhotos.height = '40';
  //   elementPhotos.alt = 'Фотография жилья';
  //   listPhotos.appendChild(elementPhotos);
  // }

  return cardElement;
}


var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');

var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin'); // div с шаблоном

var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card'); // div с шаблоном

map.classList.remove('map--faded'); // сделать активной карту


// показать метки
var fragmentPin = document.createDocumentFragment();
for (var j = 0; j < offers.length; j++) {
  fragmentPin.appendChild(renderPin(offers[j])); // во фрагмент добавляются метки из функции renderPin
}
mapPins.appendChild(fragmentPin); // вставить фрагмент в DOM


// показать объявление по первому объекту из массива
var fragmentOffers = document.createDocumentFragment();
fragmentOffers.appendChild(renderCard(offers[0]));
map.appendChild(fragmentOffers); // вставить фрагмент в DOM
