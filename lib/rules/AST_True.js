/**
 * <p>Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE file for information about licensing.</p>
 *
 * This rule represents the true literal
 *
 * @module rules/AST_True
 * @author Bryan Hughes &lt;<a href='mailto:bhughes@appcelerator.com'>bhughes@appcelerator.com</a>&gt;
 * @see ECMA-262 Spec Chapter 11.1.3
 */

/**
 * @name module:rules/AST_True.rule
 * @event
 * @property {String} ruleName The string 'AST_True'
 * @property {module:AST.node} ast The AST node that is an instance of this rule
 * @property {String} file The file that the rule begins on.
 * @property {Integer} line The line of the file where the rule begins on.
 * @property {Integer} column The column of the file where the rule begins on.
 * @property {Boolean} processingComplete Indicates whether the rule has been processed yet or not. This can be used to
 *		determine if this is the pre-evalutation event or the post-evaluation event.
 * @property {module:Base.BaseType} result The null value that was created. Only available post-evaluation.
 */

var AST = require('../AST'),
	RuleProcessor = require('../RuleProcessor'),
	Base = require('../Base');

AST.registerRuleProcessor('AST_True', function processRule() {

	var result;

	RuleProcessor.fireRuleEvent(this, {}, false);
	RuleProcessor.logRule('AST_True');

	result = new Base.BooleanType(true);

	RuleProcessor.fireRuleEvent(this, {
		result: result
	}, true);

	return result;
});