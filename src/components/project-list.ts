import { Project, ProjectStatus, DragTarget } from '../models/interfaces-&-types.js';
import Component from './base-component.js';
import { Autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
import { ProjectItem } from './project-item.js';
//Project List Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
