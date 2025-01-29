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
function search(event) {
	var query = document.getElementById('search-query').value;
	var engine = document.getElementById('search-engine').value;
	if (query.trim() !== '' && event.key === 'Enter') {
		var searchURL = '';
		if (engine === 'google') {
			searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(query);
		} else {
			// 当 engine 不是 'google' 时，默认使用必应搜索引擎
			searchURL = 'https://www.bing.com/search?q=' + encodeURIComponent(query);
		}
		window.open(searchURL);
	}
}
function updateIcon() {
	var engine = document.getElementById('search-engine').value;
	var selectElement = document.getElementById('search-engine');
	if (engine === 'google') {
		selectElement.style.backgroundImage = "url('https://www.google.com/favicon.ico')";
	} else if (engine === 'bing') {
	selectElement.style.backgroundImage = "url('https://www.bing.com/favicon.ico')";
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

// 页面加载时默认获取微博热搜
window.onload = function() {
    fetchHotSearch('weibo');
};

