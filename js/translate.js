(function () {
    'use strict';
    var userLang = document.documentElement.lang;
    
    if (userLang!=="" && userLang.substr(0, 2) != "zh") {
        var script = document.createElement('script');
        script.src = '//translate.google.cn/translate_a/element.js?cb=googleTranslateElementInit';
        document.getElementsByTagName('head')[0].appendChild(script);

        var google_translate_element = document.createElement('div');
        google_translate_element.id = 'google_translate_element';
        google_translate_element.style = 'position:fixed; bottom:10px; right:10px; cursor:pointer;';
        document.documentElement.appendChild(google_translate_element);

        script = document.createElement('script');
        script.innerHTML = "function googleTranslateElementInit() {" +
            "new google.translate.TranslateElement({" +
            "layout: google.translate.TranslateElement.InlineLayout.SIMPLE," +
            "multilanguagePage: true," +
            "pageLanguage: 'auto'," +
            "includedLanguages: 'zh-CN,zh-TW,en'" +
            "}, 'google_translate_element');}";
        document.getElementsByTagName('head')[0].appendChild(script);
    }
})();
