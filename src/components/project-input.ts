import { Project } from '../models/interfaces.js';
import { Component } from './base-component.js';
import { Autobind } from '../decorators/autobind.js';
import { validate, ValidatableObject } from '../utility/validation.js';
import { projectState } from '../state/project-state.js';
//ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLElement> {
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
