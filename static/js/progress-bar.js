!function ($) {
  var Progressbar = function (element) {
    this.$element = $(element);
  }

  Progressbar.prototype.update = function (value) {
    var $div = this.$element;
    var $span = $div.find('span');
    $div.attr('aria-valuenow', value);
    $div.css('width', value + '%');
    $span.text(value + '% Complete');
  }

  Progressbar.prototype.reset = function () {
    this.update(0);
  }

  Progressbar.prototype.finish = function () {
    this.update(100);
  }

  $.fn.progressbar = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('_progressbar');

      if (!data) $this.data('_progressbar', (data = new Progressbar(this)));
      if (typeof option == 'string') data[option]();
      if (typeof option == 'number') data.update(option);
    })
  };
}(jQuery);

