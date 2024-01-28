"use strict";

var attempthistory = [];
var runhistory = [];
var comparisons = [];
var attemptcount = 0;

function initiateimport(userinput) {
	setTimeout(function(){
    	importsplits(userinput);
    	window.location.href = "#overview";
	}, 500);
}

function importsplits(userinput) {
	window.addEventListener("beforeunload", preventunload);
	currentwindow = 'overview';
	attemptcount = parseInt(userinput.substring(userinput.indexOf("<AttemptCount>") + 14, userinput.indexOf("</AttemptCount>")));
	document.getElementById("splitstitle").innerHTML = userinput.substring(userinput.indexOf("<GameName>") + 10, userinput.indexOf("</GameName>")) + " - " + userinput.substring(userinput.indexOf("<CategoryName>") + 14, userinput.indexOf("</CategoryName>"));
	//Import attempts
	attempthistory = [];
	comparisons = [];
	var searchposition = [0, 0];
	var currentsplit = 0;
	var currentattempt = 0;
	var currentcomparison = 0;
	var lastsplit = 0;
	while (userinput.indexOf("<SplitTime", searchposition[0]) < userinput.indexOf("<SegmentHistory>", searchposition[0]) && userinput.indexOf("<SplitTime", searchposition[0]) != -1) {
		searchposition[0] = userinput.indexOf("<SplitTime", searchposition[0]);
		comparisons[currentcomparison] = userinput.substring(userinput.indexOf("name=\"", searchposition[0]) + 6, userinput.indexOf("\">", userinput.indexOf("name=\"", searchposition[0])));
		searchposition[0] = userinput.indexOf("</SplitTime>", searchposition[0]);
		currentcomparison++
	}
	searchposition = [0, 0];
	while (userinput.indexOf("<Segment>", searchposition[0]) != -1) {
		searchposition[0] = userinput.indexOf("<Segment>", searchposition[0]);
		attempthistory[currentsplit] = [];
		attempthistory[currentsplit][0] = userinput.substring(userinput.indexOf("<Name>", searchposition[0]) + 6, userinput.indexOf("</Name>", searchposition[0]));
		searchposition[0] = userinput.indexOf("<SplitTimes>", searchposition[0]);
		currentattempt = 1;
		currentcomparison = 0;
		attempthistory[currentsplit][1] = [];
		attempthistory[currentsplit][2] = [];
		while (currentcomparison < comparisons.length) {
			attempthistory[currentsplit][1][currentcomparison] = [];
			if (userinput.indexOf("<SplitTime name=\"" + comparisons[currentcomparison] + "\">", searchposition[0]) < userinput.indexOf("</Segment>", searchposition[0]) && userinput.indexOf("<SplitTime name=\"" + comparisons[currentcomparison] + "\">", searchposition[0]) != -1) {
				searchposition[0] = userinput.indexOf("<SplitTime name=\"" + comparisons[currentcomparison] + "\">", searchposition[0]);
				attempthistory[currentsplit][1][currentcomparison][0] = true;
				attempthistory[currentsplit][1][currentcomparison][2] = stringtoms(userinput.substring(userinput.indexOf("<RealTime>", searchposition[0]) + 10), userinput.indexOf("</RealTime>", searchposition[0]));
				lastsplit = currentsplit - 1;
				if (lastsplit >= 0) {
					while (!attempthistory[lastsplit][1][currentcomparison][0]) {
						lastsplit--;
						if (lastsplit == -1) {
							break;
						}
					}
				}
				if (lastsplit >= 0) {
					attempthistory[currentsplit][1][currentcomparison][1] = attempthistory[currentsplit][1][currentcomparison][2] - attempthistory[lastsplit][1][currentcomparison][2];
				} else {
					attempthistory[currentsplit][1][currentcomparison][1] = attempthistory[currentsplit][1][currentcomparison][2];
				}
				searchposition[0] = userinput.indexOf("</SplitTime>", searchposition[0]);
			} else {
				attempthistory[currentsplit][1][currentcomparison][0] = false;
			}
			currentcomparison++;
		}
		//Use attempthistory[currentsplit][2][0] for Best Segments to avoid holes in arrays
		attempthistory[currentsplit][2][0] = [];
		if (userinput.indexOf("<BestSegmentTime>", searchposition[0]) < userinput.indexOf("</Segment>", searchposition[0]) && userinput.indexOf("<BestSegmentTime>", searchposition[0]) != -1) {
			searchposition[0] = userinput.indexOf("<BestSegmentTime>", searchposition[0]);
			attempthistory[currentsplit][2][0][0] = true;
			searchposition[1] = userinput.indexOf("<RealTime>", searchposition[0]);
			attempthistory[currentsplit][2][0][1] = stringtoms(userinput.substring(userinput.indexOf("<RealTime>", searchposition[0]) + 10), userinput.indexOf("</RealTime>", searchposition[0]));
			lastsplit = currentsplit - 1;
			if (lastsplit >= 0) {
				while (!attempthistory[lastsplit][2][0][0]) {
					lastsplit--;
					if (lastsplit == -1) {
						break;
					}
				}
			}
			if (lastsplit >= 0) {
				attempthistory[currentsplit][2][0][2] = attempthistory[lastsplit][2][0][2] + attempthistory[currentsplit][2][0][1];
			} else {
				attempthistory[currentsplit][2][0][2] = attempthistory[currentsplit][2][0][1];
			}
			searchposition[0] = userinput.indexOf("</BestSegmentTime>", searchposition[0]);
		} else {
			attempthistory[currentsplit][2][0][0] = false;
		}
		while (currentattempt <= attemptcount) {
			attempthistory[currentsplit][2][currentattempt] = [];
			if (userinput.indexOf("<Time id=\"" + currentattempt + "\">", searchposition[0]) < userinput.indexOf("</Segment>", searchposition[0]) && userinput.indexOf("<Time id=\"" + currentattempt + "\">", searchposition[0]) != -1) {
				searchposition[0] = userinput.indexOf("<Time id=\"" + currentattempt + "\">", searchposition[0]);
				attempthistory[currentsplit][2][currentattempt][0] = true;
				attempthistory[currentsplit][2][currentattempt][1] = stringtoms(userinput.substring(userinput.indexOf("<RealTime>", searchposition[0]) + 10), userinput.indexOf("</RealTime>", searchposition[0]));
				lastsplit = currentsplit -1;
				if (lastsplit >= 0) {
					while (!attempthistory[lastsplit][2][currentattempt][0]) {
						lastsplit--;
						if (lastsplit == -1) {
							break;
						}
					}
				}
				if (lastsplit >= 0) {
					attempthistory[currentsplit][2][currentattempt][2] = attempthistory[lastsplit][2][currentattempt][2] + attempthistory[currentsplit][2][currentattempt][1];
				} else {
					attempthistory[currentsplit][2][currentattempt][2] = attempthistory[currentsplit][2][currentattempt][1];
				}
				searchposition[0] = userinput.indexOf("</Time>", searchposition[0]);
			} else {
				attempthistory[currentsplit][2][currentattempt][0] = false;
			}
			currentattempt++;
		}
		searchposition[0] = userinput.indexOf("</Segment>", searchposition[0]);
		currentsplit++;
	}
	//Import runs
	runhistory = [];
	searchposition = [0, 0];
	var currentrunend = 0;
	var currentpb = 0;
	currentattempt = 1;
	runhistory[0] = 0 //Finished run count as the first value of this array
	while (userinput.indexOf("<Attempt", searchposition[0]) != -1) {
		searchposition[0] = userinput.indexOf("<Attempt", searchposition[0]);
		if (userinput.indexOf("</Attempt>", searchposition[0]) < userinput.indexOf("/>", searchposition[0]) && userinput.indexOf("</Attempt>", searchposition[0]) != -1) {
			currentrunend = userinput.indexOf("</Attempt>", searchposition[0]);
		} else {
			currentrunend = userinput.indexOf("/>", searchposition[0]);
		}
		runhistory[currentattempt] = [];
		if (userinput.indexOf("<RealTime>", searchposition[0]) < currentrunend && userinput.indexOf("<RealTime>", searchposition[0]) != -1) {
			runhistory[currentattempt][1] = stringtoms(userinput.substring(userinput.indexOf("<RealTime>", searchposition[0]) + 10), userinput.indexOf("</RealTime>", searchposition[0]));
			searchposition[1] = userinput.indexOf("<RealTime>", searchposition[0]);
			if (runhistory[currentattempt][1] < currentpb || currentpb == 0) {
				runhistory[currentattempt][0] = 2;
				currentpb = runhistory[currentattempt][1];
			} else {
				runhistory[currentattempt][0] = 1;
			}
			runhistory[0]++;
		} else {
			runhistory[currentattempt][0] = 0;
		}
		runhistory[currentattempt][2] = parseInt(userinput.substring(userinput.indexOf("id=\"", searchposition[0]) + 4, userinput.indexOf("\" started=", searchposition[0])));
		runhistory[currentattempt][3] = userinput.substring(userinput.indexOf("started=\"", searchposition[0]) + 9, userinput.indexOf("\" isStartedSynced=", searchposition[0]));
		runhistory[currentattempt][4] = userinput.substring(userinput.indexOf("ended=\"", searchposition[0]) + 7, userinput.indexOf("\" isEndedSynced=", searchposition[0]));
		searchposition[0] = currentrunend;
		currentattempt++;
	}
	document.getElementById("splitmetadata").innerHTML = "<p><strong>Platform: </strong>" + userinput.substring(userinput.indexOf(">", userinput.indexOf("<Platform")) + 1, userinput.indexOf("</Platform")) + "<br><strong>Uses Emulator: </strong>" + userinput.substring(userinput.indexOf("usesEmulator=\"") + 14, userinput.indexOf("\">", userinput.indexOf("usesEmulator=\""))) + "<br><strong>Region: </strong>" + userinput.substring(userinput.indexOf("<Region>") + 8, userinput.indexOf("</Region>")) + "<br><strong>Finished Run Count: </strong>" + runhistory[0] + "<br><strong>Total Attempt Count: </strong>" + attemptcount;
	document.getElementById("splitsoverview").innerHTML = getoverview(1, 0);
}

