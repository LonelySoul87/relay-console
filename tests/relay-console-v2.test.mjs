import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const htmlPath=fileURLToPath(new URL("../relay-console-v2.0.0-draft.html",import.meta.url));
const html=readFileSync(htmlPath,"utf8");
const scriptStart=html.indexOf("<script>")+8;
const scriptEnd=html.lastIndexOf("</script>");
assert.ok(scriptStart>=8&&scriptEnd>scriptStart,"embedded application script is present");

class FakeClassList{
  constructor(){this.values=new Set();}
  add(...names){names.forEach(n=>this.values.add(n));}
  remove(...names){names.forEach(n=>this.values.delete(n));}
  contains(name){return this.values.has(name);}
  toggle(name,force){
    const on=force===undefined?!this.values.has(name):!!force;
    if(on)this.values.add(name);else this.values.delete(name);
    return on;
  }
}
class FakeElement{
  constructor(tag="div",id=""){
    this.tagName=tag.toUpperCase();this.id=id;this.children=[];this.style={};this.classList=new FakeClassList();
    this.value="";this.checked=false;this.disabled=false;this.textContent="";this.dataset={};this.attributes={};
    this.offsetLeft=0;this.offsetWidth=0;this.clientWidth=0;this.parentNode=null;this.files=[];
  }
  set innerHTML(value){this._innerHTML=String(value);this.children=[];}
  get innerHTML(){return this._innerHTML||"";}
  set className(value){this._className=String(value);this.classList=new FakeClassList();String(value).split(/\s+/).filter(Boolean).forEach(n=>this.classList.add(n));}
  get className(){return this._className||"";}
  append(...nodes){nodes.forEach(node=>this.appendChild(node));}
  appendChild(node){if(node){node.parentNode=this;this.children.push(node);}return node;}
  removeChild(node){this.children=this.children.filter(x=>x!==node);if(node)node.parentNode=null;return node;}
  setAttribute(name,value){this.attributes[name]=String(value);}
  removeAttribute(name){delete this.attributes[name];}
  getAttribute(name){return this.attributes[name]??null;}
  addEventListener(){}
  querySelector(){return null;}
  querySelectorAll(){return [];}
  focus(){}
  select(){}
  click(){if(typeof this.onclick==="function")this.onclick({target:this});}
  scrollTo(){}
}

const elements=new Map();
const documentElement=new FakeElement("html","html");
const document={
  documentElement,
  body:new FakeElement("body","body"),
  getElementById(id){if(!elements.has(id))elements.set(id,new FakeElement("div",id));return elements.get(id);},
  createElement(tag){return new FakeElement(tag);},
  addEventListener(){},
  execCommand(){return false;}
};
const storage=new Map();
const localStorage={
  setItem(k,v){storage.set(String(k),String(v));},
  getItem(k){return storage.has(String(k))?storage.get(String(k)):null;},
  removeItem(k){storage.delete(String(k));}
};
const sandbox={
  __promptReply:null,__confirmReply:true,
  console,document,localStorage,navigator:{clipboard:null},window:{open(){}},Blob,URL,
  alert(){},confirm(){return sandbox.__confirmReply;},prompt(){return sandbox.__promptReply;},setTimeout(){return 0;},clearTimeout(){},
  Date,Math,Map,Set,Array,String,Number,Boolean,JSON,RegExp,Object,Error
};
vm.createContext(sandbox);
const exportsCode=`
globalThis.__relayTest={
  parseBallot,isExactRanking,ballotTally,buildPrompt,markDownstreamStale,saveCurrent,validateSession,
  sessionHasMeaningfulWork,RECIPES,MAX_PARTICIPANTS,Store,setRecipe,
  setPromptReply(value){globalThis.__promptReply=value;},setConfirmReply(value){globalThis.__confirmReply=value;},
  setState(value){state=value;},getState(){return state;},getRecipe(){return recipe;}
};`;
vm.runInContext(html.slice(scriptStart,scriptEnd)+exportsCode,sandbox,{filename:"relay-console-v2.0.0-draft.html"});
const app=sandbox.__relayTest;

