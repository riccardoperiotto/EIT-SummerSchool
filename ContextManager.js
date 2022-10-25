var traceCount=0;
var StateBehaviorEnum = 
{
	ENTRY: "ENTRY",
    DO: "DO",
    EXIT: "EXIT"
};

var EntryTypeEnum = 
{
	DefaultEntry: "DefaultEntry",
	ExplicitEntry: "ExplicitEntry",
	HistoryEntry: "HistoryEntry",
	EntryPointEntry: "EntryPointEntry",
};

var StateMachineEnum =
{
	NOSTATEMACHINE: "NOSTATEMACHINE",
	//contexts will append more entries when initializing
} ;

var StateEnum =
{
	NOSTATE: "NOSTATE",
	//contexts will append more entries when initializing
} ;

var TransitionEnum =  
{
	NOTRANSITION: "NOTRANSITION",
	//contexts will append more entries when initializing
};

var EntryEnum = 
{
	NOENTRY: "NOENTRY",
	//contexts will append more entries when initializing
};

function Event(eventEnum, signal) {
	this.eventEnum = eventEnum;
	this.signal = signal;
};

//String Table START
function EventDictionaryNode(event, name, guid)
{
	this.eventEnum = event;
	this.name = name;
	this.guid = guid;
};

	
function StateMachineDictionaryNode(statemachine, name, guid)
{
	this.statemachineEnum = statemachine;
	this.name = name;
	this.guid = guid;
};

	
function StateDictionaryNode(state, name, guid)
{
	this.stateEnum = state;
	this.name = name;
	this.guid = guid;
};

	
function TransitionDictionaryNode(transition, name, guid)
{
	this.transitionEnum = transition;
	this.name = name;
	this.guid = guid;
};

function StringTable()
{
	this.statemachineList = [new StateMachineDictionaryNode(StateMachineEnum.NOSTATEMACHINE, "NOSTATEMACHINE", "")];
	this.stateList = [new StateDictionaryNode(StateEnum.NOSTATE, "NOSTATE", "")];
	this.transitionList = [new TransitionDictionaryNode(TransitionEnum.NOTRANSITION, "NOTRANSITION", "")];
};

var stringTable = new StringTable();

	
function getEventEnum(eventString)
{
	for (var i = 0; i < stringTable.eventList.length; i++) {
		if(stringTable.eventList[i].name === eventString) {
			return stringTable.eventList[i].eventEnum;
		}
	}
	return EventEnum.COMPLETION;
}

function getStateMachineEnum(stateMachineString)
{
	for (var i = 0; i < stringTable.statemachineList.length; i++) {
		if(stringTable.statemachineList[i].name === stateMachineString) {
			return stringTable.statemachineList[i].statemachineEnum;
		}
	}
	return StateMachineEnum.NOSTATEMACHINE;
};

function getStateStringEntry(stateEnum)
{
	for (var i = 0; i < stringTable.stateList.length; i++) {
		if(stringTable.stateList[i].stateEnum === stateEnum)
			return stringTable.stateList[i];
	}
	return null;
};

function getTransitionStringEntry(transitionEnum)
{
	for (var i = 0; i < stringTable.transitionList.length; i++) {
		if(stringTable.transitionList[i].transitionEnum === transitionEnum)
			return stringTable.transitionList[i];
	}
	return null;
};

	
function getEventStringEntry(eventEnum)
{
	for (var i = 0; i < stringTable.eventList.length; i++) {
		if(stringTable.eventList[i].eventEnum === eventEnum)
			return stringTable.eventList[i];
	}
	return null;
};

function getSignalName(signalEnum)
{
	signalName = stringTable.signalMap[signalEnum];
	if(signalName != undefined)
	{
		return signalName;
	}
	return "";
};

