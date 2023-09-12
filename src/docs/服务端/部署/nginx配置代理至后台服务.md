# nginx 配置代理至后台服务

- 配置 nginx

```nginx
server {
  listen 80;
  server_name your-domain.com;  # 替换为您的域名

  location / {
    proxy_pass http://127.0.0.1:3000;  # 这里的端口应该是您 Node.js 应用程序监听的端口
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

```

- 启用配置文件: `sudo ln -s /etc/nginx/sites-available/文件名 /etc/nginx/sites-enabled/`
- 测试 nginx 配置：`sudo nginx -t`
- 重启 nginx：`sudo systemctl reload nginx`
