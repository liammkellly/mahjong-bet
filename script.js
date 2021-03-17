
function toggleMenu() {
	var divMenu = document.getElementById("SubMenu");
	if(divMenu.style.display == "block") {
		divMenu.style.display = "none";
	} else {
		divMenu.style.display = "block";
	}
}

var WallOfTiles = [];
var TilesInHand = [];
var TilesInRiver = [];
var RemainingDraws = 19;
var FlagTenpai = false;
var LowDrawBet;
var HighDrawBet;
var CurrentBet;
var Score = 1000;

function initDeal() {
	WallOfTiles = [];
	TilesInHand = [];
	TilesInRiver = [];
	RemainingDraws = 19;
	FlagTenpai = false;
	
	if ( Score < 100 ) {
		EndScreen();
		return 0;
	}

	for (var i = 0; i < 136 ; i++) {
		WallOfTiles.push(Math.floor(i/4));
	}
	
	for (var i = 0; i < 13 ; i++) {
		var drawnTile = Math.floor(Math.random() * WallOfTiles.length);
		TilesInHand.push(WallOfTiles[drawnTile]);
		WallOfTiles.splice(drawnTile,1);
	}
	DrawTile();
	var OptionsList = "";
	for (i=1; i<20; i++) {
		OptionsList += "<option value=\"" + i + "\">" + i + "</option>";
	}
	document.getElementById("DisplayBoard").innerHTML = "How fast do you think you can get this hand to tenpai?<br /><br />Between the <select id=\"LowDraw\" onchange=\"UpdateBetDraw(0)\">" + OptionsList + "</select>th and the <select id=\"HighDraw\" onchange=\"UpdateBetDraw(1)\">" + OptionsList + "</select>th draw <br /><br />I bet <input type=\"text\" id=\"ProposedBet\"><br /><br /><button onclick=\"EvalBet()\">Play</button>";
	document.getElementById("Display").style.display = "block";
	UpdateScore();
}

function EvalBet() {
	var ProposedBet = document.getElementById("ProposedBet").value;
	if ( ProposedBet < 100) {
		alert("Minimum bet is 100 points!");
	} else if ( ProposedBet > Score) {
		alert("You don't have enough points!");
	
	 } else {
		HighDrawBet = document.getElementById("HighDraw").value;
		LowDrawBet = document.getElementById("LowDraw").value;
		CurrentBet = ProposedBet;
		document.getElementById("Display").style.display = "none";
		Score -= CurrentBet;
		UpdateScore();
	}
}

function UpdateScore() {
	document.getElementById("Score").innerHTML = "Score: " + Score;
}

function UpdateBetDraw(Bet) {
	if ( parseInt(document.getElementById("HighDraw").value) < parseInt(document.getElementById("LowDraw").value) ) {
		if ( Bet == 0 ) {
			document.getElementById("HighDraw").value = document.getElementById("LowDraw").value;
		} else {
			document.getElementById("LowDraw").value = document.getElementById("HighDraw").value;
		}
	}
}

function TenpaiReached() {
	var CoveredInterval = Math.floor(( HighDrawBet - LowDrawBet + 1 ) / 0.19);
	if ( (( 19 -  RemainingDraws )) <= HighDrawBet && (( 19 -  RemainingDraws )) >= LowDrawBet ) {
		var CurrentRate = (19 -( HighDrawBet - LowDrawBet + 1 ))/2;
		var EarnedPoints = CurrentBet * CurrentRate;
		var SuccessSentence = "You won your bet and earned " + CurrentRate + " times your bet, equalling " + EarnedPoints +" points!";
	} else {
		var EarnedPoints = 0;
		var SuccessSentence = "You lost your bet, you didn't earn any points.";
	}
	document.getElementById("DisplayBoard").innerHTML = "You reached tenpai in at the " + (( 19 -  RemainingDraws )) + "th draw, your target was between the " + LowDrawBet + "th and the " + HighDrawBet + "th draw, which covered " + CoveredInterval + " % of available draws. <br /><br />" + SuccessSentence + "<br /><br /><button onclick=\"initDeal()\">Play again</button>";
	document.getElementById("Display").style.display = "block";
	Score += EarnedPoints;
	UpdateScore();
}

function WallIsEmpty() {
	var EarnedPoints = CurrentBet * -5;	
	document.getElementById("DisplayBoard").innerHTML = "You didn't reach tenpai, your target was between the " + LowDrawBet + "th and the " + HighDrawBet + "th draw. <br /><br />You get a penalty of 5 times your bet: " + EarnedPoints + "<br /><br /><button onclick=\"initDeal()\">Play again</button>";
	document.getElementById("Display").style.display = "block";
	Score += EarnedPoints;
	UpdateScore();
}

