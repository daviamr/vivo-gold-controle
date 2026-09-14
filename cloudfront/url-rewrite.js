/**
 * CloudFront Function (Viewer Request)
 *
 * O origin S3 REST não mapeia `/pf/` para `/pf/index.html`.
 * Remove o hash do parceiro mesmo quando a URI já termina em `index.html`
 * (`/{hash}` e `/{hash}/index.html` → `/index.html`, `/{hash}/pf/` → `/pf/index.html`).
 * Assets reais (js, css, imagens) passam direto.
 */
function handler(event) {
  var request = event.request
  var uri = request.uri

  var known = {
    pf: true,
    pj: true,
    "politica-de-privacidade": true,
    "termos-de-uso": true,
    editar: true,
    "editar-concluido": true,
    retomar: true,
  }

  var parts = uri.split("/").filter(Boolean)
  var last = parts.length ? parts[parts.length - 1] : ""
  var dot = last.lastIndexOf(".")
  var ext = dot !== -1 ? last.substring(dot + 1).toLowerCase() : ""
  var isHtml = ext === "html"
  var isAsset = Boolean(ext) && !isHtml

  if (isAsset) {
    return request
  }

  if (parts.length && !known[parts[0]] && parts[0] !== "index.html" && parts[0] !== "_next") {
    parts = parts.slice(1)
  }

  if (!parts.length || (parts.length === 1 && parts[0] === "index.html")) {
    request.uri = "/index.html"
    return request
  }

  if (parts[parts.length - 1] === "index.html") {
    request.uri = "/" + parts.join("/")
    return request
  }

  uri = "/" + parts.join("/")
  if (!uri.endsWith("/")) {
    uri += "/"
  }
  request.uri = uri + "index.html"
  return request
}
