import {makeAutoObservable, runInAction} from "mobx";

export default class XlsStore {
    selectedDocument = 'defaultDoc';
    currentNumber = 1;
    timerInterval: any = undefined;

    constructor() {
        makeAutoObservable(this)
    }

    startTimer = () => {
        if (this.timerInterval !== undefined) {
            clearInterval(this.timerInterval);
            this.timerInterval = undefined;
        }
        this.timerInterval = setInterval(() => {
            runInAction(() => {
                this.selectedDocument = `Document no: ${this.currentNumber}`;
                this.currentNumber++;
            });
        }, 1000)
    }

    stopTimer = () => {
        if (this.timerInterval !== undefined) {
            clearInterval(this.timerInterval);
            this.timerInterval = undefined;
            this.currentNumber = 1;
        }
    }
}
