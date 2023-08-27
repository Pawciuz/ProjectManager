var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from './base-component.js';
import { Autobind } from '../decorators/autobind.js';
import { validate } from '../utility/validation.js';
import { projectState } from '../state/project-state.js';
//ProjectInput Class
export class ProjectInput extends Component {
    constructor() {
        super('#project-input', '#app', true, 'user-input');
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        this.configure();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }
    gatherUserInput() {
        const titleValue = this.titleInputElement.value;
        const descriptionValue = this.descriptionInputElement.value;
        const peopleValue = this.peopleInputElement.value;
        const titleValidatable = {
            value: titleValue,
            required: true,
        };
        const descriptionValidatable = {
            value: descriptionValue,
            required: true,
            minLength: 5,
        };
        const peopleValidatable = {
            value: +peopleValue,
            required: true,
            min: 1,
            max: 5,
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert('Invalid input. Please try again');
            return;
        }
        else {
            return {
                id: (Math.random() * 1000).toString(),
                title: titleValue,
                description: descriptionValue,
                people: +peopleValue,
            };
        }
    }
    isProject(obj) {
        if (typeof obj === 'undefined') {
            return false;
        }
        else {
            return true;
        }
    }
    emptyInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (this.isProject(userInput)) {
            this.emptyInputs();
            projectState.addProject(userInput);
        }
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
