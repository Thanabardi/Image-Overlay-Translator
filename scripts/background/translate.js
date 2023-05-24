chrome.runtime.onMessage.addListener(function(message, sender, senderResponse){
  // translate(data)
  if(message.msg === "image"){
    fetch('https://some-random-api.ml/img/pikachu')
          .then(response => response.text())
          .then(data => {
            let dataObj = JSON.parse(data);
            senderResponse({data: dataObj, index: message.index});
          })
          .catch(error => console.log("error", error))
      return true;  // Will respond asynchronously.
  }
});

let data = {
  tkkHourlySalt: "443659.1100698392",
  delayBetweenCallsMs: "5000",
  srcLang: "en",
  targetLangs: "ja",
  skippedLangs: "ko,pt,it",
  inputLangCsv: "hello",
  outputLangCsv: "",
};


/** yu */
var addSalt = function(a, salt) {
  for (var c = 0; c < salt.length - 2; c += 3) {
      var d = salt.charAt(c + 2);
      d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
      d = "+" == salt.charAt(c + 1) ? a >>> d : a << d;
      a = "+" == salt.charAt(c) ? a + d & 4294967295 : a ^ d
  }
  return a
};

/**
* extracted from google translate api source code - translate_m.js
* 2020-08-11
*
* this function generates the &tk=12345.67890 parameter in query string of /translate_a/single
* API which is a hash from the text being translated + the hourly window.TKK salt
*/
var GoogleTranslateTk = function(srcText, TKK) {
  const d = TKK.split(".");
  TKK = Number(d[0]) || 0;
  for (var bytes = [], f = 0, g = 0; g < srcText.length; g++) {
      var h = srcText.charCodeAt(g);
      128 > h
          ? bytes[f++] = h
          : (2048 > h
              ? bytes[f++] = h >> 6 | 192
              : (55296 == (h & 64512) && g + 1 < srcText.length && 56320 == (srcText.charCodeAt(g + 1) & 64512)
                  ? (h = 65536 + ((h & 1023) << 10) + (srcText.charCodeAt(++g) & 1023),
                      bytes[f++] = h >> 18 | 240,
                      bytes[f++] = h >> 12 & 63 | 128)
                  : bytes[f++] = h >> 12 | 224,
                      bytes[f++] = h >> 6 & 63 | 128),
                      bytes[f++] = h & 63 | 128)
  }
  let hashMajor = TKK;
  for (let i = 0; i < bytes.length; i++) {
      hashMajor += bytes[i];
      hashMajor = addSalt(hashMajor, "+-a^+6");
  }
  hashMajor = addSalt(hashMajor, "+-3^+b+-f");
  hashMajor ^= Number(d[1]) || 0;
  0 > hashMajor && (hashMajor = (hashMajor & 2147483647) + 2147483648);
  hashMajor %= 1E6;
  return hashMajor + "." + (hashMajor ^ TKK);
};

const translate = async (mainForm) => {
const inputCsv = mainForm['inputLangCsv'];
if (!inputCsv) {
  throw new Error('Enter some text yopta');
}

mainForm['outputLangCsv'] = '';

const sourceLang = mainForm['srcLang'];
const targetLangs = mainForm['targetLangs'].split(',');
const excluded = mainForm['skippedLangs'].split(',');
// const TKK = '443658.3451255544'; // take from window.TKK on google translate page
const tkkHourlySalt = mainForm['tkkHourlySalt'];
const delayBetweenCallsMs = mainForm['delayBetweenCallsMs'];

for (const line of inputCsv.trim().split('\n')) {
  for (let i = 0; i < targetLangs.length; ++i) {
    const targetLang = targetLangs[i];
    let translated;
    const skipped = excluded.includes(targetLang);
    if (skipped) {
      translated = '';
    } else {
      const url = 'https://translate.google.com/translate_a/single?client=gtx&sl=' + sourceLang + '&tl=' + targetLang +
        '&hl=' + targetLang + '&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&otf=1&ssel=0&tsel=0&kc=7&q=' + encodeURIComponent(line) + '&tk=29979.29979';
      // const response = await fetch(url, {"mode": "cors", "credentials": "include"}).then(rs => rs.json());
      const query = [...new URLSearchParams({
        "client": "webapp",
        "sl": sourceLang, // source language
        "tl": targetLang, // target language
        "hl": targetLang, // dunno
        "dt": "t", // mandatory it seems
        "tk": GoogleTranslateTk(line, tkkHourlySalt),
        "q": line, // text to translate
      }).entries()].map(([k,v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
      const response = await fetch("https://translate.google.com/translate_a/single?" + query, {
        "method": "GET", "mode": "cors", "credentials": "include"
      }).then(rs => rs.json());
      const [sentences, , srcLang] = response;
      translated = sentences.map(([result, src]) => result).join('');
      //translated = response[0][0][0];
      // const response = await translate(line, {from: 'en', to: lang});
      // translated = response.text;
    }
    const delim = i < targetLangs.length - 1 ? '\t' : '\n';
    mainForm['outputLangCsv'] += translated + delim;
    console.log(mainForm['outputLangCsv']);
    if (!skipped) {
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * delayBetweenCallsMs)));
    }
  }
}
};