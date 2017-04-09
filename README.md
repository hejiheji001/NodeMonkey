## NodeMonkey
A GreaseMonkey Like Node JS Platform

###Usage
#####1. Place Your UserScript File Into Folder _*rules*_

>For Windows, goto `C:\Users\{UserName}\AppData\Roaming\npm\node_modules\nodemonkey\rules`

>For OSX, goto `/usr/local/lib/node_modules/nodemonkey/rules`
#####2. Start Server `nodemonkey`
#####3. Install root CA, please refer to AnyProxy Project. [Chinese](https://github.com/alibaba/anyproxy/wiki/HTTPS%E7%9B%B8%E5%85%B3%E6%95%99%E7%A8%8B), [English](https://github.com/alibaba/anyproxy/wiki/How-to-config-https-proxy)
#####4. Active A Script By Access `http://localhost:3000/monkey?name={UserScriptFileName}`
#####5. Goto Your Desire Web Page To See If Your Script Is Activated.
>Sometimes you need to refresh the page twice.
