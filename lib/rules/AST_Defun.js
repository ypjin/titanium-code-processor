/**
 * <p>Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE file for information about licensing.</p>
 *
 * Function definition.
 *
 * @module rules/AST_Defun
 * @author Bryan Hughes &lt;<a href='mailto:bhughes@appcelerator.com'>bhughes@appcelerator.com</a>&gt;
 * @see ECMA-262 Spec Chapter 13
 */

/**
 * @name module:rules/AST_Defun.rule
 * @event
 * @property {String} ruleName The string 'AST_Defun'
 * @property {module:AST.node} ast The AST node that is an instance of this rule
 * @property {String} file The file that the rule begins on.
 * @property {Integer} line The line of the file where the rule begins on.
 * @property {Integer} column The column of the file where the rule begins on.
 * @property {Boolean} processingComplete Indicates whether the rule has been processed yet or not. This can be used to
 *		determine if this is the pre-evalutation event or the post-evaluation event.
 * @property {String} identifier The function identifier. Only available post-evaluation.
 * @property {Array[String]} formalParameterList The list of parameters. Only available post-evaluation.
 * @property {Boolean} strict Indicates if the function is a strict mode function. Only available post-evaluation.
 * @property {module:Base.FunctionType} functionObject The function object. Only available post-evaluation.
 */

var AST = require('../AST'),
	RuleProcessor = require('../RuleProcessor'),
	Base = require('../Base'),
	Runtime = require('../Runtime');

AST.registerRuleProcessor('AST_Defun', function processRule() {

	var identifier = this.name.name,
		formalParameterList = [],
		functionBody = this.body,
		context = Runtime.getCurrentContext(),
		strict = context.strict || RuleProcessor.isBlockStrict(this),
		functionObject,
		i,
		len;

	RuleProcessor.fireRuleEvent(this, {}, false);
	RuleProcessor.logRule('AST_Defun', identifier);

	this.name._visited = true;

	for(i = 0, len = this.argnames.length; i < len; i++) {
		this.argnames[i]._visited = true;
		formalParameterList.push(this.argnames[i].name);
	}

	try {
		if (strict) {
			if (identifier === 'eval' || identifier === 'arguments') {
				Base.handleRecoverableNativeException('SyntaxError', identifier + ' is not a valid identifier name');
				throw 'Unknown';
			}
			for (i = 0, len = formalParameterList.length; i < len; i++) {
				if (formalParameterList[i] === 'eval' || formalParameterList[i] === 'arguments') {
					Base.handleRecoverableNativeException('SyntaxError', formalParameterList[i] + ' is not a valid identifier name');
					throw 'Unknown';
				}
				if (formalParameterList.indexOf(formalParameterList[i], i + 1) !== -1) {
					Base.handleRecoverableNativeException('SyntaxError', 'Duplicate parameter names are not allowed in strict mode');
					throw 'Unknown';
				}
			}
		}

		functionObject = new Base.FunctionType(formalParameterList, functionBody, context.lexicalEnvironment, strict);
	} catch(e) {
		if (e === 'Unknown') {
			functionObject = new Base.UnknownType();
		} else {
			throw e;
		}
	}

	RuleProcessor.fireRuleEvent(this, {
		identifier: identifier,
		formalParameterList: formalParameterList,
		strict: strict,
		functionObject: functionObject
	}, true);

	return functionObject;
});