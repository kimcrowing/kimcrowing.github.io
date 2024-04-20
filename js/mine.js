function showPasswordPrompt() {
    var passwordHash= "7C2ECD07F155648431E0F94B89247D713C5786E1E73E953F2FE7ECA39534CD6D"; // 设置正确的密码
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
function shownext() {
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
		window.open(searchURL, '_blank');
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