function participant(id,name){return {id,name,color:"#10a37f",url:"",role:""};}
function stateFor(turns,participants,answers){
  return {
    version:"2.0.0-draft",question:"Which answer is strongest?",recipe:"ballot",mode:"blind",rounds:1,closing:true,format:"markdown",nonce:"RXTEST1234",
    participants,turns,synthPid:null,answers,forward:turns.map(()=>null),stale:turns.map(()=>false),prompts:turns.map(()=>null),
    promptStale:turns.map(()=>false),draftAnswers:turns.map(()=>null),review:turns.map(()=>false),ballots:turns.map(()=>null),ballotManual:turns.map(()=>false),cursor:0,ended:false,ts:1
  };
}

test("embedded JavaScript loads in a minimal browser environment",()=>{
  assert.equal(typeof app.parseBallot,"function");
  assert.equal(app.MAX_PARTICIPANTS,26);
});

test("ballot parser accepts one explicit, exact ranking line",()=>{
  assert.deepEqual(Array.from(app.parseBallot("RANKING: B > A > C",["A","B","C"])),["B","A","C"]);
  assert.deepEqual(Array.from(app.parseBallot("Reasoning first.\nRANKING: C ≻ B ≻ A\nA final note.",["A","B","C"])),["C","B","A"]);
});

test("ballot parser rejects prose, partial, duplicate, extra, and ambiguous rankings",()=>{
  const labels=["A","B","C"];
  for(const value of [
    "Answer B is strongest. Answer A is acceptable. Answer C is weak.",
    "B > A > C",
    "RANKING: A > B",
    "RANKING: A > A > C",
    "RANKING: A > B > C > D",
    "RANKING: A > B > C because A is best",
    "RANKING: A > B > C\nRANKING: C > B > A"
  ]) assert.equal(app.parseBallot(value,labels),null,value);
});

test("all six recipes build the expected turn structure",()=>{
  const ps=[participant("p0","A"),participant("p1","B")];
  assert.equal(app.RECIPES.debate.build(ps,{rounds:2,closing:true}).length,5);
  assert.deepEqual(Array.from(app.RECIPES.blind.build(ps).map(t=>t.kind)),["blind","blind","synth"]);
  assert.deepEqual(Array.from(app.RECIPES.ballot.build(ps).map(t=>t.kind)),["blind","blind","ballot","ballot","synth"]);
  assert.deepEqual(Array.from(app.RECIPES.dcr.build(ps,{closing:true}).map(t=>t.kind)),["blind","debate","revise","synth"]);
  assert.deepEqual(Array.from(app.RECIPES.redblue.build(ps).map(t=>t.kind)),["debate","debate","revise","synth"]);
  assert.deepEqual(Array.from(app.RECIPES.custom.build(ps,{steps:[{pi:0,kind:"blind",role:"Draft"},{pi:1,kind:"synth",role:"Judge"}]}).map(t=>t.kind)),["blind","synth"]);
});

test("ballot and synthesis roles are woven into generated prompts",()=>{
  const ps=[participant("p0","A"),participant("p1","B")];
  const turns=[
    {pid:"p0",name:"A",color:"#10a37f",role:"",round:1,kind:"blind"},
    {pid:"p1",name:"B",color:"#4f8cf7",role:"",round:1,kind:"blind"},
    {pid:"p0",name:"A",color:"#10a37f",role:"Careful reviewer",round:2,kind:"ballot"},
    {pid:null,name:"Synthesis",color:"#f2a541",role:"Final arbiter",round:0,kind:"synth"}
  ];
  app.setState(stateFor(turns,ps,["Answer A","Answer B","",""]));
  assert.match(app.buildPrompt(2),/Your role in this discussion: Careful reviewer\./);
  assert.match(app.buildPrompt(3),/Your role in this discussion: Final arbiter\./);
});

