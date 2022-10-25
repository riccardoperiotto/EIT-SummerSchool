var manager = null;
function ManagerWorker()
{
	this.base = new ContextManager(this, "ManagerWorker");
	this.production = new Production(this, "production");
	this.base.lstContext.push(this.production.base);
	//setup instance associations
};
function worker_thread()
{
	self.importScripts('/ContextManager.js');
	self.importScripts('/EventProxy.js');
	self.importScripts('/Production.js');
	initializeEventStrings();
	manager = new ManagerWorker();
	manager.base.initializeManager();
};
function traceEx(str)
{
};
self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'worker_thread':
      worker_thread();
      break;
    case 'run':
      manager.base.evaluateCommandString(data.value);
      break;
	case 'getRunState':
	  self.postMessage({'cmd': 'runtimeValueResponse', 'name': data.value, 'value': JSON.stringify(eval('manager' + '.' + data.value))});
	  break;
	case 'setRunState':
      variableAndValue = data.value.split("=");
 	  eval('manager' + '.' + variableAndValue[0] + '=' + variableAndValue[1]);
	  break;
	case 'getActiveState':
	  self.postMessage({'cmd': 'activeStateResponse', 'instance': data.instanceName, 'value': manager.base.getActiveState(data.instanceName)});
	  break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);