function FindProxyForURL(url, host) {
  var proxy = "PROXY 113.206.1.144:7890"; //您的代理服务器
  var direct = "DIRECT"; //直接连接

  //本地地址直接连接
  if (isPlainHostName(host)) {
    return direct;
  }

  //google域名和youtube域名通过代理访问
  if (shExpMatch(host, "*.google.*") || shExpMatch(host, "*.youtube.*")) || shExpMatch(host, "*.pipe.aria.microsoft.*")) || shExpMatch(host, "*.bing.*")) {
    return proxy;
  }

  //其余的域名不通过代理直接访问
  return direct;
}