function getEventFullString(event)
{
	eventItem = getEventStringEntry(event.eventEnum);
	eventStr = "";
	if(eventItem != null)
	{
		eventStr = eventItem.name;
	}
	
	if(event.signal != null) {
		eventStr += "." + getSignalName(event.signal.signalEnum);
		if(event.signal.parameters != null)
		{
			signalValues = "(";
			for (var i = 0; i < event.signal.parameters.length; i++) {
				signalAttributeName = event.signal.parameters[i];
				signalAttributeValue = eval("event.signal." + signalAttributeName);
				signalAttributeValueStr = "undefined";
				if(signalAttributeValue != undefined)
				{
					signalAttributeValueStr = signalAttributeValue.toString();
				}
				
				if(i < event.signal.parameters.length - 1)
				{
					signalValues += signalAttributeName + ":" + signalAttributeValueStr + ", ";
				}
				else
				{
					signalValues += signalAttributeName + ":" + signalAttributeValueStr;
				}
			}
			signalValues += ")";
			
			eventStr += signalValues;
		}
	}
	return eventStr;
};

// String Table END
function StateInitialData(state_enum, parent_state_enum, region_count, isSubmachineState, instanceName_) {
	this.state_enum = state_enum;
	this.parent_state_enum = parent_state_enum;
	this.region_count = region_count;
	this.isSubmachineState = isSubmachineState;	
	this.instanceName = instanceName_;
};

function StateData(context, initialData)
{
	this.m_pParent = context;
	this.active_count = 0;							// when entry, ++; when exit --;	besides, for orthogonal state: when region get activated, ++; when region deActivated, --
	this.region_count = initialData.region_count;	// submachineState's region count == submachine's region count 
	this.isSubmachineState = initialData.isSubmachineState;
	this.state_enum = initialData.state_enum;
	var stateStringEntry = getStateStringEntry(this.state_enum);
	this.state_name = stateStringEntry.name;
	this.state_guid = stateStringEntry.guid;
	this.instanceName = initialData.instanceName;
	
	this.parent_state = null;
	this.submachine_state = null;	
	this.historyArray = [];							// array entry represent for each region, the value is the Last Active State's Enum; in order to support history mechanism on submachine state, can not use StateData* as type
	this.incrementActiveCount = function()
	{
		this.active_count++;
		this.notifyStateChange();
		
		if(this.active_count == 1)
		{
			this.m_pParent.m_pManager.base.timingLog(this.instanceName, this.state_guid, "Activate");
		}		
	};
	this.decrementActiveCount = function() 
	{
		this.active_count--;
		this.notifyStateChange();
		
		if(this.active_count == 0)
		{
			this.m_pParent.m_pManager.base.timingLog(this.instanceName, this.state_guid, "DeActivate");
		}
	};
	this.notifyStateChange = function()
	{
		onStateChange(this);
	};
	this.isActiveState = function() 
	{
		if(this.active_count == 1)
			return true;
		else
			return false;
	};
	this.getStatePath = function()
	{
		var names = [];
		var parent = this;
		while(parent !== null)
		{
			if(parent.state_guid.length > 0)
			{
				names.push(parent.state_guid);
			}
			parent = parent.parent_state;
		}
		
		var strPath = "";
		for(var i = names.length - 1; i >= 0; i--)
		{
			if(strPath.length > 0)
			{
				strPath += ",";
			}
			
			strPath += names[i];		
		}
		
		return strPath;
	};

};

	
function TransitionData() {
	this.active = false;
	this.submachine_state = null;
	this.transition_enum;	
	this.transition_name;
	this.transition_guid;
	this.setTransition = function(transitionEnum, submachineState, instanceName_)
	{
		this.transition_enum = transitionEnum;
		this.submachine_state = submachineState;
		this.active = false;		
		var transitionStringEntry = getTransitionStringEntry(transitionEnum);
		this.transition_name = transitionStringEntry.name;
		this.transition_guid = transitionStringEntry.guid;
		this.instanceName = instanceName_;
	};
	this.setTransitionActive = function(context) 
	{
		this.active = true;
		
		context.m_pManager.base.timingLog(this.instanceName, this.transition_guid, "Transition");
		
		onTransition(this);
	};	
};