function getoverview(x, y) {
	if (x == 1) {
		var returntext = "<h2>Overview: " + comparisons[y] + "</h2>"
	} else if (x == 2 && y == 0) {
		var returntext = "<h2>Overview: Sum of Best Segments</h2>";
	} else {
		var returntext = "<h2>Overview: Attempt " + y + "</h2>";
	}
	returntext = returntext + "<table><tr><td><strong>Segment Name</strong></td><td><strong>Segment Time</strong></td><td><strong>Split Time</strong></td></tr>";
	var currentsplit = 0;
	while (currentsplit < attempthistory.length) {
		returntext = returntext + "<tr><td>" + attempthistory[currentsplit][0] + "</td><td>" + goldengolds(currentsplit, x, y) + "</td><td>" + mstostring(attempthistory[currentsplit][x][y][2]) + "</td>";
		currentsplit++;
	}
	return returntext + "</table>";
}

var hwlist = [];

function confirmhomeworldsplits() {
	window.location.href = "#confirmhomeworlds";
	currentwindow = "confirmhomeworlds"
	document.getElementById("chwerror").innerHTML = "";
	hwlist = [];
	var currentsplit = 0;
	var hwnumber = 0;
	while (currentsplit < attempthistory.length) {
		if (attempthistory[currentsplit][0].toLowerCase().includes("artisans") || attempthistory[currentsplit][0].toLowerCase().includes("peace keepers") || attempthistory[currentsplit][0].toLowerCase().includes("magic crafters") || attempthistory[currentsplit][0].toLowerCase().includes("beast makers") || attempthistory[currentsplit][0].toLowerCase().includes("dream weavers")) {
			hwlist[hwnumber] = currentsplit;
			hwnumber++;
		} else if (currentsplit == attempthistory.length - 1) {
			hwlist[hwnumber] = currentsplit;
			hwnumber++;
		}
		currentsplit++;
	}
	if (hwlist.length > 1) {
		document.getElementById("chwinfotext").innerHTML = "Homeworld Segments were found in your splits file. Please confirm if these are correct:"
	} else {
		document.getElementById("chwinfotext").innerHTML = "Unable to find Homeworld Segments in your splits file. Please add your Homeworld Segments manually:"
	}
	createdropdowns();
}

