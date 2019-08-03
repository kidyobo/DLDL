########################################
########T#E#P#P#E#I#T#O#O#L#K#I#T#######
########################################
@teppei, 2016/8/31

【运行环境】
1. perl(v5.16.3)，可能需要安装一些第三方包。
2. python(v3.4.1)，需安装msgpack-python，安装包见download目录，windows下执行cmd命令python setup.py install。

【使用方法】
1. 本工具用于将表格xml转换为json格式，同时过滤掉空结构和无效字段。
2. 使用者需配置config\env\${user}.ini和config\game\${game_name}.ini。前者为环境配置，目前暂无需配置；后者为各个游戏的配置。
3. 双击xml2json_launcher.bat按提示使用。