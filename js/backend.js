'use strict';

(function () {

  window.backend = {
    loadData: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();

      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        var data = xhr.response;

        for (var i = 0; i < data.length; i++) {
          data[i].id = i;
        }

        onLoad(data);
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000; // 10s

      xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
      xhr.send();
    },

    sendForm: function (data, onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        onSuccess(xhr.response);
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка отправки формы');
      });

      xhr.open('POST', 'https://js.dump.academy/keksobooking');
      xhr.send(data);
    }
  };

})();
