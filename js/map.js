'use strict';

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
var MAIN_PIN_WIDTH = 63;
var MAIN_PIN_HEIGHT = 83;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var avatars = getShuffleArray(['01', '02', '03', '04', '05', '06', '07', '08']);
var titles = getShuffleArray(['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде']);
var types = ['palace', 'flat', 'house', 'bungalo'];
var times = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


/**
* @param {number} min минимальное число
* @param {number} max максимальное число
* @return {number} случайное число между min и max
*/
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @param {array} items массив любых значений
 * @return {any} случайное значение массива
 */
function getRandomValue(items) {
  var rand = Math.floor(Math.random() * items.length);
  var randomValue = items[rand];
  return randomValue;
}

/**
 * функция меняет исходный массив
 * @param {array} items массив любых значений
 * @return {array} массив с перемешанными значениями
 */
function getShuffleArray(items) {
  var temp;
  var j;
  for (var i = items.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = items[j];
    items[j] = items[i];
    items[i] = temp;
  }
  return items;
}


/**
 * @return {array} массив с n-ым количеством объектов
 */
function createOffers() {
  var offers = [];
  for (var i = 0; i < COUNT_OFFERS; i++) {

    var ticket = {

      author: {
        avatar: 'img/avatars/user' + avatars[i] + '.png'
      },

      offer: {
        title: titles[i],
        address: getRandomNumber(MIN_ADDRESS, MAX_ADDRESS + 1) + ', ' + getRandomNumber(MIN_ADDRESS, MAX_ADDRESS + 1),
        price: getRandomNumber(MIN_PRICE, MAX_PRICE + 1),
        type: getRandomValue(types),
        rooms: getRandomNumber(MIN_ROOM, MAX_ROOM + 1),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS + 1),
        checkin: getRandomValue(times),
        checkout: getRandomValue(times),
        features: getShuffleArray(features).slice(getRandomNumber(0, 6)),
        description: '',
        photos: getShuffleArray(photos)
      },

      location: {
        x: getRandomNumber(LOCATION_X.min, LOCATION_X.max + 1),
        y: getRandomNumber(LOCATION_Y.min, LOCATION_Y.max + 1)
      }

    };

    offers.push(ticket);
  }
  return offers;
}


/**
 * @param {string} type тип объекта размещения
 * @return {string} строка с типом объекта размещения
 */
function changeNameType(type) {
  var nameType;
  if (type === 'flat') {
    nameType = 'Квартира';
  } else if (type === 'bungalo') {
    nameType = 'Бунгало';
  } else if (type === 'house') {
    nameType = 'Дом';
  } else if (type === 'palace') {
    nameType = 'Дворец';
  }
  return nameType;
}


/**
 * @param {number} number количество комнат массива с объектами offers
 * @return {string} строка с правильным склонением слова "комната"
 */
function changeTextWithRooms(number) {
  var offerRooms;
  if (number === 1) {
    offerRooms = 'комната';
  } else if (number === 5) {
    offerRooms = 'комнат';
  } else {
    offerRooms = 'комнаты';
  }
  return offerRooms;
}


/**
 *
 * @param {string} tagName тег создаваемого элемента
 * @param {string} className класс создаваемого элемента
 * @return {object} нужный тег с классом
 */
function makeElement(tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
}

/**
 *
 * @param {string} tagName тег создаваемого элемента
 * @param {string} className класс создаваемого элемента
 * @param {string} url полный адрес картинки создаваемого элемента
 * @param {string} width ширина создаваемого элемента
 * @param {string} height высота создаваемого элемента
 * @param {string} desc alt создаваемого элемента
 * @return {object} нужный тег с параметрами
 */
function makeImg(tagName, className, url, width, height, desc) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  element.src = url;
  element.width = width;
  element.height = height;
  element.alt = desc;
  return element;
}


/**
 * создать метки
 * @param {array} offers массив с n-ым количеством объектов объявлений
 * @param {ELEMENT_NODE} mapPin template c разметкой метки
 * @return {object} нужная разметка
 */
