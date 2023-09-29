var languages = {
  "af": "Afrikaans", 
  "ak": "Akan", 
  "sq": "Albanian", 
  "am": "Amharic", 
  "ar": "Arabic", 
  "hy": "Armenian", 
  "as": "Assamese", 
  "ay": "Aymara", 
  "az": "Azerbaijani", 
  "bn": "Bangla", 
  "eu": "Basque", 
  "be": "Belarusian", 
  "bho": "Bhojpuri", 
  "bs": "Bosnian", 
  "bg": "Bulgarian", 
  "my": "Burmese", 
  "ca": "Catalan", 
  "ceb": "Cebuano", 
  "zh-Hans": "Chinese (Simplified)", 
  "zh-Hant": "Chinese (Traditional)", 
  "co": "Corsican", 
  "hr": "Croatian", 
  "cs": "Czech", 
  "da": "Danish", 
  "dv": "Divehi", 
  "nl": "Dutch", 
  "en": "English", 
  "eo": "Esperanto", 
  "et": "Estonian", 
  "ee": "Ewe", 
  "fil": "Filipino", 
  "fi": "Finnish", 
  "fr": "French", 
  "gl": "Galician", 
  "lg": "Ganda", 
  "ka": "Georgian", 
  "de": "German", 
  "el": "Greek", 
  "gn": "Guarani", 
  "gu": "Gujarati", 
  "ht": "Haitian Creole", 
  "ha": "Hausa", 
  "haw": "Hawaiian", 
  "iw": "Hebrew", 
  "hi": "Hindi", 
  "hmn": "Hmong", 
  "hu": "Hungarian", 
  "is": "Icelandic", 
  "ig": "Igbo", 
  "id": "Indonesian", 
  "ga": "Irish", 
  "it": "Italian", 
  "ja": "Japanese", 
  "jv": "Javanese", 
  "kn": "Kannada", 
  "kk": "Kazakh", 
  "km": "Khmer", 
  "rw": "Kinyarwanda", 
  "ko": "Korean", 
  "kri": "Krio", 
  "ku": "Kurdish", 
  "ky": "Kyrgyz", 
  "lo": "Lao", 
  "la": "Latin", 
  "lv": "Latvian", 
  "ln": "Lingala", 
  "lt": "Lithuanian", 
  "lb": "Luxembourgish", 
  "mk": "Macedonian", 
  "mg": "Malagasy", 
  "ms": "Malay", 
  "ml": "Malayalam", 
  "mt": "Maltese", 
  "mi": "Māori", 
  "mr": "Marathi", 
  "mn": "Mongolian", 
  "ne": "Nepali", 
  "nso": "Northern Sotho", 
  "no": "Norwegian", 
  "ny": "Nyanja", 
  "or": "Odia", 
  "om": "Oromo", 
  "ps": "Pashto", 
  "fa": "Persian", 
  "pl": "Polish", 
  "pt": "Portuguese", 
  "pa": "Punjabi", 
  "qu": "Quechua", 
  "ro": "Romanian", 
  "ru": "Russian", 
  "sm": "Samoan", 
  "sa": "Sanskrit", 
  "gd": "Scottish Gaelic", 
  "sr": "Serbian", 
  "sn": "Shona", 
  "sd": "Sindhi", 
  "si": "Sinhala", 
  "sk": "Slovak", 
  "sl": "Slovenian", 
  "so": "Somali", 
  "st": "Southern Sotho", 
  "es": "Spanish", 
  "su": "Sundanese", 
  "sw": "Swahili", 
  "sv": "Swedish", 
  "tg": "Tajik", 
  "ta": "Tamil", 
  "tt": "Tatar", 
  "te": "Telugu", 
  "th": "Thai", 
  "ti": "Tigrinya", 
  "ts": "Tsonga", 
  "tr": "Turkish", 
  "tk": "Turkmen", 
  "uk": "Ukrainian", 
  "ur": "Urdu", 
  "ug": "Uyghur", 
  "uz": "Uzbek", 
  "vi": "Vietnamese", 
  "cy": "Welsh", 
  "fy": "Western Frisian", 
  "xh": "Xhosa", 
  "yi": "Yiddish", 
  "yo": "Yoruba", 
  "zu": "Zulu"
};

var queue = [];
var timer = 0;
var timeout = 1000;
var last_found = [];
var list_open = false;

// Saves options to chrome.storage
const saveOptions = () => {
  const language = document.getElementById('language').getAttribute("value");

  chrome.storage.sync.set(
    { language: language }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    { language: 'en' },
    (items) => {
      document.getElementById('language').setAttribute("value", items.language);
      document.getElementById('language').innerHTML = languages[items.language];
    }
  );
};


var container = document.getElementById("custom-select");
var selection = document.createElement("DIV");
selection.setAttribute("class", "select-selected");
selection.setAttribute("value", null);
selection.setAttribute("id", "language");
selection.innerHTML = "";
document.addEventListener('DOMContentLoaded', restoreOptions);
container.appendChild(selection);
var list = document.createElement("DIV");
list.setAttribute("class", "select-items select-hide");
for (let key of Object.keys(languages)) {
  var option = document.createElement("DIV");
  option.setAttribute("value", key);
  option.setAttribute("id", key);
  option.innerHTML = languages[key];
  option.addEventListener("click", function(e) {
      var selection_node = this.parentNode.previousSibling;
      selection_node.innerHTML = this.innerHTML;
      selection_node.setAttribute("value", this.getAttribute("value"));
      selection_node.click();
      saveOptions();
  });
  list.appendChild(option);
}
container.appendChild(list);
var padding = document.createElement("DIV");
padding.setAttribute("class", "select-padding select-hide");
container.appendChild(padding);
selection.addEventListener("click", function(e) {
  e.stopPropagation();
  closeAllSelect(true);
});

function closeAllSelect(toggle = false) {
  var list = document.getElementsByClassName("select-items")[0];
  var padding = document.getElementsByClassName("select-padding")[0];
  if (toggle === true) {
    list.classList.toggle("select-hide");
    padding.classList.toggle("select-hide");
    list_open = !list_open;
    queue = [];
    last_found = [];
    return;
  }
  list.classList.add("select-hide");
  padding.classList.add("select-hide");
  list_open = false;
  queue = [];
  last_found = [];
}

function delay(callback, ms) {
  var timer = 0;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback();
    }, ms || 0);
  };
}

function search() {
  var search_string = queue.join('');
  for (const [key, value] of Object.entries(languages)) {
    if (value.toLowerCase().startsWith(search_string)) {
      document.getElementById(key).scrollIntoView(
        {
          block: "center",
          inline: "center"
        }
      );
      last_found = [key, value];
      break;
    }
  }
}

function apply() {
  if (last_found.length !== 0) {
    var selection_node = document.getElementById("language");
    selection_node.innerHTML = last_found[1];
    selection_node.setAttribute("value", last_found[0]);
    closeAllSelect();
    saveOptions();
  }
}

document.addEventListener("click", closeAllSelect);
document.addEventListener("keydown", (event) => {
  var name = event.key;
  var code = event.code;

  clearTimeout(timer);

  if (code === "Escape") {
    closeAllSelect()
    return;
  }
  if (code === "Enter") {
    apply();
    return;
  }
  if (name.length > 0 && name.match(/.+/g)) {
    if (!list_open) { closeAllSelect(true); }
    queue.push(name);
    search();
  }

  timer = setTimeout(function () { queue = []; }, timeout || 0);
}, false);