function createdropdowns() {
	var dropdowns = "";
	var currenthw = 0;
	var currentsplit = 0;
	while (currenthw < hwlist.length) {
		dropdowns = dropdowns + "<p><div class=\"field\"><label for=\"chwlistdd" + currenthw + "\">Homeworld " + (currenthw + 1) +":</label><select name=\"chwlistdd" + currenthw + "\" id=\"chwlistdd" + currenthw + "\">";
		currentsplit = 0;
		while (currentsplit < attempthistory.length) {
			dropdowns = dropdowns + "<option value=\"" + currentsplit + "\">" + attempthistory[currentsplit][0] + "</option>";
			currentsplit++;
		}
		dropdowns = dropdowns + "</select></div><br><ul class=\"actions\">";
		if (currenthw != 0) {
			dropdowns = dropdowns + "<li><a class=\"button\" onClick=\"dropdownaction(" + currenthw + ", 0)\">Move Up</a></li>";
		}
		if (currenthw != hwlist.length - 1) {
			dropdowns = dropdowns + "<li><a class=\"button\" onClick=\"dropdownaction(" + currenthw + ", 1)\">Move Down</a></li>";
		}
		dropdowns = dropdowns + "<li><a class=\"button\" onClick=\"dropdownaction(" + currenthw + ", 2)\">Remove</a></li></ul></p>";
		currenthw++;
	}
	document.getElementById("chwlist").innerHTML = dropdowns + "<p><ul class=\"actions\"><li><a class=\"button\" onClick=\"dropdownadd()\">Add Homeworld Split</a></li></ul></p>";
	currenthw = 0;
	while (currenthw < hwlist.length) {
		document.getElementById("chwlistdd" + currenthw).value = hwlist[currenthw];
		currenthw++;
	}
}

