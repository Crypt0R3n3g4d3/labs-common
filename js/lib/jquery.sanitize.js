(function ($) {
  // A probably incomplete method of sanitizing HTML
  $.sanitize = function(s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
    return div.innerHTML;
  };
}(jQuery));