test("excluding a prior draft never inserts a literal null into a revision prompt",()=>{
  const ps=[participant("p0","Drafter"),participant("p1","Critic")];
  const turns=[
    {pid:"p0",name:"Drafter",color:"#10a37f",role:"Drafter",round:1,kind:"blind"},
    {pid:"p1",name:"Critic",color:"#4f8cf7",role:"Critic",round:1,kind:"debate"},
    {pid:"p0",name:"Drafter",color:"#10a37f",role:"Reviser",round:2,kind:"revise"}
  ];
  const s=stateFor(turns,ps,["ORIGINAL DRAFT","USEFUL CRITIQUE",""]);s.forward[0]="";
  app.setState(s);
  const prompt=app.buildPrompt(2);
  assert.doesNotMatch(prompt,/ORIGINAL DRAFT|\bnull\b/);
  assert.match(prompt,/USEFUL CRITIQUE/);
});

test("Borda tally counts only exact permutations",()=>{
  const ps=[participant("p0","A"),participant("p1","B"),participant("p2","C")];
  const turns=ps.map(p=>({pid:p.id,name:p.name,color:p.color,role:"",round:1,kind:"blind"}));
  turns.push({pid:"p0",name:"A",color:"#10a37f",role:"Reviewer",round:2,kind:"ballot"});
  const s=stateFor(turns,ps,["one","two","three","RANKING: A > B > C"]);
  s.ballots[3]=["A","A","C"];
  app.setState(s);
  assert.equal(app.ballotTally(),null);
  s.ballots[3]=["B","A","C"];
  const tally=app.ballotTally();
  assert.equal(tally.ballots,1);
  assert.equal(tally.rows[0].name,"B");
  assert.equal(tally.rows[0].pts,2);
});

test("changing a ballot marks an existing synthesis and edited prompt stale",()=>{
  const ps=[participant("p0","A"),participant("p1","B")];
  const turns=[
    {pid:"p0",name:"A",color:"#10a37f",role:"",round:1,kind:"blind"},
    {pid:"p1",name:"B",color:"#4f8cf7",role:"",round:1,kind:"blind"},
    {pid:"p0",name:"A",color:"#10a37f",role:"Reviewer",round:2,kind:"ballot"},
    {pid:null,name:"Synthesis",color:"#f2a541",role:"Judge",round:0,kind:"synth"}
  ];
  const s=stateFor(turns,ps,["one","two","RANKING: A > B","saved conclusion"]);
  s.prompts[3]="edited synthesis prompt";
  app.setState(s);
  app.markDownstreamStale(2);
  assert.equal(s.stale[3],true);
  assert.equal(s.promptStale[3],true);
});

test("explicitly saving an unchanged answer clears its stale warning, while Back does not",()=>{
  const ps=[participant("p0","A"),participant("p1","B")];
  const turns=[{pid:"p0",name:"A",color:"#10a37f",role:"",round:1,kind:"debate"}];
  const s=stateFor(turns,ps,["same reviewed answer"]);s.stale[0]=true;
  app.setState(s);elements.get("answer").value="same reviewed answer";
  app.saveCurrent();
  assert.equal(s.stale[0],true);
  app.saveCurrent(true);
  assert.equal(s.stale[0],false);
});

test("session validation restores a parsed draft ballot and preserves a valid manual correction",()=>{
  const raw={
    version:"2.0.0-draft",question:"Q",recipe:"ballot",mode:"blind",participants:[participant("p0","A"),participant("p1","B")],
    turns:[
      {pid:"p0",name:"A",color:"#10a37f",round:1,kind:"blind"},
      {pid:"p1",name:"B",color:"#4f8cf7",round:1,kind:"blind"},
      {pid:"p0",name:"A",color:"#10a37f",round:2,kind:"ballot"}
    ],
    answers:["one","two",""],draftAnswers:[null,null,"RANKING: B > A"],ballots:[null,null,null],cursor:2,ended:false
  };
  const parsed=app.validateSession(raw);
  assert.deepEqual(Array.from(parsed.ballots[2]),["B","A"]);
  raw.answers[2]="RANKING: A > B";raw.draftAnswers[2]=null;raw.ballots[2]=["B","A"];raw.ballotManual=[false,false,true];
  const manual=app.validateSession(raw);
  assert.deepEqual(Array.from(manual.ballots[2]),["B","A"]);
  assert.equal(manual.ballotManual[2],true);
});