function dropdownaction(hw, buttontype) {
	fetchdropdowns();
	var currenthw = 0;
	if (buttontype == 0) {
		hwlist.splice(hw - 1, 0, hwlist[hw]);
		hwlist.splice(hw + 1, 1);
	} else if (buttontype == 1) {
		hwlist.splice(hw + 2, 0, hwlist[hw]);
		hwlist.splice(hw, 1);
	} else if (buttontype == 2) {
		hwlist.splice(hw, 1);
	}
	createdropdowns();
}

function dropdownadd() {
	fetchdropdowns();
	hwlist.push(0);
	createdropdowns();
}

function confirmhw() {
	fetchdropdowns();
	var currenthw = 1;
	document.getElementById("chwerror").innerHTML = "";
	while (currenthw < hwlist.length) {
		if (hwlist[currenthw] < hwlist[currenthw - 1]) {
			document.getElementById("chwerror").innerHTML = "Homeworlds segments must be in order. <strong>" + attempthistory[hwlist[currenthw]][0] + "</strong> seems to be coming before <strong>" + attempthistory[hwlist[currenthw - 1]][0] + "</strong> in your splits.";
			break;
		}
		currenthw++;
	}
	if (hwlist[hwlist.length - 1] != attempthistory.length - 1) {
		document.getElementById("chwerror").innerHTML = "Last segment must be last homeworld. <strong>" + attempthistory[hwlist[hwlist.length - 1]][0] + "</strong> seems to not be the last segment in your splits.";
	}
	if (document.getElementById("chwerror").innerHTML == "") {
		loadiw();
	}
}

function fetchdropdowns() {
	var currenthw = 0;
	while(currenthw < hwlist.length) {
		hwlist[currenthw] = parseInt(document.getElementById("chwlistdd" + currenthw).value);
		currenthw++;
	}
}

