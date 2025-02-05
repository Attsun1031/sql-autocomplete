import { SimpleSQLTokenizer } from "../index";
import { Token } from "antlr4ts-sql";

test("SimpleSQLTokenizer correctly parses SQL queries with grave note", () => {
  let sqlString = "  SELECT * FROM `schema.table`";
  let tokenizer = new SimpleSQLTokenizer(sqlString, false, true);
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("`");
  expect(tokenizer.nextToken().text).toBe("schema");
  expect(tokenizer.nextToken().text).toBe(".");
  expect(tokenizer.nextToken().text).toBe("table");
  expect(tokenizer.nextToken().text).toBe("`");
  expect(tokenizer.nextToken().type).toBe(Token.EOF);
});

test("SimpleSQLTokenizer correctly parses SQL queries", () => {
  let sqlString = "SELECT * FROM table";
  let tokenizer = new SimpleSQLTokenizer(sqlString, false);
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table");
  expect(tokenizer.nextToken().type).toBe(Token.EOF);

  sqlString = "  SELECT \t* \r\n FROM  table   ";
  tokenizer = new SimpleSQLTokenizer(sqlString, false);
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table");
  expect(tokenizer.nextToken().type).toBe(Token.EOF);

  sqlString = "SELECT * FROM table WHERE column = 'test'";
  tokenizer = new SimpleSQLTokenizer(sqlString, false);
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table");
  expect(tokenizer.nextToken().text).toBe("WHERE");
  expect(tokenizer.nextToken().text).toBe("column");
  expect(tokenizer.nextToken().text).toBe("=");
  expect(tokenizer.nextToken().text).toBe("'test'");
  expect(tokenizer.nextToken().type).toBe(Token.EOF);

  sqlString = "SELECT * FROM table WHERE column = 'test and a missing quote";
  tokenizer = new SimpleSQLTokenizer(sqlString, false);
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table");
  expect(tokenizer.nextToken().text).toBe("WHERE");
  expect(tokenizer.nextToken().text).toBe("column");
  expect(tokenizer.nextToken().text).toBe("=");
  expect(tokenizer.nextToken().text).toBe("'test and a missing quote");
  expect(tokenizer.nextToken().type !== Token.EOF);

  sqlString = "SELECT * FROM table WHERE column = 'test and a \r\n newline'   ";
  tokenizer = new SimpleSQLTokenizer(sqlString, false);
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table");
  expect(tokenizer.nextToken().text).toBe("WHERE");
  expect(tokenizer.nextToken().text).toBe("column");
  expect(tokenizer.nextToken().text).toBe("=");
  expect(tokenizer.nextToken().text).toBe("'test and a \r\n newline'");
  expect(tokenizer.nextToken().type).toBe(Token.EOF);

  sqlString =
    "SELECT * FROM table; SELECT * FROM table2 ;SELECT * FROM table3;SELECT * FROM table4 ; ";
  tokenizer = new SimpleSQLTokenizer(sqlString, false);
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table");
  expect(tokenizer.nextToken().text).toBe(";");
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table2");
  expect(tokenizer.nextToken().text).toBe(";");
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table3");
  expect(tokenizer.nextToken().text).toBe(";");
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table4");
  expect(tokenizer.nextToken().text).toBe(";");
  expect(tokenizer.nextToken().type).toBe(Token.EOF);

  sqlString = "SELECT * FROM table1 t1 where t1.column1 = 0;";
  tokenizer = new SimpleSQLTokenizer(sqlString, false);
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table1");
  expect(tokenizer.nextToken().text).toBe("t1");
  expect(tokenizer.nextToken().text).toBe("where");
  expect(tokenizer.nextToken().text).toBe("t1");
  expect(tokenizer.nextToken().text).toBe(".");
  expect(tokenizer.nextToken().text).toBe("column1");
  expect(tokenizer.nextToken().text).toBe("=");
  expect(tokenizer.nextToken().text).toBe("0");
  expect(tokenizer.nextToken().text).toBe(";");
  expect(tokenizer.nextToken().type).toBe(Token.EOF);

  sqlString = "SELECT * FROM table1 t1 where (t1.column1 = 0);";
  tokenizer = new SimpleSQLTokenizer(sqlString, false);
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe("table1");
  expect(tokenizer.nextToken().text).toBe("t1");
  expect(tokenizer.nextToken().text).toBe("where");
  expect(tokenizer.nextToken().text).toBe("(");
  expect(tokenizer.nextToken().text).toBe("t1");
  expect(tokenizer.nextToken().text).toBe(".");
  expect(tokenizer.nextToken().text).toBe("column1");
  expect(tokenizer.nextToken().text).toBe("=");
  expect(tokenizer.nextToken().text).toBe("0");
  expect(tokenizer.nextToken().text).toBe(")");
  expect(tokenizer.nextToken().text).toBe(";");
  expect(tokenizer.nextToken().type).toBe(Token.EOF);
});

test("SimpleSQLTokenizer can parse whitespace", () => {
  let sqlString = "  SELECT \t* \r\n FROM  table   ";
  let tokenizer = new SimpleSQLTokenizer(sqlString, true);
  expect(tokenizer.nextToken().text).toBe(" ");
  expect(tokenizer.nextToken().text).toBe(" ");
  expect(tokenizer.nextToken().text).toBe("SELECT");
  expect(tokenizer.nextToken().text).toBe(" ");
  expect(tokenizer.nextToken().text).toBe("\t");
  expect(tokenizer.nextToken().text).toBe("*");
  expect(tokenizer.nextToken().text).toBe(" ");
  expect(tokenizer.nextToken().text).toBe("\r");
  expect(tokenizer.nextToken().text).toBe("\n");
  expect(tokenizer.nextToken().text).toBe(" ");
  expect(tokenizer.nextToken().text).toBe("FROM");
  expect(tokenizer.nextToken().text).toBe(" ");
  expect(tokenizer.nextToken().text).toBe(" ");
  expect(tokenizer.nextToken().text).toBe("table");
  expect(tokenizer.nextToken().text).toBe(" ");
  expect(tokenizer.nextToken().text).toBe(" ");
  expect(tokenizer.nextToken().text).toBe(" ");
  expect(tokenizer.nextToken().type).toBe(Token.EOF);
});
