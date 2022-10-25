function SimulationManager()
{
	this.base = new ContextManager(this, "SimulationManager");
	this.m_pCommand = "";
	this.m_commands = [];
	this.activeStates = [];
	this.activeStateCount=0;
	this.production = new Production(this, "production");
	this.base.lstContext.push(this.production.base);
	//setup instance associations
	
	this.clearInstance = function(instanceStr)
	{
		if(instanceStr === "production")
			this.production = null;	
	};

};

function setActiveStates()
{
	this.activeStates.length = 0;
	
	for(var i = 0; i < this.base.lstContext.length; i++)
	{
		var context = this.base.lstContext[i];
		if(context !== null)
		{
			for(var j = 0; j < context.lstStateData.length; j++)
			{
				var state = context.lstStateData[j];
				if(state !== null && state.active_count == 1)
				{
					var sStatePath = context.m_sInstanceName + "," + state.getStatePath();	
					this.activeStates.push(sStatePath);
				}
			}
		}		
	}
	this.activeStateCount=this.activeStates.length;
};

function onStepComplete()
{
	// Synchronization point for EA
	if(this.m_pCommand.length > 0)
	{
		this.m_commands.push(this.m_pCommand);
		this.m_pCommand = "";
	}
};

function dequeue()
{
	var command = "";
	if(this.m_commands.length > 0)
	{
		command = this.m_commands.shift();
	}
	return command;
};

function run_SimulationManager()
{
	this.base.simulationStartTime = new Date();
	
	this.base.runAllStateMachines();
	var bContinue = true;
	while(bContinue)
	{
		setActiveStates.call(this);
		
		///////////////////
		onStepComplete.call(this);
		///////////////////
		
		var sIn = "";
		sIn = dequeue.call(this);
		
		bContinue = this.base.evaluateCommandString(sIn);
	}
};

function main()
{
	initializeEventStrings();
	var manager = new SimulationManager();
	manager.base.initializeManager();
	run_SimulationManager.call(manager);
};

function traceEx(str)
{
	//empty
};


main();	//EA use