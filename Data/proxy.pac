function FindProxyForURL(url, host) {
  // 定义代理服务器的地址和端口，可以同时支持http和socks
  var proxy = "PROXY 113.206.212.20:7890; SOCKS5 113.206.212.20:7891";
  // 定义需要代理的域名列表，这里只有google和youtube
  var domains = [".google.", ".googleusercontent.", ".github.", ".githubusercontent.", ".youtube.", ".pipe.aria.microsoft.", ".bing.", ".openai.", ".twitter.", ".facebook.", ".telegram.", ".wikipedia.", "airav_cc.", ".iqqtv.", ".javbus.", ".freejavbt.", ".jav321.", ".dmm.", ".javlibrary.", ".7mmtv.", ".hdouban.", ".javdb.", ".avsex.", ".lulubar.", ".airav.", ".xcity.", ".avsox.", ".mdtv.", ".iqqtv.", ".javbus.", ".freejavbt.", ".jav321.", ".avsox.", ".7mmtv.", ".hdouban.", ".javdb.", ".airav.", ".mdtv.", ".mgstage.", ".avsex.", ".jav321.", ".freejavbt.", ".7mmtv.", ".javbus.", ".javdb.", ".fc2.", ".fc2club.", ".fc2hub.", ".freejavbt.", ".7mmtv.", ".hdouban.", ".javdb.", ".avsox.", ".airav.", ".theporndb.", ".javdb.", ".javbus.", ".hdouban.", ".hdouban.", ".mdtv.", ".cnmdb."];
  // 检查当前域名是否在列表中，如果是则返回代理服务器
  for (var i = 0; i < domains.length; i++) {
    if (shExpMatch(host, "*" + domains[i] + "*")) {
      return proxy;
    }
  }
  // 否则直接连接
  return "DIRECT";
}
