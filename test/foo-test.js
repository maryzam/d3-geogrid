import test from "tape";
import foo from "../src/foo";

test("foo() returns the answer to the ultimate question of life, the universe, and everything.",
	function(tst) {
  		tst.equal(foo(), 42);
  		tst.end();
	}
);
