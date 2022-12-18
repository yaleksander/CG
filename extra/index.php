<!-- tutorial disponivel em: https://medium.com/chialab-open-source/ar-js-the-simpliest-way-to-get-cross-browser-ar-on-the-web-8f670dd45462 -->
<!-- (redirecionado da pagina de documentacao do AR.js) -->
<!DOCTYPE html>
<?php

function nearLantern($dist, $minAngle, $maxAngle, $minHeight, $maxHeight, $minDelta, $maxDelta, $opacity = 0.8)
{
	if ($minAngle < 0)
		$minAngle += 360;
	if ($maxAngle <= 0)
		$maxAngle += 360;
	$a = rand($minAngle  * 100, $maxAngle  * 100) / 100;
	$y = rand($minHeight * 100, $maxHeight * 100) / 100;
	$d = rand($minDelta  * 100, $maxDelta  * 100) / 100;
	$b = rand(0, 360);
	$x = $dist * cos($a * M_PI / 180);
	$z = $dist * sin($a * M_PI / 180);
	echo "<a-entity animation=\"property: position; from: " . $x . " " . $y . " " . $z . "; to: " . $x . " " . $y + $d . " " . $z . "; dur: " . rand(2500, 3500) . "; loop: true; easing: linear; dir: alternate; delay: " . rand(1, 6000) . "\">";
	echo "<a-cylinder src=\"assets/lantern.png\" radius=\"0.55\" height=\"2\" animation=\"property: rotation; from: 0 " . $b . " 0; to: 0 " . $b + 360 . " 0; dur: " . rand(4000, 6500) . "; loop: true; easing: linear; delay: " . rand(1, 6000) . ";\" opacity=\"" . $opacity . "\" open-ended=\"true\"></a-cylinder>";
	echo "</a-entity>";
}

function farLantern($dist, $angle, $delta, $opacity = 0.8)
{
	$a = rand(0, $delta * 90) / 100;
	$d = rand(0, 200) / 100;
	$y =    12 * sin((120 - $dist) * M_PI / 180);
	$x = $dist * cos(($angle + $a) * M_PI / 180);
	$z = $dist * sin(($angle + $a) * M_PI / 180);
	echo "<a-entity animation=\"property: position; from: " . $x . " " . $y . " " . $z . "; to: " . $x . " " . $y + $d . " " . $z . "; dur: " . rand(2500, 3500) . "; loop: true; easing: linear; dir: alternate; delay: " . rand(1, 6000) . "\">";
	echo "<a-cylinder color=\"#f5" . dechex(rand(96, 239)) . "42\" radius=\"0.25\" height=\"0.8\" opacity=\"" . $opacity . "\"></a-cylinder>";
	echo "</a-entity>";
}

?>
<html>
<head>
	<title>T03E01</title>
	<link rel="shortcut icon" href="../favicon.ico">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <script src="../libs/aframe/aframe.min.js"></script>
    <script src="../libs/aframe/aframe-extras.min.js"></script>
	<script src="https://jeromeetienne.github.io/AR.js/aframe/build/aframe-ar.js"></script>
</head>
<body>
	<a-scene embedded arjs>

		<a-marker-camera></a-marker-camera>

		<a-entity light="type: ambient; color: #ffffff; intensity: 0.6;"></a-entity>
		<a-entity light="type: point;   color: #ffffff; intensity: 0.8;"></a-entity>

		<?php
		for ($i = -60; $i <  60; $i += 30)
			nearLantern(10, $i + 3, $i + 27, 1, 2, 0.4, 0.7);
		for ($i = 120; $i < 240; $i += 30)
			nearLantern(10, $i + 3, $i + 27, 1, 2, 0.4, 0.7);
		for ($i =  15; $i < 360; $i += 30)
			nearLantern(18, $i + 3, $i + 27, 3, 5, 0.8, 1.2);
		for ($i =   0; $i <  50; $i +=  5)
		{
			$k = 360 / ($i + 5);
			echo $k . "<br>";
			for ($j = $k / 2; $j < 360; $j += $k)
				farLantern($i, $j, $k);
		}
		?>

<!--
		<a-entity animation="property: position; from: 5 2 -8.66; to: 5 1.5 -8.66; dur: 2500; loop: true; easing: linear; dir: alternate;">
			<a-cylinder src="assets/lantern.png" radius="0.55" height="2" animation="property: rotation; from: 0 360 0; to: 0 720 0; dur: 10000; loop: true; easing: linear; delay: 5000;" opacity="0.8" open-ended="true"></a-sphere>
		</a-entity>
-->
<!--
		<a-marker type='barcode' value='7'>
			<a-box position='0 0.5 0' color="yellow"></a-box>
		</a-marker>

		<a-marker id="animated-marker" type='barcode' value='6'>
			<a-entity
				gltf-model="#animated-asset"
				scale="2">
			</a-entity>
		</a-marker>
-->
		<!-- use this <a-entity camera> to support multiple-markers, otherwise use <a-marker-camera> instead of </a-marker> -->
		<!--<a-entity camera></a-entity>-->

	</a-scene>
</body>
</html>