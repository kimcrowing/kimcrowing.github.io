// 确保 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    console.log('DOM loaded, #card-container initial state: hidden');
});

// 状态标志，防止重复操作
let isLoading = false;

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
    if (isLoading) {
        console.log('clearCardContainer: Skipped due to ongoing operation');
        return;
    }
    isLoading = true;
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer) {
        console.error('Error: #card-container not found in DOM');
        isLoading = false;
        return;
    }
    console.log('clearCardContainer: Clearing content');
    cardContainer.style.display = 'none';
    cardContainer.classList.remove('show');
    cardContainer.innerHTML = '';
    isLoading = false;
}

// 加载卡片内容
function loadCardContent(contentElement) {
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer) {
        console.error('Error: #card-container not found in DOM');
        isLoading = false;
        return;
    }
    if (!contentElement) {
        console.error('Error: contentElement is null');
        cardContainer.style.display = 'block';
        cardContainer.innerHTML = '<p style="color: red; text-align: center;">加载内容失败！</p>';
        cardContainer.classList.add('show');
        console.log('loadCardContent: Failed to load content');
        isLoading = false;
        return;
    }
    console.log('loadCardContent: Loading content from', contentElement.id || contentElement.tagName);
    cardContainer.innerHTML = '';
    cardContainer.appendChild(contentElement);
    cardContainer.style.display = 'block';
    cardContainer.classList.add('show');
    // 强制重绘
    requestAnimationFrame(() => {
        cardContainer.style.opacity = '0';
        cardContainer.offsetHeight; // 触发 reflow
        cardContainer.style.opacity = '1';
        console.log('loadCardContent: Forced redraw of card-container');
        // 验证 hotSearchList 内容
        const hotSearchList = cardContainer.querySelector('#hotSearchList');
        if (hotSearchList) {
            console.log('loadCardContent: hotSearchList items:', hotSearchList.children.length);
        }
        isLoading = false;
    });
}

function showthink() {
    console.log('showthink: Triggered');
    const secretKey = showPasswordPrompt();
    if (!secretKey) {
        const cardContainer = document.getElementById('card-container');
        if (cardContainer) {
            cardContainer.style.display = 'block';
            cardContainer.innerHTML = '<p style="color: red; text-align: center;">密码错误，无法加载 Home！</p>';
            cardContainer.classList.add('show');
            console.log('showthink: Password error, showing error message');
        }
        isLoading = false;
        return;
    }
    clearCardContainer();
    const hom = document.getElementById('hom');
    if (!hom) {
        console.error('Error: #hom not found in DOM');
        isLoading = false;
        return;
    }
    loadCardContent(hom);
}

function showfavo() {
    console.log('showfavo: Triggered');
    clearCardContainer();
    const next = document.getElementById('next');
    if (!next) {
        console.error('Error: #next not found in DOM');
        isLoading = false;
        return;
    }
    loadCardContent(next);
}

function showhot() {
    console.log('showhot: Triggered');
    clearCardContainer();
    fetchHotSearch('baidu'); // 默认加载百度热搜
}

