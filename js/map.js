'use strict';

(function () {


  var MAIN_PIN_WIDTH = 63;
  var MAIN_PIN_HEIGHT = 83;

  // работа с DOM
  var mapOffers = document.querySelector('.map');
  var mapPins = mapOffers.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var form = document.querySelector('.ad-form');
  var addressInput = form.querySelector('#address');
  var fieldset = form.querySelectorAll('fieldset');
  var mapFilters = createArrayFormFilters();


  /**
   * Вычисляет координаты метки пользователя
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
    addressInput.readOnly = true;
  }


  /**
   * Создает массив с элементами формы для фильтра карты
   * @return {array} массив с нужными элементами формы
   */
  function createArrayFormFilters() {
    var array = [];
    var filters = document.querySelectorAll('.map__filter');
    for (var i = 0; i < filters.length; i++) {
      array.push(filters[i]);
    }
    array.push(document.querySelector('#housing-features'));
    return array;
  }


  /**
   * Переводит карту в активный режим
   */
  function activateForm() {
    mapOffers.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    for (var i = 0; i < fieldset.length; i++) {
      fieldset[i].disabled = false;
    }
    for (var j = 0; j < mapFilters.length; j++) {
      mapFilters[j].disabled = false;
    }
  }


  /**
   * Показывает объявление, которое соответствует id метки, или скрывает его, если нет
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
   * Добавляет активный класс метке, если ее объявление открыто, и удаляет, если закрывается
   * @param {string} idPin data-id метки
   */
  function addPinActiveClass(idPin) {
    var mapPinsWithId = document.querySelectorAll('.map__pin[data-id]');

    for (var i = 0; i < mapPinsWithId.length; i++) {
      var itemPin = mapPinsWithId[i];

      if (itemPin.getAttribute('data-id') === idPin) {
        itemPin.classList.add('map__pin--active');
      } else {
        itemPin.classList.remove('map__pin--active');
      }
    }
  }


  function onDragMapPinMainMouseDown(evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };


    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      if (moveEvt.clientY > 130
        && moveEvt.clientY < 630
        && moveEvt.clientX > mapOffers.offsetLeft
        && (moveEvt.clientX < (mapOffers.offsetLeft + mapOffers.offsetWidth))) {

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      }

    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      getAdressPin(evt);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }


  window.mapModule = {
    /**
     * При клике на крестик закрыть объявление
     * @param {object} evt event
     */
    onCardCloseClick: function (evt) {
      if (evt.currentTarget.parentElement.hasAttribute('data-id')) {
        closeCard(evt.currentTarget.parentElement.getAttribute('data-id'));
        addPinActiveClass(evt.currentTarget.getAttribute('data-id'));
      }
    },
    /**
     * При клике на метку показать объявление
     * @param {object} evt event
     */
    onPinClick: function (evt) {
      if (evt.currentTarget.hasAttribute('data-id')) {
        showCard(evt.currentTarget.getAttribute('data-id'));
        addPinActiveClass(evt.currentTarget.getAttribute('data-id'));
      }
    },

    /**
     * Делает неактивными формы на странице: фильтр на карте, поля с публикацией нового объявления
     */
    disabledForms: function () {
      if (mapOffers.classList.contains('map--faded')) {
        for (var i = 0; i < fieldset.length; i++) {
          fieldset[i].disabled = true;
        }
        for (var j = 0; j < mapFilters.length; j++) {
          mapFilters[j].disabled = true;
        }
      }
    },

    mapOffers: mapOffers,
    mapPins: mapPins,
    mapPinMain: mapPinMain
  };


  function generateMouseUpCallback(offers) {
    return function onMapMouseUp() {
      if (mapOffers.classList.contains('map--faded')) {
        activateForm(); // перевод карты в активный режим
        window.cardModule.createElements(offers, mapPins, window.pinModule.mapPinTemplate, window.pinModule.renderPin); // создание меток
        window.cardModule.createElements(offers, mapOffers, window.cardModule.cardTemplate, window.cardModule.renderCard); // создание объявлений
      }
    };
  }


  function activateAll(data) {
    mapPinMain.addEventListener('mouseup', generateMouseUpCallback(data)); // при mouseup страница переходит в активный режим
  }


  function onError(errorMessage) {
    var templateError = document.querySelector('#error').content.querySelector('.error');
    var domElementError = templateError.cloneNode(true);
    var elementError = domElementError.querySelector('.error__message');
    elementError.textContent = errorMessage;
    var btnError = domElementError.querySelector('.error__button');
    var parentElement = document.querySelector('main');
    parentElement.appendChild(domElementError);

    function onBtnErrorClick() {
      window.location.reload();
      btnError.removeEventListener('click', onBtnErrorClick);
    }

    btnError.addEventListener('click', onBtnErrorClick);
  }


  window.formModule.setupForm();

  document.addEventListener('DOMContentLoaded', window.mapModule.disabledForms); // неактивное состояние страницы при загрузке страницы

  window.backend.loadData(activateAll, onError); // загрузка данных, обработка ошибок

  mapPinMain.addEventListener('mousedown', onDragMapPinMainMouseDown); // drag and drop main pin


})();
