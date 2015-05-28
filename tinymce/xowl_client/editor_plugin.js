/**
 * Created by OXE Development Team on 21/05/15.
 */
(function($) {
    var fillSuggestionsField, openXowlDialog, processSemantic, removeSuggestion, replaceXowlAnnotations;
    /* Register the buttons */
    tinymce.create('tinymce.plugins.XowlButton', {
        init : function(ed, url) {
            /**
             * Enhance your content
             */
            ed.addButton( 'button_eek', {
                title : 'Enhance your content',
                //TODO: Search for a better Xowl icon
                image : '../wp-content/plugins/wp-xowl-client/assets/imgs/enhance.png',
                onclick : function() {
                    //ed.selection.getContent();
                    //alert(tinyMCE.activeEditor.getContent());
                    $loader = $("<div/>", {
                        "class": 'loader'
                    });
                    $("<img/>").attr('src', './../wp-content/plugins/wp-xowl-client/assets/imgs/loader.gif').appendTo($loader);
                    $('body').css("position", "relative").append($loader);
                    var data = {
                        'action': '',
                        'content': tinyMCE.activeEditor.getContent(),
                        'type': 'POST',
                        'dataType': "json"
                    };
                    $.post(ajaxurl, data, function(response) {
                        alert('Got this from the server: ' + response);
                    });
                    $.ajax({
                        type: 'POST',
                        dataType: "json",
                        //TODO: change this endpoint for the object of XowlService class
                        url: 'http://x8.ximdex.net/xowl/api/v1/enhancer',
                        data: {
                            content: tinyMCE.activeEditor.getContent()
                        }
                    }).done(function(data) {
                        $loader.remove();
                        alert(data);
                        if (data && (data.text != null) && data.text.length > 0) {
                            alert(data);
                            tinyMCE.activeEditor.setContent(function() {
                                    //TODO: Adapt this for TinyMCE
                                    this.insertHtml(replaceXowlAnnotations(data));
                                    //fillSuggestionsField();
                                }
                            );
                        } else {
                            alert("ERROR#1: "+data.status + ": " + data.message);
                        }
                    }).fail(function() {
                        $loader.remove();
                        alert("Error retrieving content from Xowl Service");
                    });
                    //TODO: only replace the semantic links
                    //tinyMCE.activeEditor.setContent('') ;
                }
            });
        }
    });
    /* Start the buttons */
    tinymce.PluginManager.add( 'my_button_script', tinymce.plugins.XowlButton );

    replaceXowlAnnotations = function(result) {
        var arr, newHref, newLink, oldHref, oldLink, re, reHref, src;
        re = /<a[^<]*<\/a>/g;
        reHref = /href="([^"]*)"/;
        src = result.text;
        while ((arr = re.exec(src)) !== null) {
            oldLink = arr[0];
            reHref.exec(oldLink);
            oldHref = RegExp.$1;
            newHref = oldHref.replace('dbpedia.org/resource', 'en.wikipedia.org/wiki');
            newLink = oldLink.replace(oldHref, newHref);
            src = src.replace(oldLink, newLink);
        }
        processSemantic(result.semantic);
        return src;
    };

    processSemantic = function(aSemantic) {
        var ann, ent, entity, f, filteredEntities, mention, numSuggestions, oSemanticSet, sortedEntities, _i, _j, _k, _len, _len1, _len2;
        for (_i = 0, _len = aSemantic.length; _i < _len; _i++) {
            oSemanticSet = aSemantic[_i];
            filteredEntities = [];
            f = -1;
            sortedEntities = oSemanticSet.entities.sort(function(a, b) {
                return a.uri.localeCompare(b.uri);
            });
            for (_j = 0, _len1 = sortedEntities.length; _j < _len1; _j++) {
                ann = sortedEntities[_j];
                if (f === -1 || sortedEntities[f] !== ann) {
                    filteredEntities.push(ann);
                    f++;
                }
            }
            for (_k = 0, _len2 = filteredEntities.length; _k < _len2; _k++) {
                ent = filteredEntities[_k];
                ent.uri = ent.uri.replace('dbpedia.org/resource', 'en.wikipedia.org/wiki');
            }
            mention = oSemanticSet['selected-text'];
            entity = oSemanticSet.entities[0];
            numSuggestions = oSemanticSet.entities.length;
            //TODO: Adapt this code to TinyMMCE
            CKEDITOR.xowl.suggestions[mention.value] = entity.uri;
            CKEDITOR.xowl.entities[mention.value] = oSemanticSet.entities;
        }
    };


})(jQuery);