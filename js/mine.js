function showPasswordPrompt() {
    var passwordHash = "7c2ecd07f155648431e0f94b89247d713c5786e1e73e953f2fe7eca39534cd6d"; // 设置正确的密码哈希
    var input = prompt("请输入访问密码：");
    var inputHash = CryptoJS.SHA256(input).toString();
    
    if (inputHash === passwordHash) {
        showthink();
        return input; // 返回明文密码作为密钥
    } else {
        alert("密码错误，请重新输入或退出浏览器!");
        return null; // 密码错误返回 null
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

    // 硬编码加密 Passkey（替换为你的加密字符串）
    const encryptedPasskey = 'U2FsdGVkX1/yP6psZ7QSpo+u87R1biYFA5GH7Eva7m8VLlqashyLJfYUyi56qJftfUxKWz/kskgLJUid/NOG8g=='; // 替换为步骤1生成的加密字符串

    // 输入密码作为密钥
    const secretKey = showPasswordPrompt(); // 借用现有函数输入密码
    if (!secretKey) {
        content.innerHTML = '<li style="color: red; text-align: center; padding: 10px;">未输入密码，无法加载 RSS！</li>';
        return;
    }

    // 解密 Passkey
    let PASSKEY;
    try {
        PASSKEY = CryptoJS.AES.decrypt(encryptedPasskey, secretKey).toString(CryptoJS.enc.Utf8);
        if (!PASSKEY) throw new Error('解密失败');
    } catch (error) {
        content.innerHTML = '<li style="color: red; text-align: center; padding: 10px;">密码错误，解密失败！</li>';
        return;
    }

    const RSS_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(
        'https://springsunday.net/torrentrss.php?rows=40&cat501=1&cat502=1&cat503=1&cat505=1&cat508=1&med1=1&med4=1&med2=1&med6=1&med7=1&cod1=1&cod2=1&sta1=1&internal=1&ismalldescr=1&isize=1&freeleech=1&fl=1&passkey=' + PASSKEY
    );
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
                const link = item.link || '#';
                const downloadLink = link.replace('details.php', 'download.php') + (PASSKEY ? '&passkey=' + PASSKEY : '');
                const description = item.contentSnippet || item.description || ''; // 无描述时为空
                
                li.innerHTML = `
                    <span class="index-column">${index + 1}</span>
                    <a href="${downloadLink}" target="_blank">${item.title || '无标题'}</a>
                    <p>${description}</p>
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