function StartScreen() {
	document.getElementById("DisplayBoard").innerHTML = "<h2><b>Mahjong Bet!</b></h2><p style=\"text-align:left\">You start with 1000 points.<br />Each deal, bet from 100 points on the interval of draws in which you hope to reach tenpai.<br />If you reach tenpai, you get earn from 0 to 9 times your bet (the more restrictive the interval, the higher the payout).<br />If you don't reach tenpai, you pay 5 times your bet as a penalty.</p><button onclick=\"Score=1000;initDeal()\">Start playing!</button>";
	document.getElementById("Display").style.display = "block";
}

function EndScreen() {
	document.getElementById("DisplayBoard").innerHTML = "You don't have enough points to keep playing :(<br /><br /><button onclick=\"StartScreen()\">Start screen</button><br /><br /><br /><br />If you have any comment, like ideas to make the points system better, or found a bug, etc. send me a message to liammkellly@gmail.com :)";
	document.getElementById("Display").style.display = "block";
}

function DrawTile() {
	UpdateHand();
	UpdateRiver();
	var drawnTile = Math.floor(Math.random() * WallOfTiles.length);
	console.log("Drew tile number #" + drawnTile + "in the wall");
	drawnTileValue = WallOfTiles[drawnTile];
	console.log("Drew tile number with value " + drawnTileValue);
	TilesInHand.push(drawnTileValue);
	WallOfTiles.splice(drawnTile,1);
	console.log("New state of the wall:")
	console.log(WallOfTiles);
	var newTile = document.createElement('img');
	newTile.id = drawnTileValue;
	newTile.src = "SVG/" + drawnTileValue + ".svg";
	newTile.className = "DrawnTile";
	document.getElementById("Hand").appendChild(newTile);
	newTile.onclick = DiscardTile;
	RemainingDraws--;
	document.getElementById("Counter").innerHTML = "Remaining tiles: " + WallOfTiles.length + " / Current draw: " + (( 19 -  RemainingDraws )) + " Remaining draws: " + RemainingDraws;
}

function DiscardTile(clickedTile) {
	if (RemainingDraws >= 0 && FlagTenpai == false) {
		var discardedTile = clickedTile.target.id;
		TilesInHand.splice(TilesInHand.indexOf(parseInt(discardedTile)), 1);
		TilesInRiver.push(discardedTile);
		UpdateRiver();
		UpdateHand();
		if (checkTenpai(TilesInHand)) {
			TenpaiReached();
			FlagTenpai = true;
		} else {
			if ( RemainingDraws == 0 ) {
				WallIsEmpty();
			}
		}
		if (RemainingDraws > 0 && FlagTenpai == false) {
			DrawTile();
		}
	}
}

function UpdateHand() {
	const myNode = document.getElementById("Hand");
	while (myNode.firstChild) {
 		myNode.removeChild(myNode.lastChild);
 	}
	TilesInHand.sort(function(a, b) {
		return a-b;
	});
	TilesInHand.forEach(function (item,index) {
		var newTile = document.createElement('img');
		newTile.id = item;
		newTile.src = "SVG/" + item + ".svg";
		document.getElementById("Hand").appendChild(newTile);
		newTile.onclick = DiscardTile;
	});
}

function UpdateRiver() {
	const myNode = document.getElementById("River");
	while (myNode.firstChild) {
 		myNode.removeChild(myNode.lastChild);
 	}
	TilesInRiver.forEach(function (item,index) {
		var newTile = document.createElement('img');
		newTile.id = item;
		newTile.src = "SVG/" + item + ".svg";
		document.getElementById("River").appendChild(newTile);
	});
}


//START CODE TO CHECK TENPAI


