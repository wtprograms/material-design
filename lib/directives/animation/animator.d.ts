import { Observable } from 'rxjs';
import { AnimationInstruction } from './animation-instruction';
export declare class Animator {
    readonly state: unknown;
    readonly instructions: AnimationInstruction[];
    private _stopped;
    private _abortController;
    constructor(stateOrStates: unknown | unknown[], ...instructions: AnimationInstruction[]);
    animate(stateValue: unknown, element: HTMLElement): Observable<unknown>;
    stop(): void;
}
