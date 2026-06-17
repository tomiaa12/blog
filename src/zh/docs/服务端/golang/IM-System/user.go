package main

import (
	"net"
	"strings"
)

type User struct {
	Name string
	Addr string
	C    chan string
	conn net.Conn

	server *Server
}

// 创建一个用户
func NewUser(conn net.Conn, server *Server) *User {
	user := &User{
		Name:   conn.RemoteAddr().String(),
		Addr:   conn.RemoteAddr().String(),
		C:      make(chan string),
		conn:   conn,
		server: server,
	}

	// 监听用户消息
	go user.ListenMessage()

	return user
}

// 监听用户消息
func (this *User) ListenMessage() {
	for {
		msg := <-this.C
		this.conn.Write([]byte(msg + "\n"))
	}
}

// 用户上线
func (this *User) Online() {
	// 添加用户到在线用户列表
	this.server.mapLock.Lock()
	this.server.OnlineMap[this.Name] = this
	this.server.mapLock.Unlock()

	// 广播用户上线消息
	this.server.Broadcast(this, "已上线")

}

// 用户下线
func (this *User) Offline() {
	// 添加用户到在线用户列表
	this.server.mapLock.Lock()
	delete(this.server.OnlineMap, this.Name)
	this.server.mapLock.Unlock()

	// 广播用户上线消息
	this.server.Broadcast(this, "下线")
}

// 发送给当前客户端消息
func (this *User)sendMsg(msg string) {
  this.conn.Write([]byte(msg))
}

// 用户处理消息的业务
func (this *User) DoMessage(msg string) {
	if msg == "who" {
		this.server.mapLock.RLock()
		for _, user := range this.server.OnlineMap {
			onlineMsg := "[" + user.Addr + "]" + user.Name + ":" + "在线...\n"
      this.sendMsg(onlineMsg)
		}
		this.server.mapLock.RUnlock()
	} else if len(msg) > 4 && msg[:3] == "to|" {
    // 私聊
    remoteName := strings.Split(msg, "|")[1]
    if remoteName == "" {
      this.sendMsg("消息格式不正确，请使用 \"to|张三|你好啊\" 的格式")
      return
    }
    remoteUser, ok := this.server.OnlineMap[remoteName]
    if !ok {
      this.sendMsg("用户不存在")
      return
    }
    content := strings.Split(msg, "|")[2]
    if content == "" {
      this.sendMsg("消息不能为空")
      return
    }
    remoteUser.sendMsg(this.Name + " 对你说: " + content)
    this.sendMsg("你对 " + remoteName + " 说: " + content)
	} else if len(msg) > 7 && msg[:7] == "rename|" {
    // 修改用户名
    newName := strings.Split(msg, "|")[1]
    _, ok := this.server.OnlineMap[newName]
    if ok {
      this.sendMsg("用户名已存在")
      return
    }else {
      this.server.mapLock.Lock()
      delete(this.server.OnlineMap, this.Name)
      this.server.OnlineMap[newName] = this
      this.Name = newName
      this.server.mapLock.Unlock()
      this.sendMsg("您已经更新用户名: " + newName)
      this.server.Broadcast(this, "用户" + this.Name + " 已经更新用户名: " + newName)
    }
	} else {
		this.server.Broadcast(this, msg)
	}
}