function fetchHotSearch(type) {
    console.log('fetchHotSearch: Triggered for type:', type);
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer) {
        console.error('Error: #card-container not found in DOM');
        isLoading = false;
        return;
    }
    // 显示加载中提示
    cardContainer.style.display = 'block';
    cardContainer.innerHTML = '<p style="color: var(--text-color); text-align: center; padding: 8px;">正在加载热搜...</p>';
    cardContainer.classList.add('show');

    const url = `https://nav.magictool.cn/plugins/topSearch/json?type=${type}`;
    console.log('fetchHotSearch: Fetching URL:', url);
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.code !== 1 || !data.data || data.data.length === 0) {
                console.log('fetchHotSearch: No valid data received');
                cardContainer.innerHTML = '<p style="color: red; text-align: center;">无热搜数据！</p>';
                cardContainer.classList.add('show');
                isLoading = false;
                return;
            }
            const hotSearchList = data.data;
            const sortedHotSearchList = hotSearchList.sort((a, b) => b.hot - a.hot);
            // 创建热搜内容
            const content = document.createElement('div');
            content.id = 'hotpage';
            // 创建导航栏
            const hotSearchNav = document.createElement('div');
            hotSearchNav.id = 'hot-search-nav';
            hotSearchNav.innerHTML = `
                <a href="javascript:void(0)" onclick="fetchHotSearch('weibo')">微博</a>
                <a>|</a>
                <a href="javascript:void(0)" onclick="fetchHotSearch('baidu')">百度</a>
                <a>|</a>
                <a href="javascript:void(0)" onclick="fetchHotSearch('bilibili')">哔站</a>
                <a>|</a>
                <a href="javascript:void(0)" onclick="fetchHotSearch('zhiHu')">知乎</a>
                <a>|</a>
                <a href="javascript:void(0)" onclick="fetchHotSearch('douyin')">抖音</a>
            `;
            // 创建热搜列表
            const listElement = document.createElement('ul');
            listElement.id = 'hotSearchList';
            sortedHotSearchList.forEach((item, index) => {
                const listItem = document.createElement('li');
                const indexColumn = document.createElement('span');
                indexColumn.className = 'index-column';
                indexColumn.textContent = index + 1;
                const title = document.createElement('a');
                title.href = item.url;
                title.target = '_blank';
                title.textContent = item.title || '无标题';
                const hot = document.createElement('span');
                hot.className = 'num';
                hot.textContent = item.hot ? (item.hot / 10000).toFixed(1) + '万' : '未知';
                listItem.appendChild(indexColumn);
                listItem.appendChild(title);
                listItem.appendChild(hot);
                listElement.appendChild(listItem);
            });
            content.appendChild(hotSearchNav);
            content.appendChild(listElement);
            console.log('fetchHotSearch: Hot search list updated, items:', sortedHotSearchList.length);
            console.log('fetchHotSearch: hotSearchList items in DOM:', listElement.children.length);
            // 加载到卡片容器
            loadCardContent(content);
            // 额外验证
            setTimeout(() => {
                const hotSearchListCheck = cardContainer.querySelector('#hotSearchList');
                if (hotSearchListCheck) {
                    console.log('fetchHotSearch: Verified hotSearchList items:', hotSearchListCheck.children.length);
                } else {
                    console.error('fetchHotSearch: hotSearchList not found in card-container');
                }
            }, 100);
            console.log('fetchHotSearch: Hot search content loaded');
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching hot search:', error);
            cardContainer.innerHTML = '<p style="color: red; text-align: center;">加载热搜失败: ' + error.message + '</p>';
            cardContainer.classList.add('show');
            console.log('fetchHotSearch: Hot search loading failed');
            isLoading = false;
        });
}

function showRSS() {
    console.log('showRSS: Triggered');
    clearCardContainer();
    const content = document.getElementById('rss-content');
    if (!content) {
        console.error('Error: #rss-content not found in DOM');
        isLoading = false;
        return;
    }
    content.innerHTML = '<li style="color: var(--text-color); text-align: center; padding: 8px;">正在加载 RSS...</li>';
    loadCardContent(content);

    const encryptedPasskey = 'U2FsdGVkX1/yP6psZ7QSpo+u87R1biYFA5GH7Eva7m8VLlqashyLJfYUyi56qJftfUxKWz/kskgLJUid/NOG8g=='; // 替换为实际值
    const secretKey = showPasswordPrompt();
    if (!secretKey) {
        content.innerHTML = '<li style="color: red; text-align: center; padding: 8px;">未输入密码，无法加载 RSS！</li>';
        loadCardContent(content);
        console.log('showRSS: Password error, showing error message');
        isLoading = false;
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
        console.log('showRSS: Decryption failed');
        isLoading = false;
        return;
    }

    const RSS_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(
        'https://springsunday.net/torrentrss.php?rows=40&cat501=1&cat502=1&cat503=1&cat505=1&cat508=1&med1=1&med4=1&med2=1&med6=1&med7=1&cod1=1&cod2=1&sta1=1&internal=1&ismalldescr=1&isize=1&freeleech=1&fl=1&passkey=' + encodeURIComponent(PASSKEY)
    );
    console.log('showRSS: Fetching RSS URL:', RSS_URL);
    const parser = new RSSParser();

    parser.parseURL(RSS_URL)
        .then(feed => {
            content.innerHTML = '';
            if (!feed.items || feed.items.length === 0) {
                content.innerHTML = '<li style="color: red; text-align: center; padding: 8px;">没有找到资源！</li>';
                loadCardContent(content);
                console.log('showRSS: No RSS items found');
                isLoading = false;
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
            console.log('showRSS: RSS content loaded');
            isLoading = false;
        })
        .catch(error => {
            console.error('RSS Error:', error);
            content.innerHTML = '<li style="color: red; text-align: center; padding: 8px;">加载 RSS 失败: ' + error.message + '</li>';
            loadCardContent(content);
            console.log('showRSS: RSS loading failed');
            isLoading = false;
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

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleButton(newTheme);
    console.log('toggleTheme: Switched to', newTheme);
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
    console.log('initializeTheme: Set theme to', initialTheme);
}
