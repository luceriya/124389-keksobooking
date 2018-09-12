'use strict';

// получить рандомное число
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// получить рандомное значение из массива с повтором
var getRandomValue = function (items) {
  var rand = Math.floor(Math.random() * items.length);
  var randomValue = items[rand];
  return randomValue;
};

// получить рандомное значение из массива без повторов
var getRandomArray = function (items) {
  var randomArray = [];
  while (randomArray.length < items.length) {
    var randomValue = items[getRandomNumber(0, items.length)];
    if (randomArray.indexOf(randomValue) === -1) {
      randomArray.push(randomValue);
    }
  }
  return randomArray;
};


// исходные данные
var avatar = getRandomArray(['01', '02', '03', '04', '05', '06', '07', '08']);
var title = getRandomArray(['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде']);
var type = ['palace', 'flat', 'house', 'bungalo'];
var time = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');

var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin'); // div с шаблоном

var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card'); // div с шаблоном

map.classList.remove('map--faded'); // сделать активной карту


// создать массив из 8 объектов
var offers = [];
for (var i = 0; i < 8; i++) {

  var ticket = {

    author: {
      avatar: 'img/avatars/user' + avatar[i] + '.png'
    },

    offer: {
      title: title[i],
      address: getRandomNumber(0, 601) + ', ' + getRandomNumber(0, 601),
      price: getRandomNumber(1000, 1000001),
      type: getRandomValue(type),
      rooms: getRandomNumber(1, 6),
      guests: getRandomNumber(1, 50),
      checkin: getRandomValue(time),
      checkout: getRandomValue(time),
      features: getRandomArray(features).slice(getRandomNumber(0, 6)),
      description: '',
      photos: getRandomArray(photos)
    },

    location: {
      x: getRandomNumber(130, 1000),
      y: getRandomNumber(130, 631)
    }

  };

  offers.push(ticket);
}


// создать метки
var renderPin = function (offers) {
  var pinElement = mapPinTemplate.cloneNode(true); // полностью клонировать шаблон

  pinElement.style = 'left: ' + offers.location.x + 'px; top: ' + offers.location.y + 'px;';
  pinElement.querySelector('img').src = offers.author.avatar;
  pinElement.querySelector('img').alt = offers.offer.title;

  return pinElement;
};


// создать объявление
var renderCard = function (offers) {
  var cardElement = cardTemplate.cloneNode(true); // полностью клонировать шаблон

  cardElement.querySelector('.popup__title').textContent = offers.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offers.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offers.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offers.offer.checkin + ', выезд до ' + offers.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = offers.offer.description;
  cardElement.querySelector('.popup__avatar').src = offers.author.avatar;


  var nameType = offers.offer.type;
  if (nameType === 'flat') {
    nameType = 'Квартира';
  } else if (nameType === 'bungalo') {
    nameType = 'Бунгало';
  } else if (nameType === 'house') {
    nameType = 'Дом';
  } else {
    nameType = 'Дворец';
  }
  cardElement.querySelector('.popup__type').textContent = nameType;


  var offerRooms = 'комнаты';
  if (offers.offer.rooms === 1) {
    offerRooms = 'комната';
  }
  if (offers.offer.rooms === 5) {
    offerRooms = 'комнат';
  }
  var offerGuests = (offers.offer.guests === 1) ? 'гостя' : 'гостей';
  cardElement.querySelector('.popup__text--capacity').textContent = offers.offer.rooms + ' ' + offerRooms + ' для ' + offers.offer.guests + ' ' + offerGuests;


  var offerFeatures = offers.offer.features;
  var listFeatures = cardElement.querySelector('.popup__features');
  for (var i = 0; i < offerFeatures.length; i++) {
    var valueFeatures = offerFeatures[i];
    var elementFeatures = document.createElement('li');
    elementFeatures.className = 'popup__feature popup__feature--' + valueFeatures;
    listFeatures.appendChild(elementFeatures);
  }

  // 2 вариант features

  // var massivFeaturies = offers.offer.features;
  // var elemLi = cardElement.querySelectorAll('.popup__feature');
  // var elemWifi = cardElement.querySelector('.popup__feature--wifi');
  // var elemDishwasher = cardElement.querySelector('.popup__feature--dishwasher');
  // var elemParking = cardElement.querySelector('.popup__feature--parking');
  // var elemWasher = cardElement.querySelector('.popup__feature--washer');
  // var elemElevator = cardElement.querySelector('.popup__feature--elevator');
  // var elemConditioner = cardElement.querySelector('.popup__feature--conditioner');

  // for (var i = 0; i < elemLi.length; i++) {
  //   elemLi[i].style.display = 'none';

  //   if (massivFeaturies.indexOf('wifi') !== -1) {
  //     elemWifi.style.display = 'inline-block';
  //   }
  //   if (massivFeaturies.indexOf('dishwasher') !== -1) {
  //     elemDishwasher.style.display = 'inline-block';
  //   }
  //   if (massivFeaturies.indexOf('parking') !== -1) {
  //     elemParking.style.display = 'inline-block';
  //   }
  //   if (massivFeaturies.indexOf('washer') !== -1) {
  //     elemWasher.style.display = 'inline-block';
  //   }
  //   if (massivFeaturies.indexOf('elevator') !== -1) {
  //     elemElevator.style.display = 'inline-block';
  //   }
  //   if (massivFeaturies.indexOf('conditioner') !== -1) {
  //     elemConditioner.style.display = 'inline-block';
  //   }
  // }


  var offerPhotos = offers.offer.photos;
  var listPhotos = cardElement.querySelector('.popup__photos');
  for (var i = 0; i < offerPhotos.length; i++) {
    var valuePhotos = offerPhotos[i];
    var elementPhotos = document.createElement('img');
    elementPhotos.src = valuePhotos;
    elementPhotos.classList.add('popup__photo');
    elementPhotos.width = '45';
    elementPhotos.height = '40';
    elementPhotos.alt = 'Фотография жилья';
    listPhotos.appendChild(elementPhotos);
  }


  return cardElement;
};


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
