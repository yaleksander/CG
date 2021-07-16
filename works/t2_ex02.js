
var nmax = 100;
var dmin = 10;
var dmax = 100;
var h1min = 1;
var h1max = 6;
var w1min = 1;
var w1max = 2;
var h2min = 3;
var h2max = 9;
var w2min = 5;
var w2max = 7;
var n = Math.floor(Math.random() * (nmax - 50)) + 50;
var r = 2 * Math.PI / n;
var wood = [];
var leaf = [];
var scene = document.querySelector('a-scene');
for (var i = 0; i < n; i++)
{
	var d  = Math.random() * ( dmax -  dmin) +  dmin;
	var h1 = Math.random() * (h1max - h1min) + h1min;
	var w1 = Math.random() * (w1max - w1min) + w1min;
	var h2 = Math.random() * (h2max - h2min) + h2min;
	var w2 = Math.random() * (w2max - w2min) + w2min;
	wood.push(document.createElement("a-entity"));
	leaf.push(document.createElement("a-entity"));
	wood[i].setAttribute("material", "color", "#7d623e");
	wood[i].setAttribute("position", 
	{
		x: d * Math.sin(i * r),
		y: h1 / 2,
		z: d * Math.cos(i * r)
	});
	wood[i].setAttribute("geometry",
	{
		primitive: "cylinder",
		radius: w1.toString(),
		height: h1.toString()
	});
	leaf[i].setAttribute("material", "color", "#319c0b");
	leaf[i].setAttribute("position", 
	{
		x: d * Math.sin(i * r),
		y: h1 + h2 / 2,
		z: d * Math.cos(i * r)
	});
	leaf[i].setAttribute("geometry",
	{
		primitive: "cone",
		radiusTop: "0",
		radiusBottom: w2.toString(),
		height: h2.toString()
	});
	scene.appendChild(wood[i]);
	scene.appendChild(leaf[i]);
}
