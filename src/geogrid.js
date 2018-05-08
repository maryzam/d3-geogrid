
import { default as computeMankres } from './munkres.js';

function calcSqrMagnitude(first, second) {
	let dx = first[0] - second[0];
	let dy = first[1] - second[1];
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
			weights.push(calcSqrMagnitude([item.x, item.y], cell.center));
		}
		matrix.push(weights);
	}
	//expand the matrix to use hungarian algorithm 
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

	let type = 'rect';
	let width = 150;
	let height = 100;	
	let spreadCoeff = 1;
  
  	function calculateGrid(source) {
  		const ratio = width / height;
  		const totalY = Math.ceil(Math.sqrt((source.length * spreadCoeff) / ratio));
  		const totalX = Math.ceil(totalY * ratio);
  		const size = Math.round(height / (totalY  + 1));
  		const offset = size / 2;
  		const grid = [];
  		for (let x = 0; x < totalX; x++) {
  			for (let y = 0; y < totalY; y++) {
  				const center = [(x * size) + offset, (y * size) + offset];
  				grid.push({
  					center: center,
  					size: size,
  				});
  			}
  		}
  		return grid;
  	}

  	function getGraph(topology, objects) {
		const features = topojson.feature(topology, objects).features;
  		const neighbors = topojson.neighbors(objects.geometries);

		const nodes = features.map((d, i) => {
			const center = path.centroid(d);
			const bounds = path.bounds(d);
			const result = { id: d.id, center: center, bounds: bounds };
			result["x"] = center[0];
			result["y"] = center[1];
			return result
		});
		
		const linkDict = {};
		for (let i = 0; i < neighbors.length; i++) {
			const current = neighbors[i];
			for (let j = 0; j < current.length; j++) {
				const link = [nodes[i].id, nodes[current[j]].id].sort().join("_");
				linkDict[link] = link;
			}
		}
		const links = Object
						.keys(linkDict).map((d) => { 
							const s = d.split("_");
							return { "source": s[0], "target": s[1] };
						});
					
		const simulation = d3.forceSimulation(nodes)
						  .force('charge', d3.forceManyBody().strength(-1))
						  .force('center', d3.forceCenter(width / 2, height / 2))
						  .force('link', d3.forceLink().id(function(d) { return d.id; }).links(links))
						  .stop();	

		const totalTicks = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()));
		for (var i = 0; i < totalTicks; ++i) {
			    simulation.tick();
		};
		return nodes;
  	}
  	
	function geoGrid(topology, objects) {

		const graph =getGraph(topology, objects);
		const grid = calculateGrid(objects.geometries);
		const matrix = getCostMatrix(graph, grid);
		const result = computeMankres(matrix);
		const res = graph.map((d, i) => {
			const best = result[i];
			return Object.assign({}, graph[best[0]], grid[best[1]]);
		});
		return { 
			graph,
			grid,
			res
		}
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
