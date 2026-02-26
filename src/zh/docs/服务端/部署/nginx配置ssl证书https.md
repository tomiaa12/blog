# nginx 配置 ssl 证书 https

- 在你申请到 ssl 证书后，会有提供下载 nginx 的证书格式的文件（包括 xxx.key 与 xxx.pem 文件）
- 将 .pem 和 .key 文件复制到服务器：使用`rz`上传至`/etc/nginx/ssl/`
- 在`/etc/nginx/sites-available/`下创建 Nginx 配置文件:

```sh
sudo nano /etc/nginx/sites-available/myapp-https # myapp-https 就是你的文件名
# 编辑时按 ctrl+o 再按 enter 保存，接着 ctrl + x 退出编辑
```

- 配置你的证书地址

```nginx
server {
  listen 443 ssl; # https 默认为 443 端口
  server_name your-domain.com;  # 替换为您的域名

  ssl_certificate /etc/nginx/ssl/your-domain.pem;  # 证书文件的路径
  ssl_certificate_key /etc/nginx/ssl/your-domain.key;  # 私钥文件的路径
}
```

- 启用 HTTPS 配置文件: `sudo ln -s /etc/nginx/sites-available/myapp-https /etc/nginx/sites-enabled/`
- 测试 nginx 配置：`sudo nginx -t`
- 重启 nginx：`sudo systemctl reload nginx`
