# nginx 代理 502 的情况

SSL 握手失败加上`proxy_ssl_server_name on`

```nginx
location ^~ /{
  proxy_pass https://xxx.com;
  proxy_ssl_server_name on;
}
```
