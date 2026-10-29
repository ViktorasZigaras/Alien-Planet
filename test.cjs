const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const context={module:{exports:{}}};vm.createContext(context);vm.runInContext(html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1],context);
const e=context.module.exports;let s=e.createInitialState(),checks=0;
function equal(a,b){assert.equal(JSON.stringify(a),JSON.stringify(b));checks++;}
function valid(){equal(e.validateState(s),[]);equal(Object.keys(s.cohorts).length,4);}
function act(c){const r=e.applyCommand(s,c);assert.ok(r.ok,r.reasons?.join(' '));s=r.state;valid();}
const end=(n=1)=>{for(let i=0;i<n;i++)act({type:'endTurn'});};
const assign=(who,job)=>act({type:'assign',cohortId:who,job});
function reject(c){const before=JSON.stringify(s),r=e.applyCommand(s,c);assert.equal(r.ok,false);equal(JSON.stringify(s),before);}
valid();equal(e.forecast(s),{food:1,industry:3,credits:2,research:1,influence:2});
equal(e.computeSupplyField(s)['6,3'],4);equal(e.findPath(s,'2,3','6,3','cohort'),null);assert.ok(e.findPath(s,'2,3','6,3','rover'));checks++;
equal(e.getMovementCost(s,'4,1'),2);equal(e.getMovementCost(s,'0,0'),Infinity);
reject({type:'build',order:'district',cohortId:'pop_b',target:'3,2'});reject({type:'assign',cohortId:'pop_b',job:'tile:1,3'});
end(2);equal(s.resources,{food:14,industry:6,credits:16,research:2,influence:4});
act({type:'develop',nodeId:'technical_education'});reject({type:'develop',nodeId:'technical_education'});reject({type:'develop',nodeId:'precision_assembly'});
act({type:'train',cohortId:'pop_c',qualification:'Specialist'});reject({type:'mobilise',cohortId:'pop_c'});end(2);equal(s.turn,5);equal(s.resources,{food:16,industry:12,credits:16,research:2,influence:4});equal(s.cohorts.pop_c.qualification,'Specialist');equal(s.cohorts.pop_c.state.job,null);
assign('pop_c','building:lab_main');end();equal(s.resources,{food:17,industry:15,credits:18,research:5,influence:6});
act({type:'develop',nodeId:'standard_tooling'});act({type:'develop',nodeId:'field_coordination'});equal(e.reach(s,'cohort'),5);equal(e.reach(s,'rover'),5);
assign('pop_b',null);reject({type:'build',order:'district',cohortId:'pop_b',target:'1,3'});reject({type:'build',order:'district',cohortId:'pop_b',target:'4,1'});
act({type:'build',order:'district',cohortId:'pop_b',target:'3,2'});equal(e.importState(JSON.stringify(s)),s);end();equal(s.resources,{food:18,industry:13,credits:20,research:4,influence:2});
act({type:'build',order:'workshop',cohortId:'pop_b',districtId:'district_main'});equal(e.importState(JSON.stringify(s)),s);end(2);equal(s.resources,{food:20,industry:7,credits:22,research:10,influence:6});equal(e.forecast(s).industry,0);
assign('pop_b','building:workshop_main');end();equal(s.resources,{food:21,industry:10,credits:23,research:13,influence:8});
act({type:'develop',nodeId:'precision_assembly'});equal(e.forecast(s).industry,4);assign('pop_b',null);equal(e.forecast(s).industry,0);assign('pop_b','building:workshop_main');
act({type:'mobilise',cohortId:'pop_c'});equal(s.cohorts.pop_c.state.movementRemaining,0);reject({type:'move',unitId:'pop_c',target:'3,3'});end();for(let q=3;q<=6;q++){act({type:'move',unitId:'pop_c',target:`${q},3`});if(q<6)end();}
act({type:'join',cohortId:'pop_c'});assign('pop_c','building:lab_field');equal(e.forecast(s).research,3);end();equal(e.importState(JSON.stringify(s)),s);
// Repeated join/mobilise cannot refresh movement.
act({type:'mobilise',cohortId:'pop_c'});equal(s.cohorts.pop_c.state.movementRemaining,0);act({type:'join',cohortId:'pop_c'});act({type:'mobilise',cohortId:'pop_c'});equal(s.cohorts.pop_c.state.movementRemaining,0);
// Rover is independent, constrained by movement and water.
reject({type:'move',unitId:'rover',target:'0,0'});act({type:'move',unitId:'rover',target:'4,3'});equal(s.units.rover.movementRemaining,0);
// Malformed imports and inconsistent references are rejected.
for(const mutate of [x=>x.schemaVersion=999,x=>x.resources.food=-1,x=>x.cohorts.pop_a.state.job='building:workshop_main',x=>x.units.rover.tileId='0,0',x=>x.cohorts.pop_b.state={kind:'training',settlementId:'main'},x=>x.completed.push('made_up'),x=>x.buildings.evil={id:'evil',type:'lab',settlementId:'main'}]){const bad=JSON.parse(JSON.stringify(s));mutate(bad);assert.throws(()=>e.importState(JSON.stringify(bad)));checks++;}
assert.throws(()=>e.importState('{broken'));checks++;
s=e.createInitialState();assign('pop_a',null);s.resources.food=0;end();equal(s.resources.food,0);assert.ok(s.warnings.length);checks++;s.completed=['technical_education'];reject({type:'train',cohortId:'pop_c',qualification:'Specialist'});assign('pop_a','tile:1,3');end();assert.ok(s.resources.food>0);checks++;
equal(e.createInitialState().resources,e.PRESET.start);
console.log(`PASS: ${checks} assertions; exact walkthrough, staffing, timing, relocation, supply, atomic rejection, shortages, import validation.`);
