/**
 * CloudFront Function (Viewer Request)
 *
 * O origin S3 REST não mapeia `/pf/` para `/pf/index.html`.
 * Também remove o hash do parceiro (`/{hash}/pf/` → `/pf/index.html`)
 * para o Next.js static export continuar servindo as rotas reais.
 */
function handler(event) {
  var request = event.request
  var uri = request.uri

  if (uri.includes(".")) {
    return request
  }

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
  if (parts.length && !known[parts[0]]) {
    parts = parts.slice(1)
    uri = parts.length ? "/" + parts.join("/") : "/"
  }

  if (uri !== "/" && !uri.endsWith("/")) {
    uri += "/"
  }

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html"
  } else {
    request.uri = uri + "/index.html"
  }

  return request
}
