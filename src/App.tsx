import React from 'react';
import './App.css';
import {observer} from "mobx-react-lite";
import {useStore} from "./stores/store";
import {Button} from "semantic-ui-react";
import XlsTest from "./XlsTest";

function App() {
    const {activityStore} = useStore();
    const {selectedDocument, startTimer, stopTimer} = activityStore;
    return (
        <>
            {/*<div> Simple test</div>*/}
            {/*<Button onClick={startTimer}>Start</Button>*/}
            {/*<Button onClick={stopTimer}>Stop</Button>*/}
            {/*<div className="App">*/}
            {/*    {selectedDocument}*/}
            {/*</div>*/}
            <XlsTest></XlsTest>
        </>
    );
}

export default observer(App);
