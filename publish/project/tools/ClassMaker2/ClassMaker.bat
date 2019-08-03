rmdir errorId /S /Q
rmdir xml /S /Q

svn checkout https://tc-scm.tencent.com/ied/ied_kylin_rep/Tool_proj/trunk/00.StarStory/Develop/xml xml

svn co --depth=empty https://tc-scm.tencent.com/ied/ied_kylin_rep/Tool_proj/trunk/00.StarStory/Develop/bin/Client errorId
cd errorId
svn up Errno.config.xml
cd..

ClassMaker.exe

@pause