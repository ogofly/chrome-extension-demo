# reload page monitor
若当前 tab 的网页崩溃或任何原因卡住无响应 则会触发重新打开的逻辑。  
原理若下：  

- 注入脚本到页面，定时发送心跳消息到插件
- 插件判断若心跳超时，则新打开当前页面，关闭旧的
- 新页面打开后，通过执行脚本对页面做一些操作（比如收起菜单栏）以达到需要默认展示的目的 

为了让页面全屏打开，初始打开时执行以下命令：

- Windows 下：
```bash
taskkill /IM chrome.exe
start chrome --kiosk <website-url>
```
- MacOS 下：
```bash
pkill 'Google Chrome'
open -a 'Google Chrome' --args --kiosk  <website-url>
```
