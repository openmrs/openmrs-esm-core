export function patchXMLHttpRequest() {
  const send = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.send = function (...args) {
    return send.apply(this, args);
  };
}