test("session validation rejects malformed ballot data and unsafe participant counts",()=>{
  const raw={
    question:"Q",recipe:"ballot",participants:[participant("p0","A"),participant("p1","B"),participant("p2","C")],
    turns:[
      {pid:"p0",name:"A",kind:"blind"},{pid:"p1",name:"B",kind:"blind"},{pid:"p2",name:"C",kind:"blind"},{pid:"p0",name:"A",kind:"ballot"}
    ],answers:["one","two","three","A is best, then B, then C"],ballots:[null,null,null,["A","A","C"]]
  };
  assert.equal(app.validateSession(raw).ballots[3],null);
  assert.throws(()=>app.validateSession({...raw,participants:[participant("p0","only one")]}));
  assert.throws(()=>app.validateSession({...raw,participants:Array.from({length:27},(_,i)=>participant("p"+i,"P"+i))}));
});

test("duplicate imported participant IDs are normalized without ambiguity",()=>{
  const raw={question:"Q",participants:[participant("same","Alpha"),participant("same","Beta")],turns:[{pid:"same",name:"Alpha",kind:"blind"},{pid:"same",name:"Beta",kind:"blind"}],answers:["a","b"]};
  const value=app.validateSession(raw);
  assert.equal(new Set(value.participants.map(p=>p.id)).size,2);
  assert.equal(value.turns[0].pid,value.participants[0].id);
  assert.equal(value.turns[1].pid,value.participants[1].id);
});

test("import replacement guard recognizes first-turn and completed work",()=>{
  assert.equal(app.sessionHasMeaningfulWork({question:"Q",cursor:0,ended:false,answers:[""]}),true);
  assert.equal(app.sessionHasMeaningfulWork({question:"",cursor:0,ended:false,draftAnswers:["draft"]}),true);
  assert.equal(app.sessionHasMeaningfulWork({question:"",cursor:0,ended:true,answers:[]}),true);
  assert.equal(app.sessionHasMeaningfulWork(null),false);
});

test("preset save and delete keep question and answers out of the preset",()=>{
  app.setPromptReply("QA preset");
  document.getElementById("rounds").value="2";
  document.getElementById("closing").checked=true;
  document.getElementById("presetSave").onclick();
  const saved=app.Store.loadPresets();
  assert.equal(saved.length,1);
  assert.equal(saved[0].name,"QA preset");
  assert.equal("question" in saved[0],false);
  assert.equal("answers" in saved[0],false);
  document.getElementById("presetSelect").value="0";
  app.setRecipe("blind");
  document.getElementById("presetLoad").onclick();
  assert.equal(app.getRecipe(),"debate");
  document.getElementById("presetSelect").value="0";
  app.setConfirmReply(true);
  document.getElementById("presetDel").onclick();
  assert.equal(app.Store.loadPresets().length,0);
});

test("important visible controls have accessible labels",()=>{
  for(const id of ["question","recipeSel","rounds","synthPick","format","presetSelect","promptBox","answer"]){
    assert.match(html,new RegExp(`<label[^>]*for=["']${id}["']`),id);
  }
  assert.match(html,/setAttribute\("aria-label","Remove custom step "/);
  assert.match(html,/setAttribute\("aria-label","Remove "\+participantLabel/);
});

test("standalone privacy boundary remains intact",()=>{
  assert.match(html,/connect-src 'none'/);
  assert.doesNotMatch(html,/<script[^>]+src=/i);
  assert.doesNotMatch(html,/<link[^>]+rel=["']stylesheet/i);
  assert.doesNotMatch(html,/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|Worker|SharedWorker)\s*\(/);
});

for(const name of ["relay-session-v1.0.json","relay-session-v1.8.2.json","relay-session-v1.8.2(1).json","relay-session-v1.8.2(2).json"]){
  test(`legacy session remains compatible: ${name}`,()=>{
    const raw=JSON.parse(readFileSync(fileURLToPath(new URL(`../sessions/${name}`,import.meta.url)),"utf8"));
    const value=app.validateSession(raw);
    assert.ok(value.participants.length>=2);
    assert.equal(value.turns.length,value.answers.length);
    assert.ok(value.cursor>=0&&value.cursor<=value.turns.length);
  });
}
