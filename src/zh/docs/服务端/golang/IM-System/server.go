package main

import (
	"fmt"
	"io"
	"net"
	"sync"
	"time"
)

type Server struct {
	IP   string
	Port int

	// 在线用户列表
	OnlineMap map[string]*User
	mapLock   sync.RWMutex

	// 消息广播的 channel
	Message chan string
}

// 创建一个 server 的接口
func NewServer(ip string, port int) *Server {
	server := &Server{
		IP:        ip,
		Port:      port,
		OnlineMap: make(map[string]*User),
		Message:   make(chan string),
	}
	return server
}

// 监听 Message channel ，一旦有消息，就发送给全部的在线用户
func (this *Server) ListenMessage() {
	for {
		msg := <-this.Message
		// 发送给全部的在线用户
		this.mapLock.RLock()
		for _, cli := range this.OnlineMap {
			cli.C <- msg
		}
		this.mapLock.RUnlock()
	}
}

// 广播消息
func (this *Server) Broadcast(user *User, msg string) {
	sendMsg := "[" + user.Addr + "]" + user.Name + ":" + msg
	// 发送给message，message会发送给用户
	this.Message <- sendMsg
}

// 用户连接
func (this *Server) Handler(conn net.Conn) {
	fmt.Println("连接建立成功")

	// 创建用户信息
	user := NewUser(conn, this)

	// fmt.Println("用户信息:", user)

	// 用户上线
	user.Online()

	// 是否活跃的 channel
	isLive := make(chan bool)

	// 读取客户端发送的消息
	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := conn.Read(buf)
			if n == 0 {
				user.Offline()
				return
			}

			// 文件的末尾都会有 EOF
			if err != nil && err != io.EOF {
				fmt.Println("conn.Read err:", err)
				return
			}

			// 提取用户的消息，去除 \n
			msg := string(buf[:n-1])

			// 用户处理消息
			user.DoMessage(msg)

			isLive <- true
		}
	}()

	// 阻塞
	for {
		select {
		case <-isLive:
			continue
		// After 返回一个 channel，会阻塞 case ，如果 10 秒后，没有收到消息，则执行 case 中的内容
		case <-time.After(time.Second * 60):
			user.sendMsg("你被踢了")
      // 销毁资源
      close(user.C)
      conn.Close()
      return
		}
	}
}

// 启动服务器
func (this *Server) Start() {
	// socket 监听
	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", this.IP, this.Port))
	if err != nil {
		fmt.Println("net.Listen err:", err)
		return
	}
	// 关闭连接
	defer listener.Close()

	go this.ListenMessage()

	for {
		// 等待客户端连接
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("listener.Accept err:", err)
			continue
		}
		// 启动一个协程处理客户端连接
		go this.Handler(conn)
	}

}
