const result = 42;

export defalut function() {

	const path = d3.geoPath();

	let type = 'circle';
	let size = 1;
  
	function geogrid(source) {

		const grid = [];
		for (let i = 0; i < source.length; i++) {
			const item = source[i];
			const center = path.centroid(item);
			const radius = Math.sqrt(path.area(item) / Math.PI);
			grid.push({
				data: item,
				center: center				
			});
		}

		return grid;
	}

	geogrid.projection = function(_) {
		return arguments.length ? 
				(path.projection(_), geogrid) :
				path.projection();
	}

	geogrid.type = function(_) {
		return arguments.length ? 
				(type = _, geogrid) :
				 type;
	}

	geogrid.size = function(_) {
		return arguments.length ? 
				(size = _, geogrid) :
				 size;
	}

	return geogrid();

};