function InternalEventData(event, state) {
	this.event = event;
	this.state = state;
};

	
function StateMachineContext(instance, manager, instanceName, type)
{
	this.instance = instance;
	this.m_pManager = manager;
	this.m_sInstanceName = instanceName;
	this.m_sType = type;
	this.bTerminate = false;
	this.currentTransition = new TransitionData();
	this.lstStateData = [];
	this.lstDeferredInternalEvents = [];
	this.eventPool = [];
	this.initializeStateMachine = function()
	{
		this.bTerminate = false;
	};
	this.getCurrentStates = function()
	{
		var activeStates = [];
		for (var i = 0; i < this.lstStateData.length; i++) {
			var state = this.lstStateData[i];
			if(state != null && state.isActiveState())
			{
				activeStates.push(state);			
			}
		}
		return activeStates;
	};
	this.getCurrentStatesCount = function() 
	{
		var currentStates = this.getCurrentStates();
		return currentStates.length;
	};
	this.runStateMachineByString = function(statemachine) 
	{
		this.runStateMachineByEnum(getStateMachineEnum(statemachine));
	};
	this.getStateObject = function(submachineState, stateEnum) 
	{
		if(stateEnum == StateEnum.NOSTATE)
			return null;
		for(var i = 0; i < this.lstStateData.length; i++) {
			var state = this.lstStateData[i];
			if(state && state.submachine_state === submachineState && state.state_enum == stateEnum)
			{
				return state;
			}			
		}
		return null;
	};
	this.createStateObjects = function(initialDataArray, submachineState)
	{
		for(var i = 0; i < initialDataArray.length; i++)
		{
			var initialData = initialDataArray[i];
			var parentState = this.getStateObject(submachineState, initialData.parent_state_enum);
			if(parentState === null)
			{
				parentState = submachineState;
			}
			
			var state = this.getStateObject(submachineState, initialData.state_enum);
			if(state === null)
			{
				state = new StateData(this, initialData);
				this.lstStateData.push(state);
			}
			state.parent_state = parentState;
			state.submachine_state = submachineState
		}
	};
	this.doDeepHistory = function(submachineState, history)
	{
		this.stateProc(history, submachineState, StateBehaviorEnum.ENTRY, null, EntryTypeEnum.HistoryEntry, null);
		var historyObject = this.getStateObject(submachineState, history);
		if(historyObject === null)
			return;	// should not happen
		
		for(var i = 0; i < historyObject.region_count; i++)
		{
			var nextHistory = historyObject.historyArray[i];
			if(nextHistory !== null && nextHistory !== undefined && nextHistory !== StateEnum.NOSTATE)
			{
				historyObject.incrementActiveCount();
				if(historyObject.isSubmachineState)
					this.doDeepHistory(historyObject, nextHistory);
				else
					this.doDeepHistory(submachineState, nextHistory);
			}
		}		
	};
	this.deferInternalEvent = function(eventEnum, signal, state) 
	{
		var event = new Event(eventEnum, signal);	
		var internalEvent = new InternalEventData(event, state);
		this.lstDeferredInternalEvents.push(internalEvent);
	};
	this.removeInternalEvent = function(state) 
	{
		for(var i = this.lstDeferredInternalEvents.length - 1; i >= 0; i--) {
			var internalEventData = this.lstDeferredInternalEvents[i];
			if (internalEventData.state == state)
			{
				this.lstDeferredInternalEvents.splice(i, 1);
			}		
		}
	};
	this.releaseSubmachineState = function(submachineState, bChangeArraySize) 
	{
		//var bReleasedSomething = false;
		for(var i = 0; i < this.lstStateData.length; i++) {
			var state = this.lstStateData[i];
			if(state !== null && state.submachine_state === submachineState) {
				this.lstStateData[i] = null;
				this.releaseSubmachineState(state, false);
				//bReleasedSomething = true;
			}
		}
		if(bChangeArraySize) {
			for(var i = this.lstStateData.length - 1; i >= 0; i--) {	
				if(this.lstStateData[i] === null) {
					this.lstStateData.splice(i, 1);
				}
			}
		}
	};
	this.recallOneInternalEvent = function()
	{
		var bDispatchedInternalEvent = false;
		if(this.lstDeferredInternalEvents.length > 0)
		{
			var eventData = this.lstDeferredInternalEvents.shift();
			if(eventData !== null)
			{
				trace("[" + this.m_sInstanceName + ":" + this.m_sType + "] Completion: " + eventData.state.state_name);
				
				if(this.dispatchByEventTo(eventData.event, eventData.state))
				{
					bDispatchedInternalEvent = true;
				}
			}
		}
		return bDispatchedInternalEvent
	};
	this.eventOccurance = function(eventEnum, signal)
	{
		var event = new Event(eventEnum, signal);
	    this.eventPool.push(event);
		
		trace("[" + this.m_sInstanceName + ":" + this.m_sType + "] Event Queued: " + getEventFullString(event));
	};
	this.recall = function() 
	{
		var bEventPoolChanged = false;
		
		for(var i = 0; i < this.eventPool.length;) {
			var event = this.eventPool[i];
			if(!this.defer(event))
			{
				bEventPoolChanged = true;
				
				trace("[" + this.m_sInstanceName + ":" + this.m_sType + "] Event Dispatched: " + getEventFullString(event));
		
				/* it is not deferred, remove from eventPool and dispatch it; if not consumed, iterate to the next event in the queue */
				this.eventPool.splice(i, 1);
				var bDispatched = this.dispatchByEvent(event);
				if(bDispatched){
					break;
				}
			}
			else
				i++;
		}
		
		return bEventPoolChanged;
	};
	this.dumpActiveCnt = function()
	{
		trace("state/initial active count for [" + this.m_sInstanceName + ":" + this.m_sType +"]:");
		for(var i = 0; i < this.lstStateData.length; i++) {
			var state = this.lstStateData[i];
			if(state !== null && state.state_name.indexOf("VIRTUAL_SUBMACHINESTATE") == -1)
			{
				if(state.submachine_state !== null && state.submachine_state.state_name.indexOf("VIRTUAL_SUBMACHINESTATE") == -1)
					trace("    " + state.active_count + ", " + state.state_name + ", called by:" + state.submachine_state.state_name);
				else
					trace("    " + state.active_count + ", " + state.state_name);
			}		
		}		
		this.dumpEvents();
	};
	this.dumpEvents = function()
	{
		if(this.eventPool.length === 0)
			return;
		
		trace("Event Pool: [");
		for(var i = 0; i < this.eventPool.length; i++) {
			var event = this.eventPool[i];
			if(event !== null)
			{
				trace("    " + getEventFullString(event) + ",");
			}
		}
		trace("]");
	};
	this.defer = function(event)
	{
		if(event.eventEnum === EventEnum.COMPLETION)
	        return false;
		var activeStates = this.getCurrentStates();
		var bDeferred = false;
		for(var i = 0; i < activeStates.length; i++)
		{
			var pActiveState = activeStates[i];
			var bDeferredToState = this.deferTo(event, pActiveState);
			if(bDeferredToState)
			{
				bDeferred = true;
				break;
			}
		}
		return bDeferred;
	};
	this.dispatchByString = function(eventStr) 
	{
		var eventStringParser = new ParseEventString();
		eventStringParser.parseEventString(eventStr);
		var signal = getSignalInstance(eventStringParser.signalStr, eventStringParser.arguments);
		
		var returnVal = false;
		returnVal = this.dispatchByEnum(getEventEnum(eventStringParser.evtStr), signal);
		return returnVal;
	};
	this.dispatchByEnum = function(eventEnum, signal) 
	{
		var event = new Event(eventEnum, signal);
		return this.dispatchByEvent(event);
	};
	this.dispatchByEvent = function(event) 
	{
		var bDispatched = false;
		var activeStates = this.getCurrentStates();
		for(var i = 0; i < activeStates.length; i++)
		{
			var pActiveState = activeStates[i];
			var bDispatchedToState = this.dispatch(event, pActiveState, false);
			if(bDispatchedToState)
				bDispatched = true;
		}
		return bDispatched;
	};
	this.dispatchByEventTo = function(event, toState) 
	{
		return this.dispatch(event, toState, false);
	};
	//polymorphism
	this.runStateMachines = function() 
	{
		this.instance.runStateMachines();
	};
	this.deferTo = function(event, toState) {
		return this.instance.defer(event, toState);
	};
		
	this.runStateMachineByEnum = function(statemachine) {
		this.instance.runStateMachineByEnum(statemachine);
	};
	this.dispatch = function(event, toState, bCheckOnly) {
		if(bCheckOnly == false)
		{
			this.m_pManager.base.timingEventLog(getEventFullString(event), toState.state_guid);
		}
			
		return this.instance.dispatch(event, toState, bCheckOnly);
	};
	this.transitionProc = function(transition, signal, submachineState) {
		this.instance.transitionProc(transition, signal, submachineState);
	};
	this.stateProc = function(state, submachineState, behavior, signal, enumEntryType, entryArray) {
		this.instance.stateProc(state, submachineState, behavior, signal, enumEntryType, entryArray);
	};
};

