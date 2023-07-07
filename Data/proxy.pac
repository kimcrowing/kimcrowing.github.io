function FindProxyForURL(url, host) {
  // 定义代理服务器的地址和端口，可以同时支持http和socks
  var proxy = "PROXY 113.206.13.167:7890; SOCKS5 113.206.13.167:7891";
  // 定义需要代理的域名列表，这里只有google和youtube
  var domains = [".google.", ".youtube.", ".pipe.aria.microsoft.", ".bing.", ".openai.", ".twitter.", ".facebook."];
  // 检查当前域名是否在列表中，如果是则返回代理服务器
  for (var i = 0; i < domains.length; i++) {
    if (shExpMatch(host, "*" + domains[i] + "*")) {
      return proxy;
    }
  }
  // 否则直接连接
  return "DIRECT";
}
