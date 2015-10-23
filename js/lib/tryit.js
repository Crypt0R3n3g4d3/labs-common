// LiveDocs
define(["jquery", "purl", "mustache"], function($, purl, Mustache) {
  return {
    setup_livedocs: function(div) {
      $.when(
        $.ajax("/common/js/lib/tryit.mst")
      ).done(function(template) {
        div.find("a.tryit").each(function(idx, element) {
          var target = $(element).attr("href");
          var display = $(element).text();

          // Build up our Hurl link
          var url = purl(display);
          var params = {};
          $.each(url.param(), function(k, v) {
            params[k] = [v];
          });
          var query = $.param({
            "method" : "GET",
            "url" : url.attr("protocol") + "://" + url.attr("host") + url.attr("path"),
            "headers" : JSON.stringify({
              "X-App-Token" : ["bjp8KrRvAPtuf809u1UXnI0Z8"]
            }),
            "args" : JSON.stringify(params)
          });
          var hurl_url = 'http://hurl.it/?' + query;

          // Render our Mustache template
          var content = Mustache.render(template, {
            url: target,
            display_url: display,
            hurl_url : hurl_url
          });

          // Set up the live link
          var content = $(content);
          content.find('a.exec').click(function(event) {
            event.preventDefault();

            var the_href = $(this).attr('href');
            var the_link = $(this).closest('.tryit-link');

            // Progress indication
            var the_gear = the_link.find("i.fa-cog");
            the_gear.addClass("fa-spin");

            $.ajax({
              url: $(this).attr('href')
            }).done(function(data){
              the_gear.removeClass("fa-spin");

              // Create a results block after the link with the output
              tryit_block = $('<div class="results"><a class="remove" href="#"><i class="fa fa-times"></i> close</a><code class="request"><span class="verb">GET</span><span class=".url"></span></code><pre class="response prettyprint"></pre></div>');
              tryit_block.find('.response').text(JSON.stringify(data, undefined, 2));
              tryit_block.find('.url').text(the_href);

              // Hide any existing code blocks on the page
              $('.results').remove();

              // We either stick it after the link directly, or the larger paragraph/list element if it has one
              if(the_link.closest('p,ul,ol').size()) {
                the_link.closest('p,ul,ol,.tryit-block').after(tryit_block);
              } else {
                the_link.after(tryit_block);
                the_link.hide();
              }

              // Set up the remove link
              $(".results .remove").click(function(event) {
                event.preventDefault();
                $('.results').remove();
                $('.tryit-link').show();
              });
            }).fail(function(data){
              the_gear.attr("class", "fa fa-warning");
              alert("Something went wrong with your query... Please try again later.");
            });
          });
          $(element).replaceWith(content); 
        });
      });
    }
  };
});