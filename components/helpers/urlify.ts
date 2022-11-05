export function urlify(text: string) {
  var urlRegex = /((?:https?:\/\/)?(?:[\da-z\.-]+)\.(?:[a-z\.]{2,6})(?:[\/\w \.-](?= )?))\/?/g;
  return text.replace(urlRegex, function (url: string) {
    return '<a target="_blank" href="' + url.trim() + '">' + url.trim() + '</a>';
  });
}
