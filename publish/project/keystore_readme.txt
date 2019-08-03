密码： 654321

生成指令：
keytool -genkey -alias wj.keystore -keyalg RSA -validity 20000 -keystore wj.keystore 

创建日期：2015-04-02            thu Apr 02 16:26:46 CST 2015
有效期：2070年1月3日            fri jan 03 16:26:46 CST 2070


keystore信息的查看：
keytool -list -v -keystore wj.keystore -storepass 654321


 

keytool是java的bin目录下的一个生成密钥的工具.（装了jdk后就存在)