function ContextManager(instance, type)
{
	this.lstContext = [];
	this.type = type;
	this.instance = instance;
	this.simulationStartTime = null;
	this.lstTimingEventLog = [];
	this.lstTimingLog = [];
	this.isStateActive = function(stateName, instanceName)
	{
		for (var i = 0; i < this.lstContext.length; i++) {
			var context = this.lstContext[i];
			if (context !== null && instanceName === context.m_sInstanceName)
			{
				for(var i = 0; i < context.lstStateData.length; i++) {
					var state = context.lstStateData[i];
					if(state !== null && state.state_name == stateName)
					{
						return (state.active_count > 0);
					}
				}
			}
		}
		return false;
	}
	
	this.getActiveState = function(instanceName)
	{
		for (var i = 0; i < this.lstContext.length; i++) {
			var context = this.lstContext[i];
			if (context !== null && instanceName === context.m_sInstanceName)
			{
				var stateNameWithMinRefCnt;
				for(var i = 0; i < context.lstStateData.length; i++) {
					var state = context.lstStateData[i];
					if(state !== null)
					{
						if(state.state_name.indexOf("VIRTUAL_SUBMACHINESTATE") == -1)
						{
							if(state.active_count == 1)
							{
								stateNameWithMaxRefCnt = state.state_name;
								break;
							}	
						}
					}		
				}
				return stateNameWithMaxRefCnt;
			}
		}
		return "";
	}
	this.broadcastEventByString = function(eventStr) 
	{
		var eventStringParser = new ParseEventString();
		eventStringParser.parseEventString(eventStr);
		var signal = getSignalInstance(eventStringParser.signalStr, eventStringParser.arguments);
		this.broadcastEvent(getEventEnum(eventStringParser.evtStr), signal);
	};
	this.broadcastEvent = function(eventEnum, signal) 
	{
		for(var i = 0; i < this.lstContext.length; i++) {
			var context = this.lstContext[i];
			if(context !== null) {
				context.eventOccurance(eventEnum, signal);
			}		
		}		
	};
	//this is 
	this.initializeManager = function() 
	{
		for (var i = 0; i < this.lstContext.length; i++) {
			this.lstContext[i].initializeStateMachine();
		}
	};
	this.runAllStateMachines = function() 
	{
		for (var i = 0; i < this.lstContext.length; i++) {
			this.lstContext[i].runStateMachines();
		}
	};
	this.evaluateCommandString = function(commandStr) 
	{
		var command = "";
		var instance = "";
		var statemachine = "";
		var eventString = "";
		
		if(commandStr === null)
			commandStr = "";
		if(commandStr != "" && commandStr != "step" && commandStr != "stepall")
		{
			trace("Command: " + commandStr);
		}
			
		if(commandStr.indexOf("run ") !== -1) 
		{
			command = "run";
			var argument = commandStr.substr(4);
			var pos = argument.indexOf(".");
			if(pos !== -1) 
			{
				instance = argument.substr(0, pos);
				statemachine = argument.substr(pos + 1);
			} 
			else if(argument === "all") 
			{
				instance = "all";
				statemachine = "all";
			} 
			else if(argument.length !== 0)
			{
				instance = argument;
				statemachine = "all";
			}
		} 
		else if(commandStr === "run") 
		{
			command = "run";
			instance = "all";
			statemachine = "all";		
		} 
		else if(commandStr.indexOf("broadcast ") !== -1) 
		{
			command = "broadcast";
			instance = "all";
			eventString = commandStr.substr(10);
			this.broadcastEventByString(eventString);
		} 
		else if(commandStr.indexOf("send ") !== -1) 
		{
			command = "send";
			var argument = commandStr.substr(5);
			var pos = argument.indexOf(" to ");
			if(pos !== -1) 
			{
				eventString = argument.substr(0, pos);
				instance = argument.substr(pos + 4);
			}
			else
			{
				eventString = argument;
				instance = "all";
			}
		} 
		else if(commandStr.indexOf("dump ") !== -1) 
		{
			command = "dump";
			instance = commandStr.substr(5);
		} 
		else if(commandStr === "dump") 
		{
			command = "dump";
			instance = "all";
		} 
		else if (commandStr === "dumpTimingLog")
		{
			this.dumpTimingLog();
			return true;
		}
		else if (commandStr === "exit") 
		{
			command = "exit";
			return false;
		} 
		else if (commandStr === "stepall") 
		{
			command = "stepall";
			instance = "all";
		} 
		else 
		{
			command = "step";
			instance = "all";
		}
		
		for (var i = 0; i < this.lstContext.length; i++) {
			var context = this.lstContext[i];
			if (context !== null)
			{
				if (command != "broadcast")
				{
					if (instance === "all" || instance === context.m_sInstanceName)
					{
						this.runCommand(command, context, statemachine, eventString);
						if (instance === context.m_sInstanceName)
						{
							break;
						}
					}
				}
				else
				{
					context.recall();
				}
			}
		}
		
		//if any of the context reach a terminiate
		var count = this.lstContext.length;
		for (var i = (count - 1); i >= 0; i--)
		{
			var context = this.lstContext[i];
			if (context != null && context.bTerminate)
			{
				this.lstContext.splice(i, 1);
				this.clearInstance(context.GetInstanceName());
			}		
		}
		
		if(this.isSimulationEnded()) {
			return false;
		}
		
		return true;
		
	};
	this.isSimulationEnded = function()
	{
		var bIsSimulationEnded = true;
		for (var i = 0; i < this.lstContext.length; i++) {
			var context = this.lstContext[i];
			if (context !== null)
			{
				for(var i = 0; i < context.lstStateData.length; i++) {
					var state = context.lstStateData[i];
					if(state !== null && state.active_count > 0)
					{
						bIsSimulationEnded = false;
						break;
					}
				}
				
				if(!bIsSimulationEnded){
					break;
				}
			}
		}
		return bIsSimulationEnded;
	};
	
	this.runCommand = function(command, context, statemachine, eventString) 
	{
		if (context === null)
			return;
		if (command === "run")
		{
			if (statemachine === "all")
				context.runStateMachines(); 
			else
				context.runStateMachineByString(statemachine);
		}
		else if (command === "broadcast")
		{
			this.broadcastEventByString(eventString);
		}
		else if (command === "send")
		{
			this.sendEventByStringTo(eventString, context);
		}
		else if (command === "dump")
		{
			context.dumpActiveCnt();
		}
		else if (command === "stepall")
		{
			while(true)
			{
				bInternalEventDispatched = context.recallOneInternalEvent();
				bEventPoolChanged = context.recall();
				
				//Only if the eventPool will not change any further (all deferred or empty) and all internal completion event are finished, the statemachine can not go any further
				if(!bInternalEventDispatched && !bEventPoolChanged)
					break;
			}
		}
		else if (command === "step")
		{
			if (!context.recallOneInternalEvent())
	        {
	            //This is a wait point, get an event from the pool and dispatch it
	            context.recall();
	        }
		}		
	};
	this.sendEventByString = function(eventStr, contextStr) {
		var context = null;
		for (var i = 0; i < this.base.lstContext.length; i++) {
			if(this.base.lstContext[i].m_sInstanceName === contextStr)
			{
				context = this.base.lstContext[i];
				break;
			}
		}
		
		if(context != null)
		{
			this.sendEventByStringTo(eventStr, context);
		}
	};
	this.sendEventByStringTo = function(eventStr, target)
	{
		if (target !== null)
	    {
			var eventStringParser = new ParseEventString();
			eventStringParser.parseEventString(eventStr);
			var signal = getSignalInstance(eventStringParser.signalStr, eventStringParser.arguments);
			this.sendEvent(getEventEnum(eventStringParser.evtStr), signal, target);
	    }
	};
	this.sendEvent = function (eventEnum, signal, target)
	{
		if(eventEnum && target)
			target.eventOccurance(eventEnum, signal);
	};
	this.clearInstance = function(instanceStr)
	{
		this.instance.clearInstance(instanceStr);
	};
	this.timingEventLog = function(eventName, stateGuid)
	{
		var timeNow = new Date();
		var timeElapsed = timeNow - this.simulationStartTime;
		this.lstTimingEventLog.push(timeElapsed + "," + eventName + "," + stateGuid);
	};

	this.timingLog = function(instanceName, guid, action)
	{
		var timeNow = new Date();
		var timeElapsed = timeNow - this.simulationStartTime;
		this.lstTimingLog.push(timeElapsed + "," + instanceName + "," + guid + "," + action);
	};

	this.dumpTimingLog = function()
	{
		trace("TimingEventLog Begin\n");
		for (i = 0; i < this.lstTimingEventLog.length; ++i) {
			trace("\t" + this.lstTimingEventLog[i] + "\n");
		}
		trace("TimingEventLog End\n");
		
		trace("TimingLog Begin\n");
		for (i = 0; i < this.lstTimingLog.length; ++i) {
			trace("\t" + this.lstTimingLog[i] + "\n");
		}
		trace("TimingLog End\n");
	};

	
};

function ParseEventString() {
	this.evtStr;
	this.signalStr;
	this.arguments = [];	
	/*
		Usage:
		var eventStringParser = new ParseEventString();
		eventStringParser.parseEventString("Event.Signal(argument1,argument2,argument3)");
		console.log(eventStringParser.evtStr);
		console.log(eventStringParser.signalStr);
		console.log(eventStringParser.arguments.length);	
	*/
	this.parseEventString = function(input) {
		var pos = input.indexOf(".");
		if (pos !== -1)
		{
			this.evtStr = input.substr(0, pos);
			var signalWithArguments = input.substr(pos + 1);
			//format: Signal(argument1,argument2,argument3)
			var pos2 = signalWithArguments.indexOf("(");
			if (pos2 !== -1)
			{
				this.signalStr = signalWithArguments.substr(0, pos2);
				var strArguments = signalWithArguments.substr(pos2 + 1, signalWithArguments.length - this.signalStr.length - 2);
				this.arguments = strArguments.split(",");
			}
		}
		else
		{
			this.evtStr = input;
		}
	};

};

function trace(str) {
	traceEx(str);
	traceCount++;
};

function onStateChange(state) {
	//EA Simulation Use		
};

	
function onTransition(transition) {
	
};
