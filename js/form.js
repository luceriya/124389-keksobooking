'use strict';

(function () {

  var form = document.querySelector('.ad-form');
  var typeRoomsInput = form.querySelector('#type');
  var priceRoomsInput = form.querySelector('#price');
  var checkinTimeInput = form.querySelector('#timein');
  var checkoutTimeInput = form.querySelector('#timeout');
  var roomNumberInput = form.querySelector('#room_number');
  var guestNumberInput = form.querySelector('#capacity');
  var buttonFormReset = form.querySelector('.ad-form__reset');
  var MAIN_PIN_TOP = '375px';
  var MAIN_PIN_LEFT = '570px';
  var ESC_KEYCODE = 27;

  // соотношение типа жилья (ключ) с ценой (значение)
  var minPraceForRooms = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  // соотношение количества комнат (ключ) с количеством человек (значение)
  var guestsInRoom = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  /**
   * Изменяет минимальное значение и плейсхолдер поля с ценой в соответствии типу жилья
   * @param {object} evt event
   */
  function onPriceRoomsChange(evt) {
    var thisType = evt.currentTarget.value;

    priceRoomsInput.min = minPraceForRooms[thisType];
    priceRoomsInput.placeholder = 'от ' + minPraceForRooms[thisType];
  }


  /**
   * Изменяет значение поля выезда в соответствии со временем заезда
   * @param {object} evt event
   */
  function onCheckoutTimeChange(evt) {
    checkoutTimeInput.value = evt.currentTarget.value;
  }

  /**
   * Изменяет значение поля заезда в соответствии со временем въезда
   * @param {object} evt event
   */
  function onCheckinTimeChange(evt) {
    checkinTimeInput.value = evt.currentTarget.value;
  }

  /**
   * Соотнести поле "Количество комнат" с полем "Количество мест", недопустимым значениям option "Количество мест" добавить disabled
   */
  function onGuestNumberChange() {
    var numberOfRoom = roomNumberInput.value; // значение поля "Количество комнат"
    var countGuests = guestsInRoom[numberOfRoom]; // количество мест для значения поля "Количество комнат"
    var guestNumberOptions = guestNumberInput.options; // все option поля "Количество мест"

    roomNumberInput.setCustomValidity('');

    for (var i = 0; i < guestNumberOptions.length; i++) {
      var thisOption = guestNumberOptions[i];
      var thisGuest = thisOption.value;

      if (countGuests.indexOf(thisGuest) !== -1) { // соотношение value с массивом допустимых значений
        thisOption.disabled = false;
      } else {
        thisOption.disabled = true;
      }

      if (thisOption.selected && thisOption.disabled) {
        guestNumberInput.setCustomValidity('Вы выбрали неверное количество гостей');
      }

    }

  }

  /**
   * Убирает сообщение об ошибке заполнения поля "Количество мест"
   */
  function onRoomNumberChange() {
    guestNumberInput.setCustomValidity('');
  }


  window.formModule = {
    setupForm: function () {

      typeRoomsInput.addEventListener('change', onPriceRoomsChange);
      checkinTimeInput.addEventListener('change', onCheckoutTimeChange); // при изменении времени заезда, соответственно изменяется время выезда
      checkoutTimeInput.addEventListener('change', onCheckinTimeChange); // При изменении времени выезда, соответственно изменяется время заезда
      roomNumberInput.addEventListener('change', onGuestNumberChange);
      guestNumberInput.addEventListener('change', onRoomNumberChange);
    },

    buttonFormReset: buttonFormReset,
    ESC_KEYCODE: ESC_KEYCODE
  };


  function onError(errorMessage) {
    var templateError = document.querySelector('#error').content.querySelector('.error');
    var domElementError = templateError.cloneNode(true);
    var elementError = domElementError.querySelector('.error__message');
    elementError.textContent = errorMessage;
    var parentElement = document.querySelector('main');
    parentElement.appendChild(domElementError);

    function onDeleteErrorClick() {
      parentElement.removeChild(domElementError);
      document.removeEventListener('click', onDeleteErrorClick);
    }

    document.addEventListener('click', onDeleteErrorClick);

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        onDeleteErrorClick();
      }
    });

  }


  /**
   * Показать сообщение об успехе, закрыть его при клике на произвольную область и по нажатию на ESC
   */
  function showSuccess() {
    var templateSuccess = document.querySelector('#success').content.querySelector('.success');
    var domElementSuccess = templateSuccess.cloneNode(true);
    var parentElement = document.querySelector('main');
    parentElement.appendChild(domElementSuccess);

    function onDeleteSuccessClick() {
      parentElement.removeChild(domElementSuccess);
      document.removeEventListener('click', onDeleteSuccessClick);
    }
    document.addEventListener('click', onDeleteSuccessClick);

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        onDeleteSuccessClick();
      }
    });
  }


  /**
   * Перевод страницы в изначальный неактивный режим
   */
  function returnToInactive() {
    form.classList.add('ad-form--disabled');
    form.reset();
    window.mapModule.mapOffers.classList.add('map--faded');
    window.mapModule.disabledForms();
    window.mapModule.mapPinMain.style.top = MAIN_PIN_TOP;
    window.mapModule.mapPinMain.style.left = MAIN_PIN_LEFT;
  }


  /**
   * Действия при успешной отправке данных: вывести сообщение об успехе, перевести страницу в неактивный режим
   * @param {Object} response Данные с формы
   */
  function onSuccess(response) {
    returnToInactive();
    showSuccess();
  }


  form.addEventListener('submit', function (evt) {
    window.backend.sendForm(new FormData(form), onSuccess, onError);
    evt.preventDefault();
  });


  buttonFormReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    returnToInactive();
  });

})();
