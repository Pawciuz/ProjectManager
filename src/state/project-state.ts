import { Project, ProjectStatus } from '../models/interfaces-&-types.js';
//Project State Management
type Listener<T> = (items: T[]) => void;
abstract class State<T> {
	protected listeners: Listener<T>[] = [];
	addListener(listenerFn: Listener<T>) {
		this.listeners.push(listenerFn);
	}
}
export class ProjectState extends State<Project> {
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
export const projectState = ProjectState.getInstance();
