jQuery(document).ready(function ($) {

  $(window).on('load', function () { // После полной загрузки сайта, происходит имитация клтка на урок, на котором пользователь остановился/закрыл браузер
    $('.lesson').each(function () {
      let item = $(this);
      let lesson = item.attr('data-lesson');
      if (localStorage.getItem('level') === lesson) {
        item.click();
      }
    });

    if (!localStorage.getItem('level')) {
      $('.first').click();
    }
  });

  // localStorage
  let lessons = {
    0: {
      success: false,
      text: ''
    },
    1: {
      success: false,
      text: ''
    },
    2: {
      success: false,
      text: ''
    },
    3: {
      success: false,
      text: ''
    },
    4: {
      success: false,
      text: ''
    },
    5: {
      success: false,
      text: ''
    },
    6: {
      success: false,
      text: ''
    },
    7: {
      success: false,
      text: ''
    },
    8: {
      success: false,
      text: ''
    },
    9: {
      success: false,
      text: ''
    },
    10: {
      success: false,
      text: ''
    },
    11: {
      success: false,
      text: ''
    },
    12: {
      success: false,
      text: ''
    },
    13: {
      success: false,
      text: ''
    },
    14: {
      success: false,
      text: ''
    }
  };

  if (localStorage.getItem('Lessons')) {
    lessons = JSON.parse(localStorage.getItem('Lessons'));
  }

  $(window).on('beforeunload', function () {
    localStorage.setItem('level', level);
  });

  $('.lesson').on('click', function () { // По клику на элемент меню выбора уроков происходят различные манипуляции с отдельными элементами сайта
    $('.lesson').not(this).removeClass('active');
    $(this).addClass('active');
    let lesson = $(this).attr('data-lesson'); // вынимается целое число от 0 до n, с помощью которого и будут формироваться, элементы сайта = номер урока
    lesson == 14 ? $('#next').addClass('disabled') : $('#next').removeClass('disabled');
    localStorage.setItem('level', lesson);
    $.getJSON('js/lessons.json', function (data) { // JSON подгрузка уроков
      let title = '<h2>',
        description = '<p>',
        ul = '<ul>',
        hint = '<p>',
        html = '';
      title += data.lessons[lesson].title + '</h2>';
      description += data.lessons[lesson].description + '</p>';
      html += title + description;
      if (typeof data.lessons[lesson].ul !== "undefined") {
        for (key in data.lessons[lesson].ul) {
          ul += '<li>' + data.lessons[lesson].ul[key].li + '</li>';
        }
        ul += '</ul>';
        html += ul;
      }
      const close = '<div class="btn-close" title="Закрыть"></div>';
      html += close;
      if (typeof data.lessons[lesson].hint !== "undefined") {
        hint += data.lessons[lesson].hint + '</p>'
        html += hint;
      }
      $('.modal.help').html(html);
      $('#container').attr('style', '');
      $('#container').html(data.lessons[lesson].container);
      $('#background').html(data.lessons[lesson].background);
      $('#background').attr('style', data.lessons[lesson].css);
      $('.nav-content__btn').click();
      $('.hint').click();
      $('#hint code').each(function () {
        let code = $(this);
        let text = code.text();
        for (key in data.alerts) {
          if (text === data.alerts[key].check) {
            code.addClass('alert');
            code.on('mouseenter', function (e) {
              let id = code.attr('data-alert');
              if ($('#hint .tooltip').length === 0) {
                $('<div class="tooltip"></div>').html(data.alerts[id].alert).appendTo(code);
              }
            }).on('mouseleave', function () {
              $('#hint .tooltip').remove();
            });
          }
        }
      });
      // localStorage
      if (lessons[lesson].success) {
        $('#code').val(lessons[lesson].text);
        $('#container').attr('style', lessons[lesson].text);
      } else {
        $('#code').val('');
      }
      $('#code').on('input', function () {
        let code = $('#code').val().trim();
        let ifcode = code.replace(/\s/g, '').replace(/\n/g, '');
        if (ifcode === data.lessons[lesson].css.replace(/\s/g, '')) {
          lessons[lesson].success = true;
          lessons[lesson].text = code;
          localStorage.setItem('Lessons', JSON.stringify(lessons));
          $('.lesson').each(function () {
            if ($(this).attr('data-lesson') == lesson) {
              $(this).addClass('success');
            }
          });
        }
      });
    });
  });

  for (key in lessons) {
    if (lessons[key].success === true) {
      $('.lesson').each(function () {
        let item = $(this);
        let lesson = item.attr('data-lesson');
        if (key === lesson) {
          item.addClass('success');
        }
      });
    }
  }

  $('#next').on('click', function () { // Переключение на следующий урок при клике на кнопку "Следующий"
    let next = $('.lesson.active').attr('data-lesson');
    next++;
    $('.lesson').each(function () {
      if ($(this).attr('data-lesson') == next) {
        $(this).click();
      }
    });
  });

  $('.adaptiv-content__lesson').on('click', function () { // По клику на контейнер урока, происходит развертка, при помощи добавления класса
    $('.adaptiv-content__lesson').not(this).removeClass('active');
    $(this).addClass('active');
  });

  $('#code').on('input', function () { // Каждое нажатие в редакторе, автоматически добавляет все содержимое редактора в стили элемента #container, который отвечает за расположение людей на экране
    let code = $('#code').val();
    $('#container').attr('style', code);
  });

  $('.turn-btn').on('click', function () { // Свернуть/развернуть редактор
    $('#editor').toggleClass('turn');
    $('#app').toggleClass('close');
    if ($('#editor').hasClass('turn')) {
      $(this).html('Развернуть редактор');
    } else {
      $(this).html('Свернуть редактор');
    }
  });

  $('.nav-content__btn').on('click', function () { // Открытие меню
    $(this).toggleClass('active');
    $('.menu-adaptiv').toggleClass('opened');
    $('body').toggleClass('hidden');
  });
  $(document).on('mouseup', function (e) { // Закрытие меню, при клике вне меню и хедера
    e.preventDefault;
    let menu = $('.menu-adaptiv__container');
    let header = $('.nav');
    if (e.target != menu[0] && menu.has(e.target).length === 0 && e.target != header[0] && header.has(e.target).length === 0) {
      $('.nav-content__btn').removeClass('active');
      $('.menu-adaptiv').removeClass('opened');
      $('body').removeClass('hidden');
    }
  });

  $('.tool').on('click', function () { // Попап окна
    let attribut = $(this).attr('trigger');
    let overlay = $('.overlay');
    let modal = $('#' + attribut);
    overlay.show();
    modal.show();
    $('body').addClass('hidden');
    modal.find($('.btn-close')).on('click', function () {
      modal.hide();
      overlay.hide();
      $('body').removeClass('hidden');
    });
    $(document).on('click', function (e) { // Закрытие попап окна, при клике вне
      e.preventDefault;
      e = $(e.target);
      if (e.contents('#hint').length && e.contents('#about').length) {
        modal.hide();
        overlay.hide();
        $('body').removeClass('hidden');
      }
    });
  });

  // Очистить localStorage и запустить игру заново
  $('#reset').on('click', function () {
    let message = confirm('Вы точно хотите сбросить игру?\n\nВаш прогресс будет потерян и Вы вернетесь к началу игры!');
    if (message) {
      localStorage.clear();
      document.location.reload();
    }
  });

});