import test from "tape";
import geogrid from "../src/geogrid";

test("geogrid() returns the answer to the ultimate question of life, the universe, and everything.",
	function(tst) {
  		tst.equal(geogrid(), 42);
  		tst.end();
	}
);