function renderPin(offers, mapPin) {
  var pinElement = mapPin.cloneNode(true); // полностью клонировать шаблон

  pinElement.style = 'left: ' + (offers.location.x - PIN_WIDTH) + 'px; top: ' + (offers.location.y - PIN_HEIGHT) + 'px;';
  pinElement.querySelector('img').src = offers.author.avatar;
  pinElement.querySelector('img').alt = offers.offer.title;

  return pinElement;
}


/**
 * создать объявление
 * @param {array} offers массив с n-ым количеством объектов объявлений
 * @return {ELEMENT_NODE} нужная разметка
 */
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
  cardElement.querySelector('.popup__type').textContent = changeNameType(offers.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = offers.offer.rooms + ' ' + changeTextWithRooms(offers.offer.rooms) + ' для ' + offers.offer.guests + ' ' + offerGuests;

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

  return cardElement;
}


// сделать активной карту - убрать
// function makeMapActive() {
//   map.classList.remove('map--faded');
// }


// работа с DOM
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');

var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin'); // div с шаблоном

var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card'); // div с шаблоном

// makeMapActive(); - убрать


// показать метки
// var fragmentPin = document.createDocumentFragment();

// for (var j = 0; j < offers.length; j++) {
//   fragmentPin.appendChild(renderPin(offers[j], mapPinTemplate)); // во фрагмент добавляются метки из функции renderPin
// }
// mapPins.appendChild(fragmentPin); // вставить фрагмент в DOM

/**
 *
 * @param {array} items массив с n-ым количеством объектов объявлений
 */
function createPins(items) {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < items.length; i++) {
    fragmentPin.appendChild(renderPin(offers[i], mapPinTemplate)); // во фрагмент добавляются метки из функции renderPin
  }
  mapPins.appendChild(fragmentPin);
}

var offers = createOffers();

// показать объявление по первому объекту из массива
// var fragmentOffers = document.createDocumentFragment();
// fragmentOffers.appendChild(renderCard(offers[0]));
// // map.appendChild(fragmentOffers); // вставить фрагмент в DOM

/**
 *
 * @param {array} items массив с n-ым количеством объектов объявлений
 */
function loadCard(items) {
  var fragmentOffers = document.createDocumentFragment();
  for (var i = 0; i < items.length; i++) {
    fragmentOffers.appendChild(renderCard(offers[i], cardTemplate));
  }
  map.appendChild(fragmentOffers); // вставить фрагмент в DOM
}


// 16 задание
// on + объект + событие: onButtonClick

var mapPinMain = document.querySelector('.map__pin--main');
var form = document.querySelector('.ad-form');
var fieldset = form.querySelectorAll('fieldset');
var addressInput = form.querySelector('#address');
var mapFilters = document.querySelectorAll('.map__filters > *');

var mapPin = document.querySelectorAll('.map__pin');


function addFormsDisabled() {
  if (map.classList.contains('map--faded')) {
    for (var i = 0; i < fieldset.length; i++) {
      fieldset[i].disabled = true;
    }
    for (var i = 0; i < mapFilters.length; i++) {
      mapFilters[i].disabled = true;
    }
  }
}

function onGetAdressMouseup(evt) {
  addressInput.value = (evt.pageX - MAIN_PIN_WIDTH) + ', ' + (evt.pageY - MAIN_PIN_HEIGHT);
  addressInput.disabled = true;
}


function onMapActiveMouseup() {
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  createPins(offers);
  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].disabled = false;
  }
  for (var i = 0; i < mapFilters.length; i++) {
    mapFilters[i].disabled = false;
  }
  mapPinMain.removeEventListener('mouseup', onMapActiveMouseup);
}

// При решении этой задачи помните о том, что при клике на метку, нужно будет передавать в метод отрисовки карточки объект с данными, описывающими объявление.
// loadCard(offers);

document.addEventListener('DOMContentLoaded', addFormsDisabled);
mapPinMain.addEventListener('mouseup', onMapActiveMouseup);
mapPinMain.addEventListener('mouseup', onGetAdressMouseup);