function checkTenpai(TilesToCheck){
	TilesToCheck.sort(function(a, b) {
		return a-b;
	});
	
	var Pairs = [];
		
	for (var i = 0; i < TilesToCheck.length; i++) {
		if ( TilesToCheck[i] == TilesToCheck[i+1] ) {
			Pairs.push(TilesToCheck[i]);
		}
	}
		
	let UniquePairs = [...new Set(Pairs)];
	
	// Test Chiitoi
	if ( UniquePairs.length > 5 ) {
		return "chiitoi";
	}
	

	
	var Kanchan = [];
	
	for (var i = 0; i < TilesToCheck.length; i++) {
		if ( TilesToCheck.indexOf(parseInt(TilesToCheck[i]+2)) != -1 && TilesToCheck[i] < 27 &&  TilesToCheck[i]%9 < 7 ) {
			Kanchan.push(TilesToCheck[i]);
		}
	}
	
	var Penryan = [];
	
	for (var i = 0; i < TilesToCheck.length; i++) {
		if ( TilesToCheck.indexOf(parseInt(TilesToCheck[i]+1)) != -1 && TilesToCheck[i] < 27 &&  TilesToCheck[i]%9 < 8 ) {
			Penryan.push(TilesToCheck[i]);
		}
	}
	
	
	
	// Test hand with pair
	for (var i = 0; i < UniquePairs.length; i++) {
		var TentativePoolBase = [].concat(TilesToCheck);
		var TentativeHandBase = [UniquePairs[i],UniquePairs[i]];
		TentativePoolBase.splice(TentativePoolBase.indexOf(parseInt(UniquePairs[i])), 2);
		for(var k = 0; k < UniquePairs.length; k++) {
			if( i != k) {
		
				var TentativeHand = TentativeHandBase.concat([UniquePairs[k],UniquePairs[k]]);
				var TentativePool = [].concat(TentativePoolBase);
				TentativePool.splice(TentativePool.indexOf(parseInt(UniquePairs[k])), 2);
				
				if( CheckGroups(TentativePool, 0) != -1) {
					return true;
				}
		
			}
		
		}
		
		for(var k = 0; k < Kanchan.length; k++) {
		
				var TentativeHand = TentativeHandBase.concat([Kanchan[k],parseInt(Kanchan[k]+2)]);
				var TentativePool = [].concat(TentativePoolBase);
				TentativePool.splice(TentativePool.indexOf(parseInt(Kanchan[k])), 1);
				TentativePool.splice(TentativePool.indexOf(parseInt(Kanchan[k]+2)), 1);

				if( CheckGroups(TentativePool, 0) != -1) {
					return true;
				}
		
		}
		
		for(var k = 0; k < Penryan.length; k++) {
		
				var TentativeHand = TentativeHandBase.concat([Penryan[k],parseInt(Penryan[k]+1)]);
				var TentativePool = [].concat(TentativePoolBase);
				TentativePool.splice(TentativePool.indexOf(parseInt(Penryan[k])), 1);
				TentativePool.splice(TentativePool.indexOf(parseInt(Penryan[k]+1)), 1);
				if( CheckGroups(TentativePool, 0) != -1 ) {
					return true;
				}
		
		}
	}
	
	// Test hand without pair
	
	var TentativePoolBase = [].concat(TilesToCheck);
	
	var CheckedGroups = CheckGroups(TentativePoolBase,1);
	if (CheckedGroups != -1 ) {
		var count=0;
		for (var i = 0; i < TilesToCheck.length; i++) {
						if ( CheckedGroups == TilesToCheck[i] ) {
							count++;
						}

		}
		
		if (count < 4) {
			return true;
		}
	}

	return false
}

function CheckGroups(TentativePoolToTest,Target) {
		
	var Triplets = [];
		
	for (var i = 0; i < TentativePoolToTest.length; i++) {
		if ( TentativePoolToTest[i] == TentativePoolToTest[i+2] ) {
			Triplets.push(TentativePoolToTest[i]);
		}
	}
	
	let UniqueTriplets = [...new Set(Triplets)];
	
	var Sequences = [];
	
	for (var i = 0; i < TentativePoolToTest.length; i++) {
		if ( TentativePoolToTest.indexOf(parseInt(TentativePoolToTest[i]+1)) != -1 && TentativePoolToTest.indexOf(parseInt(TentativePoolToTest[i]+2)) != -1 && TentativePoolToTest[i] < 27 &&  TentativePoolToTest[i]%9 < 7 ) {
			Sequences.push(TentativePoolToTest[i]);
		}
	}
	var AvailableElements = UniqueTriplets.concat(Sequences);
	
	
	for (var i = 0; i < AvailableElements.length; i++) {
		
		
		if( i < UniqueTriplets.length ) {
		
			if ( TentativePoolToTest.indexOf(parseInt(AvailableElements[i])) != -1 && TentativePoolToTest[TentativePoolToTest.indexOf(parseInt(AvailableElements[i]))+2] == AvailableElements[i] ) {
				TentativePoolToTest.splice(TentativePoolToTest.indexOf(parseInt(AvailableElements[i])),3);
				
			}
		
		} else {			
			if ( TentativePoolToTest.indexOf(parseInt(AvailableElements[i])) != -1 &&  TentativePoolToTest.indexOf(parseInt(AvailableElements[i])+1) != -1 &&  TentativePoolToTest.indexOf(parseInt(AvailableElements[i])+2) != -1 ) {
				TentativePoolToTest.splice(TentativePoolToTest.indexOf(parseInt(AvailableElements[i])),1);
				TentativePoolToTest.splice(TentativePoolToTest.indexOf(parseInt(AvailableElements[i])+1),1);
				TentativePoolToTest.splice(TentativePoolToTest.indexOf(parseInt(AvailableElements[i])+2),1);
				}
		
		}
		if ( TentativePoolToTest.length == 0 || TentativePoolToTest.length == 1 ) {
			return TentativePoolToTest;
		}
		
	}
	
	return -1;

}