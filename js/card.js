'use strict';

(function () {

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


  var cardTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card'); // div с шаблоном


  window.cardModule = {
    /**
     * создать объявление
     * @param {array} offers массив с n-ым количеством объектов объявлений
     * @return {ELEMENT_NODE} нужная разметка
     */
    renderCard: function (offers) {
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


      function onCloseCardKeyDown(evt) {
        if (evt.keyCode === window.formModule.ESC_KEYCODE) {
          if (!cardElement.classList.contains('hidden')) {
            cardElement.classList.add('hidden');
            evt.target.classList.remove('map__pin--active');
            document.removeEventListener('keydown', onCloseCardKeyDown);
          }
        }
      }
      cardClose.addEventListener('click', window.mapModule.onCardCloseClick); // повесить событие закрытия карточки объявления
      document.addEventListener('keydown', onCloseCardKeyDown);

      return cardElement;
    },

    /**
     * Вставка созданных элементов в разметку
     * @param {array} items массив с n-ым количеством объектов объявлений
     * @param {element} parentElement элемент DOM, в который вставляются созданные элементы
     * @param {ELEMENT_NODE} template шаблон с разметкой
     * @param {function} action функция генерации нужной разметки
     */
    createElements: function (items, parentElement, template, action) {
      var fragmentOffers = document.createDocumentFragment();
      for (var i = 0; i < items.length; i++) {
        fragmentOffers.appendChild(action(items[i], template)); // во фрагмент добавляются объекты из функции генерации
      }
      parentElement.appendChild(fragmentOffers); // вставить фрагмент в DOM

      /**
       * удаление элементов меток и объявлений при сабмите
       */
      function onRemoveCardAndPin() {
        var listCards = document.querySelectorAll('.map__card');
        var mapPinsWithId = document.querySelectorAll('.map__pin[data-id]');

        for (var j = 0; j < listCards.length; j++) {
          window.mapModule.mapOffers.removeChild(listCards[j]);
        }

        for (var k = 0; k < mapPinsWithId.length; k++) {
          window.mapModule.mapPins.removeChild(mapPinsWithId[k]);
        }
      }

      document.addEventListener('submit', onRemoveCardAndPin);

      window.formModule.buttonFormReset.addEventListener('click', function (evt) {
        evt.preventDefault();
        onRemoveCardAndPin();
      });
    },

    cardTemplate: cardTemplate
  };

})();
