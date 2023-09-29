function getDocument(vid, language) {
	var text = get_caption_text(vid, language);
	var html = `<!DOCTYPE html>
<html style="--font: &quot;Roboto Mono&quot;, &quot;Roboto Mono&quot;, &quot;Vazirmatn&quot;, monospace; ; ">
<head>
  <title>OwlTube</title>
  <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
	<link rel="preconnect" href="https://fonts.googleapis.com/">
	<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">
	<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&amp;display=swap" rel="stylesheet">
<style type="text/css" media="screen">
	body {
		color: gray;
		background-color: #26262a;
		margin: 0px
	}

	.background {
		background-color: #26262a;
	}

	.text {
		background-color: transparent;
		text-align: justify;
		font-family: var(--font);
		font-size: large;
		width: 70%;
		margin-left: 15%;
		margin-right: 15%;
	}

	.header {
		color: rgb(190, 190, 190);
		font-family: var(--font);
		margin: 20px;
		position: fixed;
		z-index: 2;
    cursor: default;
    user-select: none;
	}

	.mask1 {
		-webkit-mask-image: linear-gradient(black, transparent);
		mask-image: linear-gradient(black, transparent);
		height: 5%;
		width: 100%;
		position: fixed;
		z-index: 1;
		top: 30%;
	}

	.mask2 {
		-webkit-mask-image: linear-gradient(to top, black, transparent);
		mask-image: linear-gradient(to top, black, transparent);
		height: 5%;
		width: 100%;
		position: fixed;
		z-index: 1;
		top: 65%;
	}

	.mask3 {
		top: 0%;
		height: 30%;
		width: 100%;
		position: fixed;
		z-index: 1;
	}

	.mask4 {
		top: 70%;
		height: 30%;
		width: 100%;
		position: fixed;
		z-index: 1;
	}

	.buffer {
		padding-bottom: 34vh;
	}

</style></head>

<body>
	<h1 class="header">
		OwlTube
	</h1>
	<div class="background mask3"></div><div class="background mask1"></div>

	<div class="buffer"></div><div class="text">` + text 
		+ '</div><div class="buffer"></div><div class="background mask2"></div><div class="background mask4"></div></body></html>';
	return html;
}

function get_caption_text(vid, language) {
	var video_info_request_string = "https://www.youtube.com/watch?v=" + vid;
	var request = new XMLHttpRequest();
	request.open("GET", video_info_request_string, false);
	request.send();
	var video_info_json = JSON.parse(request.responseText.split('"captions":')[1].split(',"videoDetails')[0]);
	var caption_url = "";
  for (caption_track of video_info_json['playerCaptionsTracklistRenderer']['captionTracks']) {
    if (caption_track['kind'] === "asr") {
      caption_url = caption_track['baseUrl'];
      continue;
    }
    if (caption_track['languageCode'] !== language) { continue; }
    caption_url = caption_track['baseUrl'];
    break;
  }
  if (!caption_url) {
    caption_url = video_info_json['playerCaptionsTracklistRenderer']['captionTracks'][0]['baseUrl'];
  }
	request.open("GET", caption_url, false);
	request.send();
	var xml = request.responseXML;
  var transcript_node = xml.getElementsByTagName("transcript")[0];
  var text_nodes = transcript_node.childNodes;
  var text_arr = [];
  for (node of text_nodes) {
    if (!node.textContent) { continue; }
    text_arr.push(
      node.textContent.trim().replace(/&amp;#(\d\d);/g, function() {
        return String.fromCharCode(arguments[1]);
      })
    );
  }
  return text_arr.join(" ");
};


chrome.storage.sync.get(["language"]).then((language) => {
  const params = new URLSearchParams(window.location.search);
  document.write(getDocument(params.get("v"), language.language));
  document.close();
  window.scrollTo(0, 0);
});


// for my future self trying to understand what the hell this code does:
// F U! I AM NOT IN THE MOOD FOR COMMENTING THIS ****!
