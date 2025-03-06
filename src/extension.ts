import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("VSCode 注释插件已激活！");

  let classComment = vscode.commands.registerCommand(
    "extension.generateClassComment",
    () => generateClassComment()
  );

  let methodComment = vscode.commands.registerCommand(
    "extension.generateMethodComment",
    () => generateMethodComment()
  );

  context.subscriptions.push(classComment, methodComment);
}

export function deactivate() {}
function generateClassComment() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
	  return;
	}
  
	const document = editor.document;
	const selection = editor.selection;
	const line = selection.start.line;
  
	// 获取当前行文本
	const text = document.lineAt(line).text.trim();
  
	// 匹配 class
	const classMatch = text.match(/class\s+(\w+)/);
	if (!classMatch) {
	  vscode.window.showWarningMessage("未检测到 TypeScript/JavaScript 类");
	  return;
	}
  
	const className = classMatch[1];
  
	// 生成 JSDoc
	const comment = `/**\n * ${className} 类\n * \n * @class ${className}\n */\n`;
  
	// 插入注释
	editor.edit((editBuilder) => {
	  editBuilder.insert(new vscode.Position(line, 0), comment);
	});
  }
  function generateMethodComment() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
	  return;
	}
  
	const document = editor.document;
	const selection = editor.selection;
	const line = selection.start.line;
  
	// 获取当前行文本
	const text = document.lineAt(line).text.trim();
  
	// 匹配方法签名（支持普通方法 & async 方法）
	const methodMatch = text.match(/(async\s+)?(\w+)\s*\(([^)]*)\)\s*(:\s*\w+)?/);
	if (!methodMatch) {
	  vscode.window.showWarningMessage("未检测到方法定义");
	  return;
	}
  
	const methodName = methodMatch[2]; // 方法名
	const params = methodMatch[3].split(",").map((p) => p.trim()).filter((p) => p);
	const returnType = methodMatch[4] ? methodMatch[4].replace(":", "").trim() : "void";
  
	// 生成 JSDoc
	let comment = `/**\n * ${methodName} 方法\n *\n`;
	params.forEach((param) => {
	  const [paramName, paramType] = param.split(":").map((p) => p.trim());
	  comment += ` * @param {${paramType || "any"}} ${paramName} 参数描述\n`;
	});
	comment += ` * @returns {${returnType}} 返回值描述\n */\n`;
  
	// 插入注释
	editor.edit((editBuilder) => {
	  editBuilder.insert(new vscode.Position(line, 0), comment);
	});
  }
  