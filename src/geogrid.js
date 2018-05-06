
import { default as computeMankres } from './munkres.js';

function calcSqrMagnitude(first, second) {
	let dx = first.center[0] - second.center[0];
	let dy = first.center[1] - second.center[1];
	return (dy * dy + dx * dx);
};

function getCostMatrix(geo, grid) {
	const matrix = [];
	for (let i = 0; i < geo.length; i++) {
		const weights = [];
		const item = geo[i]
		for (let j = 0; j < grid.length; j++) 
		{
			const cell = grid[j];
			weights.push(calcSqrMagnitude(item, cell));
		}
		matrix.push(weights);
	}
	// hack to use hungarian algorithm 
	for (let i =0; i < (grid.length - geo.length); i++) {
		const weights = [];
		for (let j = 0; j < grid.length; j++) {
			weights.push(0);
		}
		matrix.push(weights);
	}
	return matrix;	
};

export default function() {

	const path = d3.geoPath();

	let type = 'circle';
	let width = 150;
	let height = 100;	
	let spreadCoeff = 1;
  
  	function calculateGrid(source) {
  		const ratio = width / height;
  		const totalY = Math.ceil(Math.sqrt((source.length * spreadCoeff) / ratio));
  		const totalX = Math.ceil(totalY * ratio);
  		const size = Math.round(height / totalY);
  		const grid = [];
  		for (let x = 0; x < totalX; x++) {
  			for (let y = 0; y < totalX; y++) {
  				grid.push({
  					center: [(x * size), (y * size)],
  					size: size
  				});
  			}
  		}
  		return grid;
  	}

  	function calcGeoCenters(source) {
  		const geo = [];
		for (let i = 0; i < source.length; i++) {
			const item = source[i];
			const center = path.centroid(item);
			geo.push({
				data: item,
				center: center
			});
		}
		return geo;
  	}

	function geoGrid(source) {

		const geo = calcGeoCenters(source);
		const grid = calculateGrid(source);
		const matrix = getCostMatrix(geo, grid);
		const result = computeMankres(matrix);
		for (let i = 0; i < geo.length; i++) {
			const best = result[i];
			Object.assign(geo[best[0]], grid[best[1]]);
		}
		return geo;
	}

	geoGrid.projection = function(_) {
		return arguments.length ? 
				(path.projection(_), geoGrid) :
				path.projection();
	}

	geoGrid.type = function(_) {
		return arguments.length ? 
				(type = _, geoGrid) :
				 type;
	}

	geoGrid.width = function(_) {
		return arguments.length ? 
				(width = _, geoGrid) :
				 width;
	}

	geoGrid.height = function(_) {
			return arguments.length ? 
					(height = _, geoGrid) :
					 height;
	}

	geoGrid.spreadCoeff = function(_) {
			return arguments.length ? 
					(spreadCoeff = _, geoGrid) :
					 spreadCoeff;
	}


	return geoGrid;
};
