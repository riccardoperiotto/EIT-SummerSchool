var SignalEnum =
{
	EMPTY: "EMPTY",
	ENUM_PARSESIGNAL : "ENUM_PARSESIGNAL"
};

var EventEnum =
{
	COMPLETION: "COMPLETION",
	ENUM_PARSE : "ENUM_PARSE",
	ENUM_NEW : "ENUM_NEW"	
};

function ParseSignal(lstArguments)
{
	this.signalEnum = SignalEnum.ENUM_PARSESIGNAL;
	this.parameters = ['typeCode'];
	//signal attribute assignment
	var nIndex = 0;
	this.typeCode = lstArguments[nIndex++];
};

function getSignalInstance(signalStr, arguments) {
	var signal = null;
	while(true)
	{
		if(signalStr === "ParseSignal")
		{
			signal = new ParseSignal(arguments);
			break;
		}	
		break;
	}
	return signal;
};

function initializeEventStrings()
{
    stringTable.eventList = 
		[
			new EventDictionaryNode(EventEnum.ENUM_PARSE, "Parse", "{153F492B-79D0-4289-BC29-6523FED2D1BC}"),
			new EventDictionaryNode(EventEnum.ENUM_NEW, "New", "{B1F3AE6F-A2A5-44b0-AE1A-63047A56EA37}")	
		];
		
	stringTable.signalMap = {};
	stringTable.signalMap[SignalEnum.ENUM_PARSESIGNAL] = "ParseSignal";	
};		