var homeworldbestattempts = [];
var besthwtimes = [];

function loadiw() {
	window.location.href = "#individualhomeworldbesttimes";
	currentwindow = "individualhomeworldbesttimes";
	var iwcompselectoutput = "";
	var ciwcompselectoutput = "";
	var currentcomparison = 0;
	while (currentcomparison < comparisons.length) {
		iwcompselectoutput = iwcompselectoutput + "<option value=\"1" + currentcomparison +"\" id=\"iwselectoption1" + currentcomparison + "\">" + comparisons[currentcomparison] + "</option>";
		ciwcompselectoutput = ciwcompselectoutput + "<option value=\"1" + currentcomparison +"\" id=\"ciwselectoption1" + currentcomparison + "\">" + comparisons[currentcomparison] + "</option>";
		currentcomparison++;
	}
	iwcompselectoutput = iwcompselectoutput + "<option value=\"20\" id=\"iwselectoption20\">Sum of Best Segments</option>";
	ciwcompselectoutput = ciwcompselectoutput + "<option value=\"20\" id=\"ciwselectoption20\">Sum of Best Segments</option>";
	currentcomparison = 1;
	while (currentcomparison < runhistory.length) {
		iwcompselectoutput = iwcompselectoutput + "<option value=\"2" + currentcomparison +"\" id=\"iwselectoption2" + currentcomparison + "\">Attempt " + currentcomparison;
		ciwcompselectoutput = ciwcompselectoutput + "<option value=\"2" + currentcomparison +"\" id=\"ciwselectoption2" + currentcomparison + "\">Attempt " + currentcomparison;
		if (runhistory[currentcomparison][0] == 0) {
			iwcompselectoutput = iwcompselectoutput + " - Reset</option>";
			ciwcompselectoutput = ciwcompselectoutput + " - Reset</option>";
		} else if (runhistory[currentcomparison][0] == 1) {
			iwcompselectoutput = iwcompselectoutput + " - " + mstostring(runhistory[currentcomparison][1]) + "</option>";
			ciwcompselectoutput = ciwcompselectoutput + " - " + mstostring(runhistory[currentcomparison][1]) + "</option>";
		} else if (runhistory[currentcomparison][0] == 2) {
			if (runhistory[currentcomparison][1] == attempthistory[attempthistory.length - 1][1][0][2]) {
				iwcompselectoutput = iwcompselectoutput + " - " + mstostring(runhistory[currentcomparison][1]) + " (Current Personal Best)</option>";
				ciwcompselectoutput = ciwcompselectoutput + " - " + mstostring(runhistory[currentcomparison][1]) + " (Current Personal Best)</option>";
			} else {
				iwcompselectoutput = iwcompselectoutput + " - " + mstostring(runhistory[currentcomparison][1]) + " (Former Personal Best)</option>";
				ciwcompselectoutput = ciwcompselectoutput + " - " + mstostring(runhistory[currentcomparison][1]) + " (Former Personal Best)</option>";
			}
		}
		currentcomparison++;
	}
	document.getElementById("iwcompselect").innerHTML = iwcompselectoutput;
	document.getElementById("ciwcompselect").innerHTML = ciwcompselectoutput;
	document.getElementById("iwcompmethod").value = 1;
	document.getElementById("ciwcompmethod").value = 2;
	clearexcludedhwtimes(); //This function will also load the tables
}

var excludedhwtimes = [];
var iwtotalsplittimes = [];

