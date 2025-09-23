function showPasswordPrompt() {
    var passwordHash= "7c2ecd07f155648431e0f94b89247d713c5786e1e73e953f2fe7eca39534cd6d"; // 设置正确的密码
    var input = prompt("请输入访问密码：");
	var inputHash = CryptoJS.SHA256(input).toString();
	
    if (inputHash === passwordHash) {
        showthink();
    } else {
        alert("密码错误，请重新输入或退出浏览器!");
    }
}
function loadcloudPage() {
    var cloudPage = document.getElementById('cloud-page');
    var cloudIframe = document.getElementById('cloud-iframe');
    cloudIframe.src = 'http://113.206.149.67:5244';
    cloudPage.style.display = 'block';
	cloudIframe.style.display = 'block';
}
function showthink() {
    var homePage = document.getElementById('hom-page');
    var homeIframe = document.getElementById('hom');
    homePage.style.display = 'block';
    homeIframe.style.display = 'block';
}
function showfavo() {
    var homePage = document.getElementById('next-page');
    var homeIframe = document.getElementById('next');
    homePage.style.display = 'block';
    homeIframe.style.display = 'block';
}
// 默认搜索引擎
var defaultEngine = 'bing';

// 监听输入框的按键事件
function search(event) {
  if (event.key === 'Enter' || event.keyCode === 13) {
    event.preventDefault(); // 阻止默认行为
    performSearch();
  }
}

// 更新搜索引擎图标（如果需要）
function updateIcon() {
  var engine = document.getElementById('search-engine').value;
  defaultEngine = engine; // 更新默认搜索引擎
  console.log('搜索引擎已切换为:', engine);
}

// 执行搜索
function performSearch() {
  var query = document.getElementById('search-query').value;

  if (query.trim() !== '') {
    var searchURL = '';
    if (defaultEngine === 'google') {
      searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(query);
    } else {
      searchURL = 'https://www.bing.com/search?q=' + encodeURIComponent(query);
    }
    window.location.href = searchURL; // 跳转到搜索结果页
  }
}
// 热搜榜
function showhot() {
    var homePage = document.getElementById('hotpage');
    var homeIframe = document.getElementById('hot-search-nav');
    homePage.style.display = 'block';
    homeIframe.style.display = 'block';
}

// 函数来获取和显示热搜数据
function fetchHotSearch(type) {
    const url = `https://nav.magictool.cn/plugins/topSearch/json?type=${type}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const hotSearchList = data.data;
            const sortedHotSearchList = hotSearchList.sort((a, b) => b.hot - a.hot); // 根据item.hot大小排序
            const listElement = document.getElementById('hotSearchList');
            listElement.innerHTML = ''; // 清空列表
            sortedHotSearchList.forEach((item, index) => {
                const listItem = document.createElement('li');
                const indexColumn = document.createElement('span');
                indexColumn.className = 'index-column';
                indexColumn.textContent = index + 1;
                const title = document.createElement('a');
                title.href = item.url; // 设置链接
                title.target = '_blank'; // 在新标签页中打开链接
                title.textContent = item.title;
                const hot = document.createElement('span');
                hot.className = 'num';
                hot.textContent = item.hot;
                listItem.appendChild(indexColumn);
                listItem.appendChild(title);
                listItem.appendChild(hot);
                listElement.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}

function showRSS() {
    // 隐藏其他模块
    document.getElementById('hom-page').style.display = 'none';
    document.getElementById('next-page').style.display = 'none';
    document.getElementById('hotpage').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    document.getElementById('rss-page').style.display = 'block';

    const content = document.getElementById('rss-content');
    content.innerHTML = '<li style="color: white; text-align: center; padding: 10px;">正在加载 RSS...</li>';

    const RSS_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://springsunday.net/torrentrss.php?rows=20&cat501=1&cat502=1&med7=1&cod1=1&cod2=1&sta1=1&internal=1&freeleech=1&fl=1&passkey=2878c08d261816a6266920ec33ea90d2');
    const parser = new RSSParser();

    parser.parseURL(RSS_URL)
        .then(feed => {
            content.innerHTML = '';
            if (!feed.items || feed.items.length === 0) {
                content.innerHTML = '<li style="color: red; text-align: center; padding: 10px;">没有找到资源！</li>';
                return;
            }
            feed.items.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'rss-item';
                li.innerHTML = `
                    <span class="index-column">${index + 1}</span>
                    <a href="${item.link || '#'}" target="_blank">${item.title || '无标题'}</a>
                    <p>${item.contentSnippet || item.description || '无描述'}</p>
                    <span class="num">发布时间: ${item.pubDate ? new Date(item.pubDate).toLocaleString() : '未知'}</span>
                `;
                content.appendChild(li);
            });
        })
        .catch(error => {
            content.innerHTML = '<li style="color: red; text-align: center; padding: 10px;">加载 RSS 失败: ' + error.message + '</li>';
        });
}
// 页面加载时默认获取微博热搜
window.onload = function() {
    fetchHotSearch('baidu');
};







