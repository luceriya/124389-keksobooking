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
      },

      id: i

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
  // pinElement.classList.add('map__pin-user');
  pinElement.setAttribute('data-id', offers.id);
  pinElement.style = 'left: ' + (offers.location.x - PIN_WIDTH) + 'px; top: ' + (offers.location.y - PIN_HEIGHT) + 'px;';
  pinElement.querySelector('img').src = offers.author.avatar;
  pinElement.querySelector('img').alt = offers.offer.title;
  pinElement.addEventListener('click', onPinClick);
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
  var cardClose = cardElement.querySelector('.popup__close');

  cardElement.setAttribute('data-id', offers.id);
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

  cardElement.classList.add('hidden');
  cardClose.addEventListener('click', onCardCloseClick); // повесить событие закрытия карточки объявления

  return cardElement;
}


// работа с DOM
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');

var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin'); // div с шаблоном

var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card'); // div с шаблоном


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


/**
 *
 * @param {object} click event
 * @return {string} координаты метки
 */
function calculateAdressPin(click) {
  var coordinate = (click.pageX - MAIN_PIN_WIDTH) + ', ' + (click.pageY - MAIN_PIN_HEIGHT);
  return coordinate;
}


/**
 * Заполняет инпут с адресом координатами метки и делает его неактивным
 * @param {object} evt event
 */
function getAdressPin(evt) {
  addressInput.value = calculateAdressPin(evt);
  addressInput.disabled = true;
}


/**
 * Делает неактивными формы на странице: фильтр на карте, поля с публикацией нового объявления
 */
function addFormsDisabled() {
  if (map.classList.contains('map--faded')) {
    for (var i = 0; i < fieldset.length; i++) {
      fieldset[i].disabled = true;
    }
    for (var j = 0; j < mapFilters.length; j++) {
      mapFilters[j].disabled = true;
    }
  }
}


/**
 * Переводит карту в активный режим
 */
function formActivate() {
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].disabled = false;
  }
  for (var j = 0; j < mapFilters.length; j++) {
    mapFilters[j].disabled = false;
  }
}


/**
 * Показать объявление, которое соответствует id метки, или скрыть, если нет
 * @param {string} idPin id метки
 */
function showCard(idPin) {
  var listCards = document.querySelectorAll('.map__card');

  for (var i = 0; i < listCards.length; i++) {
    var itemCard = listCards[i];
    if (itemCard.getAttribute('data-id') === idPin) {
      itemCard.classList.remove('hidden');
    } else {
      itemCard.classList.add('hidden');
    }
  }

}


/**
 * Скрывает объявление, которое соответствует id метки
 * @param {string} idPin data-id метки
 */
function closeCard(idPin) {
  var listCards = document.querySelectorAll('.map__card');

  for (var i = 0; i < listCards.length; i++) {
    var itemCard = listCards[i];
    if (itemCard.getAttribute('data-id') === idPin) {
      itemCard.classList.add('hidden');
    }
  }
}


/**
 * Событие на перетаскивание метки объявления (активация карты, загрузка меток и объявлений), удаление этого события
 */
function onMapMouseUp() {
  formActivate(); // перевод карты в активный режим
  createPins(offers); // создание меток
  loadCard(offers); // создание объявлений
  mapPinMain.removeEventListener('mouseup', onMapMouseUp); // удаление этого события
}


/**
 * При клике на метку показать объявление
 * @param {object} evt event
 */
function onPinClick(evt) {
  if (evt.currentTarget.hasAttribute('data-id')) {
    showCard(evt.currentTarget.getAttribute('data-id'));
  }
}


/**
 * При клике на крестик закрыть объявление
 * @param {object} evt event
 */
function onCardCloseClick(evt) {
  if (evt.currentTarget.parentElement.hasAttribute('data-id')) {
    closeCard(evt.currentTarget.parentElement.getAttribute('data-id'));
  }
}


document.addEventListener('DOMContentLoaded', addFormsDisabled); // неактивное состояние страницы при загрузке страницы
mapPinMain.addEventListener('mouseup', onMapMouseUp); // при mouseup страница переходит в активный режим
mapPinMain.addEventListener('mouseup', getAdressPin); // перетаскивание метки изменяет координаты в поле "Адрес"
