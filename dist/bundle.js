(()=>{"use strict";class e{constructor(e,t,n,r){this.templateElement=document.querySelector(e),this.hostElement=document.querySelector(t);const s=document.importNode(this.templateElement.content,!0);this.element=s.firstElementChild,r&&(this.element.id=r),this.attach(n)}attach(e){this.hostElement.insertAdjacentElement(e?"afterbegin":"beforeend",this.element)}}function t(e,t,n){const r=n.value;return{configurable:!0,enumerable:!1,get(){return r.bind(this)}}}const n=e=>{let t=!0;return e.required&&(t=t&&0!==e.value.toString().trim().length),null!=e.minLength&&"string"==typeof e.value&&(t=t&&e.value.trim().length>=e.minLength),null!=e.maxLength&&"string"==typeof e.value&&(t=t&&e.value.trim().length<=e.maxLength),null!=e.min&&"number"==typeof e.value&&(t=t&&+e.value>=e.min),null!=e.max&&"number"==typeof e.value&&(t=t&&+e.value<=e.max),t};var r;!function(e){e[e.Active=0]="Active",e[e.Finished=1]="Finished"}(r||(r={}));class s{constructor(){this.listeners=[]}addListener(e){this.listeners.push(e)}}class i extends s{constructor(){super(),this.projects=[]}static getInstance(){return this.instance||(this.instance=new i),this.instance}addProject(e){e.status=r.Active,this.projects.push(e),this.updateListeners()}moveProject(e,t){const n=this.projects.find((t=>t.id===e));n&&n.status!==t&&(n.status=t,this.updateListeners())}updateListeners(){for(const e of this.listeners)e(this.projects.slice())}}const l=i.getInstance();class o extends e{constructor(){super("#project-input","#app",!0,"user-input"),this.titleInputElement=this.element.querySelector("#title"),this.descriptionInputElement=this.element.querySelector("#description"),this.peopleInputElement=this.element.querySelector("#people"),this.configure()}configure(){this.element.addEventListener("submit",this.submitHandler)}renderContent(){}gatherUserInput(){const e=this.titleInputElement.value,t=this.descriptionInputElement.value,r=this.peopleInputElement.value,s={value:t,required:!0,minLength:5},i={value:+r,required:!0,min:1,max:5};return n({value:e,required:!0})&&n(s)&&n(i)?{id:(1e3*Math.random()).toString(),title:e,description:t,people:+r}:void alert("Invalid input. Please try again")}isProject(e){return void 0!==e}emptyInputs(){this.titleInputElement.value="",this.descriptionInputElement.value="",this.peopleInputElement.value=""}submitHandler(e){e.preventDefault();const t=this.gatherUserInput();this.isProject(t)&&(this.emptyInputs(),l.addProject(t))}}!function(e,t,n,r){var s,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(l=(i<3?s(l):i>3?s(t,n,l):s(t,n))||l);i>3&&l&&Object.defineProperty(t,n,l)}([t],o.prototype,"submitHandler",null);var a=function(e,t,n,r){var s,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(l=(i<3?s(l):i>3?s(t,n,l):s(t,n))||l);return i>3&&l&&Object.defineProperty(t,n,l),l};class c extends e{get persons(){return 1===this.project.people?"1 person":`${this.project.people} persons`}constructor(e,t){super("#single-project",e,!1),this.project=t,this.configure(),this.renderContent()}dragStartHandler(e){e.dataTransfer.setData("text/plain",this.project.id),e.dataTransfer.effectAllowed="move"}dragEndHandler(e){}configure(){this.element.addEventListener("dragstart",this.dragStartHandler),this.element.addEventListener("dragend",this.dragEndHandler)}renderContent(){this.element.id=this.project.id,this.element.querySelector("h2").textContent=this.project.title,this.element.querySelector("h3").textContent=this.persons+" assigned",this.element.querySelector("p").textContent=this.project.description}}a([t],c.prototype,"dragStartHandler",null),a([t],c.prototype,"dragEndHandler",null);var d=function(e,t,n,r){var s,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(l=(i<3?s(l):i>3?s(t,n,l):s(t,n))||l);return i>3&&l&&Object.defineProperty(t,n,l),l};class p extends e{constructor(e){super("#project-list","#app",!1,`${e}-projects`),this.type=e,this.assignedProjects=[],this.listId=`${this.type}-projects-list`,this.configure(),this.renderContent(),this.listEl=this.element.querySelector("ul")}dragOverHandler(e){e.dataTransfer&&"text/plain"===e.dataTransfer.types[0]&&(e.preventDefault(),this.listEl.classList.add("droppable"))}dropHandler(e){const t=e.dataTransfer.getData("text/plain");l.moveProject(t,"active"===this.type?r.Active:r.Finished),this.listEl.classList.remove("droppable")}dragLeaveHandler(e){this.listEl.classList.remove("droppable")}configure(){this.element.addEventListener("dragover",this.dragOverHandler),this.element.addEventListener("dragleave",this.dragLeaveHandler),this.element.addEventListener("drop",this.dropHandler),l.addListener((e=>{const t=e.filter((e=>"active"===this.type?e.status===r.Active:e.status===r.Finished));this.assignedProjects=t,this.renderProjects()}))}renderContent(){this.element.querySelector("ul").id=this.listId,this.element.querySelector("h2").textContent=this.type.toUpperCase()+" PROJECTS"}renderProjects(){const e=`#${this.listId}`;document.querySelector(e).innerHTML="";for(const t of this.assignedProjects)new c(e,t)}}d([t],p.prototype,"dragOverHandler",null),d([t],p.prototype,"dropHandler",null),d([t],p.prototype,"dragLeaveHandler",null),new o,new p("active"),new p("finished")})();