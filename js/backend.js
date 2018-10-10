'use strict';

(function () {

  var xhr = new XMLHttpRequest();

  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    console.log(xhr.response);
  });

  xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
  xhr.send();


})();
