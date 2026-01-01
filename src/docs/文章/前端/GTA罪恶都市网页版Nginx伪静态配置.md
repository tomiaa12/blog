# GTA 罪恶都市网页版 Nginx 伪静态配置

```nginx
# 静态资源匹配（新增 modules/ 目录，覆盖所有前端资源：dist/、modules/、各类js/jpg/mp4等）
location ~* ^/(dist/|modules/|index\.js|GamepadEmulator\.js|cover\.jpg|game\.js|idbfs\.js|intro\.mp4|jsdos-cloud-sdk\.js) {
    # 优先查找根目录，再自动映射到 dist/ 目录下（解决 /modules/xxx 对应 /dist/modules/xxx）
    try_files $uri $uri/ /dist/$uri =404;
    expires 1d;
    add_header Cache-Control "public, max-age=86400";
}

# vcsky 本地游戏资源处理
location /vcsky/ {
    try_files $uri $uri/ /index.php?$query_string;
}

# SPA 路由 fallback（转发未匹配请求到 index.php）
location / {
    try_files $uri $uri/ /index.php?$query_string;
}

# Brotli 压缩文件支持
location ~* \.br$ {
    if ($http_accept_encoding ~* "br") {
        add_header Content-Encoding br;
        add_header Content-Type "";
    }
    try_files $uri =404;
}

# 跨域头配置（确保WASM及游戏资源加载不被拦截）
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;
```


```php
# index.php 入口文件
<?php
// ---------------- CONFIG ----------------
//$VCSKY_BASE_URL = "https://cdn.dos.zone/vcsky/";
//$BR_BASE_URL    = "https://br.cdn.dos.zone/vcsky/";
$VCSKY_BASE_URL = "https://gtavc.aiys.net/vcsky/";
$BR_BASE_URL    = "https://gtavc.aiys.net/vcbr/";
$BASE_PATH      = '';                // public base URL
$DIST_PATH      = __DIR__ . '/dist'; // local directory for SPA

// ---------------- HELPERS ----------------

// Build URL with query string
function build_url($base, $path) {
    $query = $_SERVER['QUERY_STRING'];
    $url = rtrim($base, '/') . '/' . ltrim($path, '/');
    if ($query) {
        $url .= '?' . $query;
    }
    return $url;
}

// Proxy request using cURL
function proxy_request($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

    // Forward headers
    $headers = [];
    foreach (getallheaders() as $key => $value) {
        if (!in_array(strtolower($key), ['host', 'content-length'])) {
            $headers[] = "$key: $value";
        }
    }
    $headers[] = "Cross-Origin-Opener-Policy: same-origin";
    $headers[] = "Cross-Origin-Embedder-Policy: require-corp";
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    // Forward body for POST/PUT/PATCH
    if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
    }

    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

    $header_text = substr($response, 0, $header_size);
    $body = substr($response, $header_size);

    foreach (explode("\r\n", $header_text) as $header) {
        if ($header && stripos($header, 'Content-Length') === false) {
            header($header, false);
        }
    }

    echo $body;
    curl_close($ch);
}

// ---------------- ROUTING ----------------
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Proxy /vcsky/*
if (preg_match('#^' . $BASE_PATH . '/vcsky/(.*)#', $uri, $matches)) {
    $url = build_url($VCSKY_BASE_URL, $matches[1]);
    proxy_request($url);
    exit;
}

// Proxy /vcbr/*
if (preg_match('#^' . $BASE_PATH . '/vcbr/(.*)#', $uri, $matches)) {
    $url = build_url($BR_BASE_URL, $matches[1]);
    proxy_request($url);
    exit;
}


// Serve static files under $BASE_PATH
if (strpos($uri, $BASE_PATH) === 0) {
    $relativePath = substr($uri, strlen($BASE_PATH));
    if ($relativePath === '' || $relativePath === '/') {
        $relativePath = '/index.html';
    }

    $localFile = realpath($DIST_PATH . $relativePath);

    // Ensure the file exists AND is inside $DIST_PATH
    if ($localFile && is_file($localFile) && str_starts_with($localFile, realpath($DIST_PATH))) {
        // Set MIME type manually for common extensions
        $ext = pathinfo($localFile, PATHINFO_EXTENSION);
        switch (strtolower($ext)) {
            case 'js':
                $mimeType = 'application/javascript';
                break;
            case 'css':
                $mimeType = 'text/css';
                break;
            case 'html':
            case 'htm':
                $mimeType = 'text/html';
                break;
            case 'json':
                $mimeType = 'application/json';
                break;
            case 'wasm':
                $mimeType = 'application/wasm';
                break;
            default:
                $mimeType = mime_content_type($localFile) ?: 'application/octet-stream';
        }

        header("Content-Type: $mimeType");
        header("Cross-Origin-Opener-Policy: same-origin");
        header("Cross-Origin-Embedder-Policy: require-corp");
        readfile($localFile);
        exit;
    }

    // SPA fallback only for HTML requests
    if (str_ends_with($uri, '/') || preg_match('/\.html$/', $uri)) {
        $indexFile = $DIST_PATH . '/index.html';
        if (is_file($indexFile)) {
            header("Content-Type: text/html");
            header("Cross-Origin-Opener-Policy: same-origin");
            header("Cross-Origin-Embedder-Policy: require-corp");
            readfile($indexFile);
            exit;
        }
    }
}

// 404 fallback
http_response_code(404);
echo "Not Found";
```