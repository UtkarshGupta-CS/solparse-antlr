const fs = require('fs');
const path = require('path');
const antlr4 = require('antlr4/index');
const { SolidityLexer } = require('../lib/SolidityLexer');
const { SolidityParser } = require('../lib/SolidityParser');
const ASTBuilder = require('./ASTBuilder');

function parse(input) {
  const chars = antlr4.CharStreams.fromString(input);
  const lexer = new SolidityLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);

  const parser = new SolidityParser(tokens);

  parser.buildParseTrees = true;

  const tree = parser.sourceUnit();

  const visitor = new ASTBuilder();
  const ast = visitor.visit(tree);

  return ast;
}

function parseFile(file) {
  return parse(fs.readFileSync(path.resolve(file), { encoding: 'utf8' }));
}

exports.parse = parse;
exports.parseFile = parseFile;
