var stateMachineWorker = null;
function startStateMachineWebWorker() {
	if(stateMachineWorker == null)
	{
		stateMachineWorker = new Worker('ManagerWorker.js');
		stateMachineWorker.onmessage = function(e) {
			if(e.data.cmd == 'activeStateResponse')
			{
				onActiveStateResonse(e.data.instance, e.data.value);
			}
			else if(e.data.cmd == 'runtimeValueResponse')
			{
				onRuntimeValueResponse(e.data.name, e.data.value);
			}
		};
	   //start the stateMachineWorker
	   stateMachineWorker.postMessage({'cmd': 'worker_thread'});
	   // start the statemachine
	   runCommand("run");
	}	
}
function stopStateMachineWebWorker()
{
	if(stateMachineWorker != null)
	{
		stateMachineWorker.terminate();
		stateMachineWorker = null;
	}
}
function runCommand(command_str) {
	stateMachineWorker.postMessage({'cmd': 'run', 'value':command_str});
	stateMachineWorker.postMessage({'cmd': 'run', 'value':'stepall'});
};
function RequestActiveState(instance)
{
	stateMachineWorker.postMessage({'cmd': 'getActiveState', 'instanceName': instance});
}
function RequestRuntimeValue(variableName)
{
	stateMachineWorker.postMessage({'cmd': 'getRunState', 'value': variableName});
}
function onActiveStateResonse(instance, activeStateVal)
{
	console.log("onActiveStateResonse: "+instance+" "+activeStateVal);
	switch(instance)
	{
		case "production":
			onActiveStateResonse_production(activeStateVal);
			break;
	}
}
function onActiveStateResonse_production(activeStateVal)
{
	switch(activeStateVal)
	{
		case "Production_StateMachine_Parsing":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Waiting":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_ControlFinal_216":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_ControllerSpringReading":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_Spring2":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_Spring5":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_Spring7":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_Spring9":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_ControllerReading":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_ControllerRoute":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_Controller_81":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_Controller_D":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_Controller_E":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_Controller_I":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_Controller_L":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Controller_Controller_standard":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_DBV_DBVFinal_45":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_DBV_DBVReading":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_DBV_DBV_A":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_DBV_DBV_AB":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_DBV_DBV_AxBx":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_DBV_DBV_B":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_DBV_DBV_C":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Housing_HousingFinal_56":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Housing_HousingReading":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Housing_Housing_E":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Housing_Housing_EI":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Housing_Housing_HAUNF":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Housing_Housing_A":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Housing_Housing_HA":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Magnet_MagnetFinal_106":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Magnet_MagnetFinal_217":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Magnet_Magnet_S12":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Magnet_MagnetReading":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Magnet_Magnet_AMP24":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Magnet_Magnet_G24":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_Magnet_Magnet_X12":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringCover_SpringCoverFinal_87":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringCover_SpringCoverFinal_215":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringCover_SpringCoverReading":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringCover_SpringCoverRoute":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringCover_SpringCover_A":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringCover_SpringCover_CAN":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringCover_SpringCover_E":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringCover_SpringCover_HA":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringCover_SpringCover_HUNF":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringCover_SpringCover_WA":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSet_SpringSetFinal_60":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSet_SpringSetReading":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSet_SpringSet_A":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSet_SpringSet_CAN":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSet_SpringSet_E":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSet_SpringSet_H":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSetScrew_SpringSetScrewFinal_214":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSetScrew_SpringSetScrewRoute":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSetScrew_SpringSetScrewReading":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSetScrew_SpringSetScrew_A":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSetScrew_SpringSetScrew_CAN":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_SpringSetScrew_SpringSetScrew_WA":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_WV_WVFinal_218":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_WV_WVRoute":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_WV_WVReading":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_WV_WV_standard":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_WV_WV_W1":
			//to do: write user's logic
	
			break;
		case "Production_StateMachine_WV_WV_W3":
			//to do: write user's logic
	
			break;
	}
}
function onRuntimeValueResponse(variableName, variableValue)
{
	switch(variableName)
	{
		case "production.assemblyData":
			//to do: write user's logic
			proxy.assemblyData = JSON.parse(variableValue);
			break;
		case "production.tokens":
			//to do: write user's logic
	
			break;
		case "production.guard":
			//to do: write user's logic
	
			break;
		case "production.typeCode":
			//to do: write user's logic
	
			break;
		case "production.typeCodeCheck":
			//to do: write user's logic
	
			break;
	}
}
function broadcast(eventStr)
{
	runCommand("broadcast " + eventStr);	
	//to do: You may need to call 'RequestActiveState' and/or 'RequestRuntimeValue'
}
function initialize()
{
	startStateMachineWebWorker();
	
	//to do: You may need to call 'RequestActiveState' and/or 'RequestRuntimeValue'
}