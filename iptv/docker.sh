#!/bin/bash

echo "请选择要安装的容器："
echo "1. Portainer"
echo "2. Alist"
echo "3. Qinglong"
echo "4. Clash"
echo "5. Webssh"
echo "6. Rclone"
echo "7. Mitmproxy"
echo "0. 退出"

read -p "请输入您的选择：" choice

case $choice in
  1)
    echo "正在安装 Portainer..."
    docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest
    echo "Portainer 安装成功！"
    ;;
  2)
    echo "正在安装 Alist..."
    docker run -d --restart=always -v $PWD/docker/alist:/opt/alist -p 5244:5244 -e PUID=0 -e PGID=0 -e UMASK=022 --name="alist" xhofe/alist-aria2
    echo "Alist 安装成功！"
    ;;
  3)
    echo "正在安装 Qinglong..."
    docker run -dit -v $PWD/docker/ql/data:/ql/data -p 5700:5700 --name qinglong --hostname qinglong --restart unless-stopped whyour/qinglong:latest
    echo "Qinglong 安装成功！"
    ;;
  4)
    echo "正在安装 Clash..."
    docker run --name clash -dit --restart=always -v ~/docker/clash:/root/.config/clash -p 7890:7890 -p 9095:9090 dreamacro/clash-premium:latest 
    echo "Clash 安装成功！"
    ;;
  5)
    echo "正在安装 Webssh..."
    docker run -d --net=host --log-driver json-file --log-opt max-file=1 --log-opt max-size=100m --restart always --name webssh -e TZ=Asia/Shanghai -e savePass=true jrohy/webssh
    echo "Webssh 安装成功！"
    ;;
  6)
    echo "正在安装 Rclone..."
    docker run -dit --name rclone -v $PWD/docker/rclone/config:/config/rclone -v $PWD/docker/rclone/share:/webdav:shared --device /dev/fuse --cap-add SYS_ADMIN --security-opt apparmor:unconfined --restart always rclone/rclone mount webdav:/ /webdav --cache-dir /tmp --allow-other --vfs-cache-mode writes --allow-non-empty
    echo "Rclone 安装成功！"
    ;;
  5)
    echo "正在安装 Mitmproxy..."
    docker run -dit --name mitmproxy --platform linux/arm64 -v ~/docker/mitmproxy/.mitmproxy:/home/mitmproxy/.mitmproxy -p 8082:8080 -p 8081:8081 mitmproxy/mitmproxy mitmweb --web-host 0.0.0.0 
    echo "Mitmproxy 安装成功！"
    ;;
  0)
    echo "退出..."
    exit 0
    ;;
  *)
    echo "无效的选择！"
    exit 1
    ;;
esac
