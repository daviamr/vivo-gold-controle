/**
 * CloudFront Function (Viewer Request)
 *
 * O origin S3 REST não mapeia `/pf/` para `/pf/index.html`.
 * Sem este rewrite, o CloudFront devolve o index.html da raiz (HTML)
 * para rotas e JS que não existem — daí o "Unexpected token '<'".
 */
function handler(event) {
  var request = event.request
  var uri = request.uri

  if (uri.includes(".")) {
    return request
  }

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html"
  } else {
    request.uri = uri + "/index.html"
  }

  return request
}
