//enum Project Status
export enum ProjectStatus {
	Active,
	Finished,
}
//Drag & Drop Interfaces
export interface Draggable {
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}
export interface DragTarget {
	dragOverHandler(event: DragEvent): void;
	dropHandler(event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
}
//Project interface
export interface Project {
	id: string;
	title: string;
	description: string;
	people: number;
	status?: ProjectStatus;
}
