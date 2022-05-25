// import * as GC from "@grapecity/spread-sheets";
import {SpreadSheets} from "@grapecity/spread-sheets-react";
import GC from '@grapecity/spread-sheets';
import {IO} from "@grapecity/spread-excelio";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import React, {useState, MouseEvent, useEffect} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "./stores/store";
import 'jszip/vendor/FileSaver'
import FileSaver from "file-saver";
import {Button} from "semantic-ui-react";

function XlsTest() {
    const {activityStore} = useStore();
    const [workbook, setWorkbook] = useState<GC.Spread.Sheets.Workbook>(
        new GC.Spread.Sheets.Workbook(),
    );
    const {selectedDocument, startTimer, stopTimer} = activityStore;
    const [importXls, setImportXls] = useState<File | null>(null)

    useEffect(() => {
        console.log(selectedDocument);
        const sheet = workbook.getActiveSheet();
        sheet.getCell(0, 0).value(selectedDocument);
        if(workbook.sheets.length>=2) {
            workbook.suspendCalcService(false)
            workbook.getSheet(1).recalcAll(true);
            workbook.getSheet(1).getCell(1,1).backColor("blue");
            workbook.resumeCalcService(true);
            workbook.sheets.forEach((sheet)=>{
                sheet.recalcAll(true);
            });
        }
        // let instance = new GC.Sheets.Calc.CalcService();
    }, [selectedDocument, workbook]);


    const hostStyle: any = {
        width: "90%",
        height: "600px",
    };

    function initSpread(wb: GC.Spread.Sheets.Workbook) {
        setWorkbook(wb);
        const wbb = wb;
        wbb.options.tabStripVisible = true;
        wbb.options.allowExtendPasteRange = true;
        wbb.options.allowCopyPasteExcelStyle = true;
        const person = {
            name: "Peter Winston",
            age: 25,
            gender: "Male",
            address: {postcode: "10001"},
        };
        const source = new GC.Spread.Sheets.Bindings.CellBindingSource(person);
        const sheet = wb.getActiveSheet();
        sheet.setBindingPath(2, 2, "name");
        sheet.setBindingPath(3, 2, "age");
        sheet.setBindingPath(4, 2, "gender");
        sheet.setBindingPath(5, 2, "address.postcode");
        sheet.setDataSource(source);
    }

    function saveExcel() {
        let json = workbook.toJSON();
        let excelIo = new IO();
        excelIo.save(json, function (blob: any) {
            //console.log(saveAs);
            FileSaver.saveAs(blob, "test.xlsx")
        })
    }

    const loadExcel = () => {
        let spread = workbook;
        let excelIo = new IO();
        let excelFile: Blob;
        excelFile = importXls as Blob;
        if (excelFile !== null) {


            // here is excel IO API
            excelIo.open(excelFile, function (json: any) {
                let workbookObj = json;

                spread.fromJSON(workbookObj);
            }, function (e: any) {
                // process error
                alert(e.errorMessage);
            }, {});
        } else {
            alert("Selecteaza fisier xlsx")
        }
    }

    function addSheet(e: MouseEvent<HTMLInputElement>) {
        const activeIndex = workbook.getActiveSheetIndex();
        if (activeIndex >= 0) {
            workbook.addSheet(activeIndex + 1);
            workbook.setActiveSheetIndex(activeIndex + 1);
        } else {
            workbook.addSheet(0);
            workbook.setActiveSheetIndex(0);
        }
    }

    function changeSheet() {
        workbook.setActiveSheetIndex(0);
    }

    function changeFileDemo(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setImportXls(e.target.files[0]);
        }
    }

    const testComment = () => {
        let sheet= workbook.getSheet(0);
        sheet.comments.add(5, 5, 'new comment!');
        let comments= sheet.comments.all();
        console.log(comments);

    }
    const recalc = () =>{
        if(!workbook.getSheet(1)){
            console.log("sheet [1] not found");
            return;
        }
        console.log("Start recalc");
        console.log(workbook.getSheet(1)?.toJSON())
        workbook.getSheet(1)?.recalcAll(true); // needs recalcAll with true.
        console.log("End recalc")
        console.log(workbook.getSheet(1)?.toJSON());
        let sheet=workbook.getSheet(1);
        console.log(sheet);

    }
    return (
        <div className="App">
            <div className="option-row">
                <Button onClick={startTimer}>Start</Button>
                <Button onClick={stopTimer}>Stop</Button>
                <input
                    type="button"
                    value="Simple test"
                    id="btnAddSheet"
                    onClick={addSheet}
                />
                <input
                    type="button"
                    value="Simple test1"
                    id="btnAddSheet1"
                    onClick={changeSheet}
                />
                <input
                    type="button"
                    value="Save"
                    id="btnAddSheet2"
                    onClick={saveExcel}
                />

                <label htmlFor='fileDemo'>incarca fisier</label>
                <input type="file" id="fileDemo" className="input" onChange={e => changeFileDemo(e)}/>
                <input type="button" id="loadExcel" defaultValue="import" className="button"
                       onClick={_ => loadExcel()}/>
                <input type="button" id="comment" defaultValue="Comment" className="button"
                       onClick={_ => testComment()}/>
                <input type="button" id="recalc" defaultValue="Recalc" className="button"
                       onClick={_ => recalc()}/>
            </div>
            <SpreadSheets
                hostStyle={hostStyle}
                workbookInitialized={(spread) => initSpread(spread)}
            />

        </div>
    );
}

export default observer(XlsTest);

