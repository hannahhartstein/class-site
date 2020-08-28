var queryPartOf = blocks.find(({is_contributed}) => is_contributed == false);
var queryContributor = blocks.find(({is_contributed}) => is_contributed == true);

if (queryPartOf) {
    document.querySelector('.part-of').style.display = "grid";
}

if (queryContributor) {
    document.querySelector('.contributed-label').style.display = "inline-block";
    document.querySelector('.contributed').style.display = "grid";
}

async function queryBlock(block, type) {
    const res = await fetch('../../api/' + type + '.json');
    const data = await res.json();

    // Find posts from API
    var api = await data.posts.find(({slug}) => slug == block.slug);

    // Append title
    var titleEl = document.createElement('a');
    titleEl.href = api.permalink;
    titleEl.className = 'block title-block ' + type;
    titleEl.setAttribute('style', `color: ${api.color}; background-color: ${api.bg_color};`);
    if (block.is_contributed != true) {
        var title = (api.short_title == null) ? api.title : api.short_title;
    } else {
        var title = api.title;
    }
    var typeTitle = (api.essay != true) ? type : 'Essay';
    titleEl.innerHTML = `
        <div class="inner">
            <div class="type" style="color: ${api.bg_color}; background-color: ${api.color}; border: 1px dotted ${api.color};">${typeTitle}</div>
            <h2>${title}</h2>
        </div>
    `;
    if (block.is_contributed != true) {
        document.querySelector('.part-of').appendChild(titleEl);
    } else {
        document.querySelector('.contributed').appendChild(titleEl);
    }

    // Check if is_contributed
    if (block.is_contributed != true) {

        // Append recommendations
        if (typeof api.recommendations != 'undefined') {
            if (api.recommendations != '\n') {
                var recEl = document.createElement('div');
                recEl.className = 'block rec-block ' + api.slug;
                recEl.setAttribute('style', `color: ${api.bg_color}; background-color: ${api.color};`);
                recEl.innerHTML = `
                ${api.recommendations}
                `;
                document.querySelector('.part-of').appendChild(recEl);
            }
        }

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `.${api.slug} {border: 1px dotted ${api.bg_color};} .${api.slug} a {color: ${api.bg_color}; border-bottom: 1px dotted ${api.bg_color};} .${api.slug} a:hover {color: ${api.bg_color}; border-bottom: 1px solid ${api.bg_color};} a.block {border: 1px dotted ${api.color};} a.block:hover {border: 1px solid ${api.color};}`;
        document.getElementsByTagName('head')[0].appendChild(style);

        // Append quotes
        for (let quote of api.quotes) {
            if (quote != null) {
                if (typeof quote != 'undefined') {
                    var quoteEl = document.createElement('div');
                    quoteEl.className = 'block quote-block';
                    quoteEl.setAttribute('style', `color: ${api.color}; background-color: ${api.bg_color};`);
                    quoteEl.innerHTML = `
                        <p>&ldquo;${quote}&rdquo;</p>
                    `;
                    document.querySelector('.part-of').appendChild(quoteEl);
                }
            }
        }

    } // End if is_contributed
}

(async () => {
    for await (let block of blocks) {
        await queryBlock(block, block.type);
        await checkFooter();
    }

    // Push the footer down
    async function checkFooter(){
        var window_height = $(window).height();
        var document_height = $(document).height();
    
        if(document_height > window_height){
          $('#footer').removeClass('bottom');
        }
        else {
          $('#footer').addClass('bottom');
        }
      }
    
    await checkFooter();

    $(window).resize(async function() {
        await checkFooter();
    });
})();