//Project State Management
type Listener<T> = (items: T[]) => void;
abstract class State<T> {
	protected listeners: Listener<T>[] = [];
	addListener(listenerFn: Listener<T>) {
		this.listeners.push(listenerFn);
	}
}
class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}
	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addProject(prj: Project) {
		prj.status = ProjectStatus.Active;
		this.projects.push(prj);
		this.updateListeners();
	}
	moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find(prj => prj.id === projectId);
		if (project && project.status !== newStatus) {
			project.status = newStatus;
			this.updateListeners();
		}
	}
	private updateListeners() {
		for (const listenerFn of this.listeners) {
			listenerFn(this.projects.slice());
		}
	}
}
const projectState = ProjectState.getInstance();

//Drag & Drop Interfaces
interface Draggable {
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}
interface DragTarget {
	dragOverHandler(event: DragEvent): void;
	dropHandler(event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
}

//enum Project Status
enum ProjectStatus {
	Active,
	Finished,
}
//Project interface
interface Project {
	id: string;
	title: string;
	description: string;
	people: number;
	status?: ProjectStatus;
}

//Validation
interface ValidatableObject {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

const validate = (validatableInput: ValidatableObject) => {
	let isValid = true;
	if (validatableInput.required) {
		isValid = isValid && validatableInput.value.toString().trim().length !== 0;
	}
	if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
		isValid = isValid && validatableInput.value.trim().length >= validatableInput.minLength;
	}
	if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
		isValid = isValid && validatableInput.value.trim().length <= validatableInput.maxLength;
	}
	if (validatableInput.min != null && typeof validatableInput.value === 'number') {
		isValid = isValid && +validatableInput.value >= validatableInput.min;
	}
	if (validatableInput.max != null && typeof validatableInput.value === 'number') {
		isValid = isValid && +validatableInput.value <= validatableInput.max;
	}
	return isValid;
};
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;
	const adjDescriptor: PropertyDescriptor = {
		configurable: true,
		enumerable: false,
		get() {
			const boundFn = originalMethod.bind(this);
			return boundFn;
		},
	};
	return adjDescriptor;
}

//Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	hostElement: T;
	element: U;
	constructor(
		templateId: string,
		hostElementId: string,
		insertAtStart: boolean,
		newElementId?: string,
	) {
		this.templateElement = document.querySelector(templateId)! as HTMLTemplateElement;
		this.hostElement = document.querySelector(hostElementId)! as T;
		const importedNode = document.importNode(this.templateElement.content, true);
		this.element = importedNode.firstElementChild as U;
		if (newElementId) this.element.id = newElementId;
		this.attach(insertAtStart);
	}
	private attach(insertAtStart: boolean) {
		this.hostElement.insertAdjacentElement(
			insertAtStart ? 'afterbegin' : 'beforeend',
			this.element,
		);
	}

	abstract configure(): void;
	abstract renderContent(): void;
}
//ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLElement> {
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;
	constructor() {
		super('#project-input', '#app', true, 'user-input');
		this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector(
			'#description',
		)! as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;
		this.configure();
	}
	configure() {
		this.element.addEventListener('submit', this.submitHandler);
	}
	renderContent(): void {}
	private gatherUserInput(): Project | void {
		const titleValue = this.titleInputElement.value;
		const descriptionValue = this.descriptionInputElement.value;
		const peopleValue = this.peopleInputElement.value;

		const titleValidatable: ValidatableObject = {
			value: titleValue,
			required: true,
		};
		const descriptionValidatable: ValidatableObject = {
			value: descriptionValue,
			required: true,
			minLength: 5,
		};
		const peopleValidatable: ValidatableObject = {
			value: +peopleValue,
			required: true,
			min: 1,
			max: 5,
		};
		if (
			!validate(titleValidatable) ||
			!validate(descriptionValidatable) ||
			!validate(peopleValidatable)
		) {
			alert('Invalid input. Please try again');
			return;
		} else {
			return {
				id: (Math.random() * 1000).toString(),
				title: titleValue,
				description: descriptionValue,
				people: +peopleValue,
			};
		}
	}

	private isProject(obj: Project | void): boolean {
		if (typeof obj === 'undefined') {
			return false;
		} else {
			return true;
		}
	}
	private emptyInputs(): void {
		this.titleInputElement.value = '';
		this.descriptionInputElement.value = '';
		this.peopleInputElement.value = '';
	}
	@Autobind
	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (this.isProject(userInput)) {
			this.emptyInputs();
			projectState.addProject(userInput!);
		}
	}
}
//Project List Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
	assignedProjects: Project[];
	listId: string;
	constructor(private type: 'active' | 'finished') {
		super('#project-list', '#app', false, `${type}-projects`);
		this.assignedProjects = [];
		this.listId = `${this.type}-projects-list`;
		this.configure();
		this.renderContent();
	}

	@Autobind
	dragOverHandler(event: DragEvent): void {
		if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
			event.preventDefault();
			const listEl = this.element.querySelector('ul')!;
			listEl.classList.add('droppable');
		}
	}
	@Autobind
	dropHandler(event: DragEvent): void {
		const projectId = event.dataTransfer!.getData('text/plain');
		projectState.moveProject(
			projectId,
			this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished,
		);
	}
	@Autobind
	dragLeaveHandler(_: DragEvent): void {
		const listEl = this.element.querySelector('ul')!;
		listEl.classList.remove('droppable');
	}
	configure(): void {
		this.element.addEventListener('dragover', this.dragOverHandler);
		this.element.addEventListener('dragleave', this.dragLeaveHandler);
		this.element.addEventListener('drop', this.dropHandler);
		projectState.addListener((projects: Project[]) => {
			const relevantProjects = projects.filter(prj => {
				if (this.type === 'active') {
					return prj.status === ProjectStatus.Active;
				} else {
					return prj.status === ProjectStatus.Finished;
				}
			});
			this.assignedProjects = relevantProjects;
			this.renderProjects();
		});
	}
	renderContent() {
		this.element.querySelector('ul')!.id = this.listId;
		this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
	}
	private renderProjects() {
		const host = `#${this.listId}`;
		const listEl = document.querySelector(host) as HTMLUListElement;
		listEl.innerHTML = '';
		for (const prjItem of this.assignedProjects) {
			new ProjectItem(host, prjItem);
		}
	}
}
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
	private project: Project;

	get persons() {
		if (this.project.people === 1) {
			return '1 person';
		} else {
			return `${this.project.people} persons`;
		}
	}
	constructor(hostId: string, project: Project) {
		super('#single-project', hostId, false);
		this.project = project;
		this.configure();
		this.renderContent();
	}
	@Autobind
	dragStartHandler(event: DragEvent): void {
		event.dataTransfer!.setData('text/plain', this.project.id);
		event.dataTransfer!.effectAllowed = 'move';
	}
	@Autobind
	dragEndHandler(_: DragEvent): void {}
	configure(): void {
		this.element.addEventListener('dragstart', this.dragStartHandler);
		this.element.addEventListener('dragend', this.dragEndHandler);
	}
	renderContent(): void {
		this.element.id = this.project.id;
		this.element.querySelector('h2')!.textContent = this.project.title;
		this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
		this.element.querySelector('p')!.textContent = this.project.description;
	}
}
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