function loadiwtables() {
	var currenthw = 0;
	var currentattempt = 1;
	var currentlevel = 0;
	var currentcalc = 0;
	var currentbest = 0;
	homeworldbestattempts = [];
	iwtotalsplittimes = [];
	var outputtext = "";
	var coutputtext = "<table id=\"chwtable\"><tr><td><strong>Segment Name</strong></td><td><strong>Segment Time</strong></td><td><strong>Homeworld Split Time</strong></td><td id=\"chwcomphw\"></td></tr>";
	var hwsplittime = 0;
	var lastsplit = 0;
	while (currenthw < hwlist.length) {
		currentattempt = 1;
		while (currentattempt <= attemptcount) {
			if (attempthistory[hwlist[currenthw]][2][currentattempt][0] && (currenthw == 0 || attempthistory[hwlist[currenthw - 1]][2][currentattempt][0])) {
				if (currenthw == 0) {
					currentlevel = 0;
				} else {
					currentlevel = hwlist[currenthw - 1] + 1;
				}
				while (currentlevel <= hwlist[currenthw]) {
					if (attempthistory[currentlevel][2][currentattempt][0]) {
						currentcalc = currentcalc + attempthistory[currentlevel][2][currentattempt][1];
					}
					currentlevel++;
				}
				if ((currentcalc < currentbest || currentbest == 0) && !excludedhwtimes[currenthw].includes(currentattempt)) {
					currentbest = currentcalc;
					homeworldbestattempts[currenthw] = currentattempt;
				}
				currentcalc = 0;
			}
			currentattempt++
		}
		outputtext = outputtext + "<h2>" + attempthistory[hwlist[currenthw]][0] + " - " + mstostring(currentbest) + "</h2><p>From: <strong>Attempt " + homeworldbestattempts[currenthw] + "</strong><br>Finished Time: ";
		if (runhistory[homeworldbestattempts[currenthw]][0] == 0) {
			outputtext = outputtext + "<strong>Reset</strong><br>";
		} else if (runhistory[homeworldbestattempts[currenthw]][0] == 1) {
			outputtext = outputtext + "<strong>" + mstostring(runhistory[homeworldbestattempts[currenthw]][1]) + "</strong><br>";
		} else if (runhistory[homeworldbestattempts[currenthw]][0] == 2) {
			if (runhistory[homeworldbestattempts[currenthw]][1] == attempthistory[attempthistory.length - 1][1][0][2]) {
				outputtext = outputtext + "<strong>" + mstostring(runhistory[homeworldbestattempts[currenthw]][1]) + " (Current Personal Best)</strong><br>";
			} else {
				outputtext = outputtext + "<strong>" + mstostring(runhistory[homeworldbestattempts[currenthw]][1]) + " (Former Personal Best)</strong><br>";
			}
		}
		outputtext = outputtext + "Date and Time: <strong>" + runhistory[homeworldbestattempts[currenthw]][4] + "</strong></p><table id=\"hwtable" + currenthw + "\"><tr><td><strong>Segment Name</strong></td><td><strong>Segment Time</strong></td><td><strong>Homeworld Split Time</strong></td><td id=\"hwcomphw" + currenthw + "\"></td></tr>";
		if (currenthw == 0) {
			currentlevel = 0;
		} else {
			currentlevel = hwlist[currenthw - 1] + 1;
		}
		while (currentlevel <= hwlist[currenthw]) {
			if (attempthistory[currentlevel][2][homeworldbestattempts[currenthw]][0]) {
				hwsplittime = hwsplittime + attempthistory[currentlevel][2][homeworldbestattempts[currenthw]][1];
			}
			lastsplit = currentlevel -1;
			if (lastsplit >= 0) {
				while (!attempthistory[lastsplit][2][homeworldbestattempts[currenthw]][0]) {
					lastsplit--;
					if (lastsplit == -1 || lastsplit == hwlist[currenthw - 1]) {
						break;
					}
				}
			}
			if (lastsplit >= 0) {
				iwtotalsplittimes[currentlevel] = iwtotalsplittimes[lastsplit] + attempthistory[currentlevel][2][homeworldbestattempts[currenthw]][1];
			} else {
				iwtotalsplittimes[currentlevel] = attempthistory[currentlevel][2][homeworldbestattempts[currenthw]][1];
			}
			outputtext = outputtext + "<tr><td>" + attempthistory[currentlevel][0] + "</td><td>" + goldengolds(currentlevel, 2, homeworldbestattempts[currenthw]) + "</td><td>" + mstostring(hwsplittime) + "</td><td id=\"hwcomp" + currentlevel + "\"</td></tr>";
			coutputtext = coutputtext + "<tr><td>" + attempthistory[currentlevel][0] + "</td><td>" + goldengolds(currentlevel, 2, homeworldbestattempts[currenthw]) + "</td><td>" + mstostring(iwtotalsplittimes[currentlevel]) + "</td><td id=\"chwcomp" + currentlevel + "\"</td></tr>";
			besthwtimes[currentlevel] = hwsplittime;
			currentlevel++;
		}
		outputtext = outputtext + "</table><p><ul class=\"actions\"><li><a class=\"button\" onClick=\"replaceiwsplits(" + currenthw + ", " + homeworldbestattempts[currenthw] + ");\">Inaccurate? Use slower Splits</a></li><li><a class=\"button icon fa-clipboard\" onClick=\"copyhwsplits(" + currenthw + ");\">Copy Split Times to Clipboard</a></li></ul></p>";
		currenthw++;
		currentbest = 0;
		hwsplittime = 0;
	}
	document.getElementById("iwbt").innerHTML = outputtext;
	document.getElementById("ciwbt").innerHTML = coutputtext + "</table>";
	iwhwcomp("", document.getElementById('iwcompselect').value, document.getElementById('iwcompmethod').value);
	iwhwcomp("c", document.getElementById('ciwcompselect').value, document.getElementById('ciwcompmethod').value);
}

