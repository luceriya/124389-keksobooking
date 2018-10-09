'use strict';

(function () {

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
    var indexNewArray;
    for (var i = items.length - 1; i > 0; i--) {
      indexNewArray = Math.floor(Math.random() * (i + 1));
      temp = items[indexNewArray];
      items[indexNewArray] = items[i];
      items[i] = temp;
    }
    return items;
  }


  /**
   * @return {array} массив с n-ым количеством объектов
   */
  window.dataModule = {
    createOffers: function () {
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
  };

})();
