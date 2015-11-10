$colorPicker.css('background', currentColor);

// FUNCTIONS
function changeColorBackground(event) {
	var xCoord = Math.abs(event.offsetX);
	var yCoord = Math.abs(event.offsetY);
	var rgbValues = 'rgb(' + rgb(hsl(xCoord, yCoord)) + ')';
	$(this).css('background', rgbValues);
};

function revertColorBackground(event) {
	$(this).css('background', currentColor);
};

function setCurrentColor(event) {
	var xCoord = Math.abs(event.offsetX);
	var yCoord = Math.abs(event.offsetY);
	var rgbValues = rgb(hsl(xCoord, yCoord));
	var hexValues = parseHEX(hex(rgbValues));
	currentColor = hexValues;
};

function hsl(xCoord, yCoord) {
	// HSL = hsl(hue, saturation, luminance)
	var hsl;
	var hue = xCoord * 2.43243243;
	var luminance = Math.round(((yCoord / 177) * 100));

	return [hue, 100, luminance];
};

function rgb(hslValues) {
	var hue = hslValues[0];
	var sat = hslValues[1] / 100;
	var lum = hslValues[2] / 100;
	var tempLum1, tempLum2, tempHue, tempR, tempG, tempB;

	if (lum < .50) {
		tempLum1 = lum * (1 + sat);
	} else {
		tempLum1 = (lum + sat) - (lum * sat);
	}

	tempLum2 = (2 * lum) - tempLum1;
	tempHue = hue / 360;

	tempR = tempHue + .333;
	tempG = tempHue;
	tempB = tempHue - .333;

	if (tempG < 0) { tempG += 1};
	if (tempG > 1) { tempG -= 1};
	if (tempB < 0) { tempB += 1};
	if (tempB > 1) { tempB -= 1};

	var normalizedRGB = [tempR, tempG, tempB].map(function(color, idx) {
		if (color < 0) { return color += 1};
		if (color > 1) { return color -= 1};
		return color
	});

	var rgbArray = normalizedRGB.map(function(color) {
		if (colorCondition1(color)) {
			return tempLum2 + ( tempLum1 - tempLum2 ) * 6 * color;
		} else if (colorCondition2(color)) {
			return tempLum1;
		} else if (colorCondition3(color)) {
			return tempLum2 + (tempLum1 - tempLum2) * (.666 - color) * 6;
		}	else {
			return tempLum2;
		}
	});

	var rgbValues = rgbArray.map(function(color, idx) {
		var convertedVal = color * 255;
		return Math.round(convertedVal);
	});

	return rgbValues;
};

function hex(rgbValues) {
	var r = rgbValues[0];
	var g = rgbValues[1];
	var b = rgbValues[2];

	return [numToHex(r), numToHex(g), numToHex(b)];
};

function numToHex(num) {
	var hexCode = num.toString(16);
	if (hexCode.length < 2) { hexCode = "0" + hexCode; }
	return hexCode;
};

function colorCondition1(val) {
	return 6 * val < 1;
};

function colorCondition2(val) {
	return 2 * val < 1;
};

function colorCondition3(val) {
	return 3 * val < 2;
};

function parseHSL(hslValues) {
	return [
		"hsl(",
		hslValues[0], ", ",
		hslValues[1], "%, ",
		hslValues[2], "%)"
	].join('');
};

function parseRGB(rgbValues) {
	return "rgb(" + rgbValues.join(', ') + ")";
}

function parseHEX(hexValues) {
	return "#" + hexValues.join('');
}

// EVENTS

$colorPicker.on('mousemove', changeColorBackground);
$colorPicker.on('mouseleave', revertColorBackground);
$colorPicker.on('click', setCurrentColor);