function copyhwsplits(x) {
	var rowposition = 1;
	var texttocopy = "";
	var tablerows = document.getElementById("hwtable" + x).rows;
	while (rowposition < tablerows.length) {
		texttocopy = texttocopy + tablerows[rowposition].cells[2].innerHTML + "\n";
		rowposition++;
	}
	navigator.clipboard.writeText(texttocopy);
}

function copyallhwsplits() {
	var currentlevel = 0;
	var texttocopy = "";
	while (currentlevel < iwtotalsplittimes.length) {
		texttocopy = texttocopy + mstostring(iwtotalsplittimes[currentlevel]) + "\n";
		currentlevel++;
	}
	navigator.clipboard.writeText(texttocopy);
}

function replaceiwsplits(x, y) {
	excludedhwtimes[x].push(y);
	loadiwtables();
}

function clearexcludedhwtimes() {
	var currenthw = 0;
	excludedhwtimes = [];
	while (currenthw < hwlist.length) {
		excludedhwtimes.push([]);
		currenthw++;
	}
	loadiwtables();
}

function iwhwcomp(consecutive, iwselect, iwmethod) {
	var iwcomp = [
		parseInt(iwselect[0]),
		parseInt(iwselect.substring(1, iwselect.length))
	];
	var currenthw = 0;
	while (currenthw < hwlist.length) {
		document.getElementById("hwcomphw" + currenthw).innerHTML = "<strong>vs. " + document.getElementById("iwselectoption" + iwselect).innerHTML + "</strong>";
		currenthw++;
	}
	document.getElementById("chwcomphw").innerHTML = "<strong>vs. " + document.getElementById("ciwselectoption" + iwselect).innerHTML + "</strong>";
	var comptimes = [];
	var currentlevel = 0;
	var currenthw = 0;
	var currenthwcalc = 0;
	while (currentlevel < attempthistory.length) {
		if (attempthistory[currentlevel][iwcomp[0]][iwcomp[1]][0]) {
			if (hwlist[currenthw] < currentlevel || currentlevel == 0) {
				currenthwcalc = 0;
			}
			if (hwlist[currenthw] < currentlevel) {
				currenthw++;
			}
			if (iwmethod == 0 || iwmethod == 3) {
				comptimes[currentlevel] = attempthistory[currentlevel][iwcomp[0]][iwcomp[1]][1];
			} else if (iwmethod == 1 || iwmethod == 4) {
				currenthwcalc = currenthwcalc + attempthistory[currentlevel][iwcomp[0]][iwcomp[1]][1];
				comptimes[currentlevel] = currenthwcalc;
			} else if (iwmethod == 2 || iwmethod == 5) {
				comptimes[currentlevel] = attempthistory[currentlevel][iwcomp[0]][iwcomp[1]][2];
			}
		} else {
			comptimes[currentlevel] = 0;
		}
		if (iwmethod == 3 || iwmethod == 4 || iwmethod == 5) {
			document.getElementById(consecutive + "hwcomp" + currentlevel).innerHTML = mstostring(comptimes[currentlevel]);
		} else if (iwmethod == 0) {
			document.getElementById(consecutive + "hwcomp" + currentlevel).innerHTML = delta(attempthistory[currentlevel][2][homeworldbestattempts[currenthw]][1], comptimes[currentlevel]);
		} else if (iwmethod == 1) {
			document.getElementById(consecutive + "hwcomp" + currentlevel).innerHTML = delta(besthwtimes[currentlevel], comptimes[currentlevel]);
		} else if (iwmethod == 2) {
			document.getElementById(consecutive + "hwcomp" + currentlevel).innerHTML = delta(iwtotalsplittimes[currentlevel], comptimes[currentlevel]);
		}
		currentlevel++;
	}
}

