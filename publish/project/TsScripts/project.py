import os, re

sln = r'''Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio 2013
VisualStudioVersion = 12.0.21005.1
MinimumVisualStudioVersion = 10.0.40219.1
Project("{9092AA53-FB77-4645-B42D-1CCCA6BD08BD}") = "tss", ".tss.njsproj", "{B5B8EDED-B198-486F-94F3-90A577C70526}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{B5B8EDED-B198-486F-94F3-90A577C70526}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{B5B8EDED-B198-486F-94F3-90A577C70526}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{B5B8EDED-B198-486F-94F3-90A577C70526}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{B5B8EDED-B198-486F-94F3-90A577C70526}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
EndGlobal
'''

njsproj = r'''<?xml version="1.0" encoding="utf-8"?>
<Project DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ToolsVersion="4.0">
  <PropertyGroup>
    <VisualStudioVersion Condition="'$(VisualStudioVersion)' == ''">11.0</VisualStudioVersion>
    <VSToolsPath Condition="'$(VSToolsPath)' == ''">$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)</VSToolsPath>
    <Name>tss</Name>
    <RootNamespace>tss</RootNamespace>
    <DebuggerPort>9093</DebuggerPort>
    <NodeExePath>..\tools\debugger\debugger.cmd</NodeExePath>
  </PropertyGroup>
  <Import Project="$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props" Condition="Exists('$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props')" />
  <PropertyGroup>
    <Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>
    <SchemaVersion>2.0</SchemaVersion>
    <ProjectGuid>b5b8eded-b198-486f-94f3-90a577c70526</ProjectGuid>
    <ProjectHome>.</ProjectHome>
    <StartupFile>root.ts</StartupFile>
    <StartWebBrowser>False</StartWebBrowser>
    <SearchPath>
    </SearchPath>
    <WorkingDirectory>.</WorkingDirectory>
    <OutputPath>.</OutputPath>
    <TargetFrameworkVersion>v4.0</TargetFrameworkVersion>
    <ProjectTypeGuids>{3AF33F2E-1136-4D97-BBB7-1795711AC8B8};{9092AA53-FB77-4645-B42D-1CCCA6BD08BD}</ProjectTypeGuids>
    <ProjectView>ProjectFiles</ProjectView>
    <TypeScriptSourceMap>true</TypeScriptSourceMap>
    <TypeScriptModuleKind>commonjs</TypeScriptModuleKind>
    <EnableTypeScript>true</EnableTypeScript>
    <StartWebBrowser>False</StartWebBrowser>
    <BaseDirectory>Assets</BaseDirectory>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)' == 'Debug' ">
    <DebugSymbols>true</DebugSymbols>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)' == 'Release' ">
    <DebugSymbols>true</DebugSymbols>
  </PropertyGroup>
  <ItemGroup>
    {$Files}
  </ItemGroup>
  <ItemGroup>
    {$Folders}
  </ItemGroup>
  <ItemGroup>
    <Content Include="tsconfig.json" />
  </ItemGroup>
  <!-- Do not delete the following Import Project.  While this appears to do nothing it is a marker for setting TypeScript properties before our import that depends on them. -->
  <PropertyGroup Condition="'$(Configuration)' == 'Debug'">
    <TypeScriptTarget>ES5</TypeScriptTarget>
    <TypeScriptOutDir>.\.dist</TypeScriptOutDir>
    <TypeScriptNoEmitOnError>False</TypeScriptNoEmitOnError>
    <TypeScriptGeneratesDeclarations>False</TypeScriptGeneratesDeclarations>
    <TypeScriptJSXEmit>None</TypeScriptJSXEmit>
    <TypeScriptCompileOnSaveEnabled>True</TypeScriptCompileOnSaveEnabled>
    <TypeScriptNoImplicitAny>False</TypeScriptNoImplicitAny>
    <TypeScriptRemoveComments>True</TypeScriptRemoveComments>
    <TypeScriptOutFile />
    <TypeScriptMapRoot />
    <TypeScriptSourceRoot />
  </PropertyGroup>
  <Import Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets" Condition="False" />
  <Import Project="$(VSToolsPath)\Node.js Tools\Microsoft.NodejsTools.targets" />
</Project>
'''

class FileUtil:
    @staticmethod
    def findFiles(basepath, ext=''):
        rfiles = []
        for root, dirs, files in os.walk(basepath):
            for file in files:
                if ext != '' and re.search(r'\.' + ext + r'$', file) == None: continue
                rfiles.append(root + os.sep + file)
        return rfiles
    @staticmethod
    def write(fname, s):
        f = open(fname, "w")
        f.write(s)
        f.flush()
        f.close()

tsFolders = set()
tsFiles = FileUtil.findFiles('.', 'ts')
for file in tsFiles:
    segments = os.path.split(os.path.dirname(file)[2:])
    path = ''
    for s in segments:
        if s == '': continue;
        path = path + s + '\\'
        tsFolders.add(path);
    
includeFiles = ''    
for file in tsFiles:
    includeFiles = includeFiles + '    <TypeScriptCompile Include="' + file[2:]+ '" />\n'
    
includeFolders = ''
for folder in tsFolders:
    includeFolders = includeFolders + '    <Folder Include="' + folder + '" />\n'
    
FileUtil.write('.tss.sln', sln)
FileUtil.write('.tss.njsproj', njsproj.replace('{$Files}', includeFiles).replace('{$Folders}', includeFolders))

devenv = r'devenv'
os.system(devenv + ' .tss.sln');





























