// 确保 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    // 不默认加载任何标签页
});

function showPasswordPrompt() {
    const passwordHash = "7c2ecd07f155648431e0f94b89247d713c5786e1e73e953f2fe7eca39534cd6d";
    const input = prompt("请输入访问密码：");
    if (!input) {
        alert("密码不能为空！");
        return null;
    }
    const inputHash = CryptoJS.SHA256(input).toString();
    if (inputHash === passwordHash) {
        return input;
    } else {
        alert("密码错误，请重新输入或退出浏览器！");
        return null;
    }
}

// 清空卡片容器
function clearCardContainer() {
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer) {
        console.error('Error: #card-container not found in DOM');
        return;
    }
    cardContainer.style.opacity = '0';
    setTimeout(() => {
        cardContainer.innerHTML = '';
        cardContainer.style.display = 'none'; // 确保清空后隐藏
    }, 300);
}

// 加载卡片内容
function loadCardContent(contentElement) {
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer) {
        console.error('Error: #card-container not found in DOM');
        return;
    }
    if (!contentElement) {
        console.error('Error: contentElement is null');
        cardContainer.style.display = 'block';
        cardContainer.innerHTML = '<p style="color: red; text-align: center;">加载内容失败！</p>';
        return;
    }
    cardContainer.style.display = 'block'; // 显示卡片容器
    setTimeout(() => {
        cardContainer.innerHTML = contentElement.innerHTML;
        cardContainer.style.opacity = '1';
    }, 300);
}

function showthink() {
    const secretKey = showPasswordPrompt();
    if (!secretKey) {
        const cardContainer = document.getElementById('card-container');
        if (cardContainer) {
            cardContainer.style.display = 'block';
            cardContainer.innerHTML = '<p style="color: red; text-align: center;">密码错误，无法加载 Home！</p>';
        }
        return;
    }
    clearCardContainer();
    const hom = document.getElementById('hom');
    if (!hom) {
        console.error('Error: #hom not found in DOM');
        return;
    }
    loadCardContent(hom);
}

function showfavo() {
    clearCardContainer();
    const next = document.getElementById('next');
    if (!next) {
        console.error('Error: #next not found in DOM');
        return;
    }
    loadCardContent(next);
}

function showhot() {
    clearCardContainer();
    const hotpage = document.getElementById('hotpage');
    if (!hotpage) {
        console.error('Error: #hotpage not found in DOM');
        return;
    }
    loadCardContent(hotpage);
    fetchHotSearch('baidu');
}

function showRSS() {
    clearCardContainer();
    const content = document.getElementById('rss-content');
    if (!content) {
        console.error('Error: #rss-content not found in DOM');
        return;
    }
    content.innerHTML = '<li style="color: var(--text-color); text-align: center; padding: 8px;">正在加载 RSS...</li>';
    loadCardContent(content);

    // 硬编码加密 Passkey（替换为实际值）
    const encryptedPasskey = 'U2FsdGVkX1/yP6psZ7QSpo+u87R1biYFA5GH7Eva7m8VLlqashyLJfYUyi56qJftfUxKWz/kskgLJUid/NOG8g=='; // 替换为 Console 生成的值

    const secretKey = showPasswordPrompt();
    if (!secretKey) {
        content.innerHTML = '<li style="color: red; text-align: center; padding: 8px;">未输入密码，无法加载 RSS！</li>';
        loadCardContent(content);
        return;
    }

    let PASSKEY;
    try {
        PASSKEY = CryptoJS.AES.decrypt(encryptedPasskey, secretKey).toString(CryptoJS.enc.Utf8);
        if (!PASSKEY) throw new Error('解密失败');
    } catch (error) {
        console.error('Decryption Error:', error);
        content.innerHTML = '<li style="color: red; text-align: center; padding: 8px;">密码错误，解密失败！</li>';
        loadCardContent(content);
        return;
    }

    const RSS_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(
        'https://springsunday.net/torrentrss.php?rows=40&cat501=1&cat502=1&cat503=1&cat505=1&cat508=1&med1=1&med4=1&med2=1&med6=1&med7=1&cod1=1&cod2=1&sta1=1&internal=1&ismalldescr=1&isize=1&freeleech=1&fl=1&passkey=' + encodeURIComponent(PASSKEY)
    );
    console.log('RSS URL:', RSS_URL);
    const parser = new RSSParser();

    parser.parseURL(RSS_URL)
        .then(feed => {
            content.innerHTML = '';
            if (!feed.items || feed.items.length === 0) {
                content.innerHTML = '<li style="color: red; text-align: center; padding: 8px;">没有找到资源！</li>';
                loadCardContent(content);
                return;
            }
            feed.items.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'rss-item';
                const link = item.link || '#';
                const downloadLink = link.replace('details.php', 'download.php') + (PASSKEY ? '&passkey=' + encodeURIComponent(PASSKEY) : '');
                const description = item.contentSnippet || item.description || '';
                
                li.innerHTML = `
                    <span class="index-column">${index + 1}</span>
                    <a href="${downloadLink}" target="_blank">${item.title || '无标题'}</a>
                    <p>${description}</p>
                    <span class="num">发布时间: ${item.pubDate ? new Date(item.pubDate).toLocaleString() : '未知'}</span>
                `;
                content.appendChild(li);
            });
            loadCardContent(content);
        })
        .catch(error => {
            console.error('RSS Error:', error);
            content.innerHTML = '<li style="color: red; text-align: center; padding: 8px;">加载 RSS 失败: ' + error.message + '</li>';
            loadCardContent(content);
        });
}

var defaultEngine = 'bing';

function search(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        performSearch();
    }
}

function performSearch() {
    const query = document.getElementById('search-query')?.value;
    if (query?.trim() !== '') {
        const searchURL = defaultEngine === 'google' 
            ? 'https://www.google.com/search?q=' + encodeURIComponent(query)
            : 'https://www.bing.com/search?q=' + encodeURIComponent(query);
        window.location.href = searchURL;
    }
}

function fetchHotSearch(type) {
    const url = `https://nav.magictool.cn/plugins/topSearch/json?type=${type}`;
    console.log('Hot Search URL:', url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const hotSearchList = data.data;
            const sortedHotSearchList = hotSearchList.sort((a, b) => b.hot - a.hot);
            const listElement = document.getElementById('hotSearchList');
            if (!listElement) {
                console.error('Error: #hotSearchList not found in DOM');
                return;
            }
            listElement.innerHTML = '';
            sortedHotSearchList.forEach((item, index) => {
                const listItem = document.createElement('li');
                const indexColumn = document.createElement('span');
                indexColumn.className = 'index-column';
                indexColumn.textContent = index + 1;
                const title = document.createElement('a');
                title.href = item.url;
                title.target = '_blank';
                title.textContent = item.title;
                const hot = document.createElement('span');
                hot.className = 'num';
                hot.textContent = item.hot;
                listItem.appendChild(indexColumn);
                listItem.appendChild(title);
                listItem.appendChild(hot);
                listElement.appendChild(listItem);
            });
            loadCardContent(document.getElementById('hotpage'));
        })
        .catch(error => console.error('Error fetching hot search:', error));
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleButton(newTheme);
}

function updateThemeToggleButton(theme) {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
        toggleButton.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeToggleButton(initialTheme);
}