function iwconsecutive() {
	window.location.href = "#consecutiveindividualhomeworldbesttimes";
	currentwindow = "consecutiveindividualhomeworldbesttimes";
}

function iwindividual() {
	window.location.href = "#individualhomeworldbesttimes";
	currentwindow = "individualhomeworldbesttimes";
}

function delta(x, y) {
	if (isNaN(x) || isNaN(y) || x == 0 || y == 0) {
		return "-";
	}
	if (x - y > 0) {
		return "<strong><span style='color: #CC1200;'>+" + mstostring(x - y) + "</span></strong>";
	} else if (x - y < 0) {
		return "<strong><span style='color: #00CC36;'>-" + mstostring(y - x) + "</span></strong>";
	} else if (x - y == 0) {
		return "<strong><span style='color: #00CC36;'>±0</span></strong>";
	}
}

function goldengolds(currentsplit, x, y) {
	if (attempthistory[currentsplit][x][y][1] == attempthistory[currentsplit][2][0][1]) {
		return "<strong><span style='color: #D8AF1F;'>" + mstostring(attempthistory[currentsplit][x][y][1]) + "</span></strong>";
	} else {
		return mstostring(attempthistory[currentsplit][x][y][1]);
	}
}

function mstostring(a) {
	var b = "";
	if (isNaN(a) || a == 0) {
		return "-";
	}
	if (parseInt(a / 3600000) > 0) {
		b = parseInt(a / 3600000) + ":";
	}
	if (parseInt((a % 3600000) / 60000) >= 10 || b == "") {
		b = b + parseInt((a % 3600000) / 60000) +":";
	} else {
		b = b + "0" + parseInt((a % 3600000) / 60000) + ":";
	}
	if (parseInt(((a % 3600000) % 60000) / 1000) >= 10 || b == "") {
		b = b + parseInt(((a % 3600000) % 60000) / 1000);
	} else {
		b = b + "0" + parseInt(((a % 3600000) % 60000) / 1000);
	}
	if (((a % 3600000) % 60000) % 1000 >= 100) {
		b = b + "." + ((a % 3600000) % 60000) % 1000;
	} else if (((a % 3600000) % 60000) % 1000 >= 10) {
		b = b + ".0" + ((a % 3600000) % 60000) % 1000;
	} else if (((a % 3600000) % 60000) % 1000 > 0) {
		b = b + ".00" + ((a % 3600000) % 60000) % 1000;
	}
	return b;
}

function stringtoms(a) {
	return ((parseInt(a.substring(0, a.indexOf(":"))) || 0) * 3600000) + ((parseInt(a.substring(a.indexOf(":") + 1, a.indexOf(":") + 3)) || 0) * 60000) + ((parseInt(a.substring(a.indexOf(":") + 4, a.indexOf(":") + 6)) || 0) * 1000) + (parseInt(a.substring(a.indexOf(":") + 7, a.indexOf(":") + 10)) || 0);
}

function wip() {
	window.location.href = "#wip";
	currentwindow = "wip";
}

function backtooverview() {
	window.location.href = "#overview";
	currentwindow = "overview";
}
