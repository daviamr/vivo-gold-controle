/**
 * CloudFront Function (Viewer Request)
 *
 * O origin S3 REST não mapeia `/pf/` para `/pf/index.html`.
 * Remove o hash do parceiro e, quando existir, o do consultor
 * (`/{parceiro}` e `/{parceiro}/{consultor}` → `/index.html`,
 * `/{parceiro}/pf/` e `/{parceiro}/{consultor}/pf/` → `/pf/index.html`).
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

  var stripped = 0
  while (
    stripped < 2 &&
    parts.length &&
    !known[parts[0]] &&
    parts[0] !== "index.html" &&
    parts[0] !== "_next"
  ) {
    parts = parts.slice(1)
    stripped++
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
