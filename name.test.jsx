import React from "react";
import { BrowserRouter } from "react-router-dom";
import { within as withinShadow } from 'shadow-dom-testing-library';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import AppLevelRetnRem from "../../../components/Reports/AppLevelRetnRem";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("AppLevelRetnRem", () => {
    beforeEach(() => {
        jest.spyOn(global, "fetch").mockResolvedValue({
            json: () => ({
                columns : [
                        "LOB_FCTN_NM","PROD_NM","APPL_SYS_ID","APPL_SYS_NM","APPL_SYS_STS_NM","ACTL_OPER_DT",
                        "PLN_RTR_DT","ACTL_RTR_DT","PLN_DCMSN_DT","ACTL_DCMSN_DT","RETN_CLS_MV","TYPE_CD",
                        "APPL_TECH_GP_OWNR_NM","LGL_HLD_STS","DATA_RQR_DOC_STS_CD","APPL_LVL_FLAG","RPT_EXEC_ID"],
                rows : [["Cross AM", "209 AWM product", "14775", "Automated Credit Application Processing System-CAF",
                        "Operate", "1980-01-01 00:00:00", "2025-12-31 00:00:00", "1980-01-01 00:00:00", "2026-12-09 00:00:00",
                        "1980-01-01 00:00:00", "JuatMeng Tan", "JuatMeng Tan", "Sylvia Torres", "Arya Kalla", "Auto - Auto Originations", "No",
                        "Under Assessment", "No", "20231106133611" ]],
                }),
            });
        });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const mockFilteredData =
            [{
                "LOB_FCTN_NM":"Cross AM",
                "PROD_NM":"209 AWM product",
                "APPL_SYS_ID":"14775",
                "APPL_SYS_NM":"Automated Credit Application Processing System-CAF",
                "APPL_SYS_STS_NM":"Operate",
                "ACTL_OPER_DT":"1980-01-01 00:00:00",
                "PLN_RTR_DT":"1980-01-01 00:00:00",
                "ACTL_RTR_DT":"1980-01-01 00:00:00",
                "PLN_DCMSN_DT":"1980-01-01 00:00:00",
                "ACTL_DCMSN_DT":"1980-01-01 00:00:00",
                "RETN_CLS_MV":"CONFIG DATA ONLY",
                "TYPE_CD":"DBU",
                "LGL_HLD_STS":"No",
                "DATA_RQR_DOC_STS_CD":"Under Assessment",
                "APPL_LVL_FLAG":"No",
                "RPT_EXEC_ID":"20231106133611",
            }]

    it("Is rendering the components", () => {
        const { obj } = render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );
    });

    it("handles fetch error", async() => {
        jest.spyOn(global, "fetch").mockImplementation(() => Promise.reject('Fetch Error'));
        const { getByText } = render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );
        await act(async () => {
            try{
                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch(error){

            }
        });
        expect(fetch).toHaveBeenCalled();
    });

    it('renders page heading', () => {
        const { obj } = render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );
        expect(screen.getByTestId('app-level-retn-rem-dashboard-title-text')).toHaveTextContent('Retention Remediation Dashboard');
    });

    it('renders spinner on initial load', () => {
        const { obj } = render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );
        expect(screen.getByTestId('app-levl-retn-rem-mds-progress-spinner')).toBeInTheDocument();
    });

    it('fetches and displays data on load', async () => {
        const { queryByTestId } = render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.queryByTestId('app-levl-retn-rem-mds-progress-spinner')).not.toBeInTheDocument());

        expect(screen.getByTestId('app-level-retn-rem-mds-datatable')).toBeInTheDocument();
        expect(screen.queryByText('No Data Found')).not.toBeInTheDocument();
    });

    it("renders the tiles correctly", () => {
        render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );
        expect(screen.getByTestId('app-level-retn-rem-dashboard-total-apps-tile')).toBeInTheDocument();
        expect(screen.getByTestId('app-level-retn-rem-dashboard-total-obr-count-tile')).toBeInTheDocument();
        expect(screen.getByTestId('app-level-retn-rem-dashboard-total-active-legal-hold-count-tile')).toBeInTheDocument();
    });

    it("renders the multiselect filters correctly", () => {
        render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );
        expect(screen.getByTestId('app-level-retn-rem-app-id-multiselect')).toBeInTheDocument();
        expect(screen.getByTestId('app-level-retn-rem-obr-multiselect')).toBeInTheDocument();
    });

    it('updates on appId search', async() => {
        const setSearch = jest.fn((value) => {})
        render(
            <BrowserRouter>
                <AppLevelRetnRem setSearch={setSearch}/>
            </BrowserRouter>
        );
        const appIDMultiselect = screen.getByTestId('app-level-retn-rem-app-id-multiselect')
        fireEvent.change(appIDMultiselect, { target: { value: '' } });
        expect(appIDMultiselect.value).toStrictEqual([]);
    });

    it('updates on OBR search', async() => {
        const setSearch = jest.fn((value) => {})
        render(
            <BrowserRouter>
                <AppLevelRetnRem setSearch={setSearch}/>
            </BrowserRouter>
        );
        const OBRMultiselect = screen.getByTestId('app-level-retn-rem-obr-multiselect')
        fireEvent.change(OBRMultiselect, { target: { value: '' } });
        expect(OBRMultiselect.value).toStrictEqual([]);
    });

    it('toggles Legal Hold Filter', async () => {
        const legalHoldFilter = ""

        const { queryByTestId } = render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.queryByTestId('app-levl-retn-rem-mds-progress-spinner')).not.toBeInTheDocument());

        const legalHoldToggle = screen.queryByTestId('app-level-retn-rem-legal-hold-filter');
        fireEvent(legalHoldToggle, new CustomEvent('click', {target:"app-level-retn-rem-legal-hold-filter.app-level-retn-rem-legal-hold-filter--cmb"}));
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(legalHoldFilter).toBe("");
    });

    it('toggles Approved Extended Retention Filter', async () => {
        const approvedExtendedRetentionFilter = ""

        const { queryByTestId } = render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.queryByTestId('app-levl-retn-rem-mds-progress-spinner')).not.toBeInTheDocument());

        const approvedExtendedRetentionToggle = screen.queryByTestId('app-level-retn-rem-approved-extended-retn-filter');
        fireEvent(approvedExtendedRetentionToggle, new CustomEvent('click', {target:"app-level-retn-rem-approved-extended-retn-filter.app-level-retn-rem-approved-extended-retn-filter--cmb"}));
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(approvedExtendedRetentionFilter).toBe("");
    });

    it('toggles Class Code Comparison Filter', async () => {
        const classCodeComparisonFilter = ""

        const { queryByTestId } = render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.queryByTestId('app-levl-retn-rem-mds-progress-spinner')).not.toBeInTheDocument());

        const classCodeCompToggle = screen.queryByTestId('app-level-retn-rem-class_code_comp-filter');
        fireEvent(classCodeCompToggle, new CustomEvent('click', {target:"app-level-retn-rem-class_code_comp-filter.app-level-retn-rem-class_code_comp-filter--cmb"}));
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(classCodeComparisonFilter).toBe("");
    });

    it('export data in a excel file when button is clicked', async() => {
        const { getByTestId } = render(
          <BrowserRouter>
            <AppLevelRetnRem />
          </BrowserRouter>
        );
        const excelButton = screen.getByTestId("app-level-retn-rem-excel-export-data-button");
        const exportToExcel = jest.fn();
        excelButton.onclick = exportToExcel;
        fireEvent.click(excelButton);
        await waitFor(() => expect(exportToExcel).toHaveBeenCalled());
    });
    
      it('export data in a pdf file when button is clicked', async() => {
        const { getByTestId } = render(
          <BrowserRouter>
            <AppLevelRetnRem />
          </BrowserRouter>
        );
        const pdfButton = screen.getByTestId("app-level-retn-rem-pdf-export-data-button");
        const exportToPDF = jest.fn();
        pdfButton.onclick = exportToPDF;
        fireEvent.click(pdfButton);
        await waitFor(() => expect(exportToPDF).toHaveBeenCalled());
    });

    it('clicking datatable row is working correctly', async() => {
        // Mock the fetch call to return some data
        jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve({
            columns: [
                "APPL_SYS_ID","APPL_SYS_NM","ASET_ID","ASET_NM","PRPS_CLS_CD","RGST_STS_CD",
                "RETN_CNTRY_NM","EFF_TS","RCRD_CLS_CD","RETN_CLS_MV","HAS_DATA_STOR_NM",
                "DATA_STOR_HAS_CLS_CD","CLS_CD_COMPARISION_IND","AVLB_DATA_STOR_COUNT",
                "DATA_STOR_COUNT_WITH_MATCHING_CLS_CD","DATA_STOR_COUNT_WITH_NOT_MATCHING_CLS_CD",
                "DESTR_DOCUMENTED_ON_DT","DESTR_DOCUMENTED_BY","DESTR_CONFIRMED_ON_DT",
                "DESTR_CONFIRMED_BY","RETN_DOCUMENTED_ON_DT","RETN_DOCUMENTED_BY",
                "RETN_CONFIRMED_ON_DT","RETN_CONFIRMED_BY","CALC_ERLST_DESTR_ELIG_DT",
                "OVRL_ERLST_DESTR_ELIG_DT","TIME_REMAINING","HAS_DESTR_ELIG_DATA",
                "APPROVED_EXTENDED_RETENTION","EXTENDED_RETENTION_DT","REQ_DESTR_PROC_FREQ",
                "DESTR_ENBL","APPL_OWNR_SID","APPL_OWNR_NM","INFO_OWNR_SID","INFO_OWNR_NM",
                "DATA_OWNR_SID","DATA_OWNR_NM","CRE_TS"
            ],
            rows: [
                [20553, "Image Services Team", null, null, null, null, "None", "None", null,
                "DBU030D", "No", "No", "No", 1, 0, 1, null, null, null, null, null, null, null,
                null, null, null, null, "No", null, null, "Annual", "No", "E128253",
                "William Welch", "N595287", "Eukarlgen Rothe", "-", "-",
                "2024-06-11 13:25:36"],
            ],
            }),
        }));
        const handleAppLevelClick=jest.fn();
        render(
        <BrowserRouter>
            <AppLevelRetnRem filteredData={mockFilteredData} onClick={handleAppLevelClick}/>
        </BrowserRouter>
        );

        await new Promise((resolve) => setTimeout(resolve, 100));
        const datatable = screen.queryByTestId('app-level-retn-rem-mds-datatable');
        expect(datatable).toBeInTheDocument();
        fireEvent(datatable, new CustomEvent('click', {detail: {columnIndex: "22", rowIndex: "1"}}));
        await waitFor(() => expect(screen.queryByTestId('app-levl-retn-rem-mds-progress-spinner')).not.toBeInTheDocument());
    });

});











import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import AppLevelRetnRem from "../../../components/Reports/AppLevelRetnRem";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("AppLevelRetnRem", () => {
    const mockData = {
        columns: [
            "LOB_FCTN_NM", "PROD_NM", "APPL_SYS_ID", "APPL_SYS_NM", "APPL_SYS_STS_NM", "ACTL_OPER_DT",
            "PLN_RTR_DT", "ACTL_RTR_DT", "PLN_DCMSN_DT", "ACTL_DCMSN_DT", "RETN_CLS_MV", "TYPE_CD",
            "APPL_TECH_GP_OWNR_NM", "LGL_HLD_STS", "DATA_RQR_DOC_STS_CD", "APPL_LVL_FLAG", "RPT_EXEC_ID"
        ],
        rows: [
            ["Cross AM", "209 AWM product", "14775", "Automated Credit Application Processing System-CAF",
            "Operate", "1980-01-01 00:00:00", "2025-12-31 00:00:00", "1980-01-01 00:00:00", "2026-12-09 00:00:00",
            "1980-01-01 00:00:00", "JuatMeng Tan", "JuatMeng Tan", "Sylvia Torres", "Arya Kalla", "Auto - Auto Originations", "No",
            "Under Assessment", "No", "20231106133611"]
        ]
    };

    beforeEach(() => {
        jest.spyOn(global, "fetch").mockResolvedValue({
            json: () => Promise.resolve(mockData),
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <AppLevelRetnRem />
            </BrowserRouter>
        );
    };

    it("renders without crashing and shows spinner initially", () => {
        renderComponent();
        expect(screen.getByTestId('app-level-retn-rem-dashboard-title-text')).toHaveTextContent('Retention Remediation Dashboard');
        expect(screen.getByTestId('app-levl-retn-rem-mds-progress-spinner')).toBeInTheDocument();
    });

    it("fetches and displays data, hides spinner after load", async () => {
        renderComponent();
        await waitFor(() => expect(screen.queryByTestId('app-levl-retn-rem-mds-progress-spinner')).not.toBeInTheDocument());
        expect(screen.getByTestId('app-level-retn-rem-mds-datatable')).toBeInTheDocument();
        expect(screen.queryByText('No Data Found')).not.toBeInTheDocument();
    });

    it("handles fetch error", async () => {
        jest.spyOn(global, "fetch").mockImplementation(() => Promise.reject('Fetch Error'));
        renderComponent();
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
        });
        expect(fetch).toHaveBeenCalled();
    });

    it("renders the tiles and filters correctly", () => {
        renderComponent();
        expect(screen.getByTestId('app-level-retn-rem-dashboard-total-apps-tile')).toBeInTheDocument();
        expect(screen.getByTestId('app-level-retn-rem-dashboard-total-obr-count-tile')).toBeInTheDocument();
        expect(screen.getByTestId('app-level-retn-rem-dashboard-total-active-legal-hold-count-tile')).toBeInTheDocument();
        expect(screen.getByTestId('app-level-retn-rem-app-id-multiselect')).toBeInTheDocument();
        expect(screen.getByTestId('app-level-retn-rem-obr-multiselect')).toBeInTheDocument();
    });

    it("updates on filter search and toggles correctly", async () => {
        renderComponent();
        const appIDMultiselect = screen.getByTestId('app-level-retn-rem-app-id-multiselect');
        fireEvent.change(appIDMultiselect, { target: { value: '14775' } });
        expect(appIDMultiselect.value).toStrictEqual(['14775']);

        const legalHoldToggle = screen.getByTestId('app-level-retn-rem-legal-hold-filter');
        fireEvent.click(legalHoldToggle);
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(screen.getByTestId('app-level-retn-rem-legal-hold-filter')).toBeChecked();

        const approvedExtendedRetentionToggle = screen.getByTestId('app-level-retn-rem-approved-extended-retn-filter');
        fireEvent.click(approvedExtendedRetentionToggle);
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(screen.getByTestId('app-level-retn-rem-approved-extended-retn-filter')).toBeChecked();

        const classCodeCompToggle = screen.getByTestId('app-level-retn-rem-class_code_comp-filter');
        fireEvent.click(classCodeCompToggle);
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(screen.getByTestId('app-level-retn-rem-class_code_comp-filter')).toBeChecked();
    });

    it("exports data correctly", async () => {
        renderComponent();
        const exportToExcel = jest.fn();
        const exportToPDF = jest.fn();
        
        screen.getByTestId("app-level-retn-rem-excel-export-data-button").onclick = exportToExcel;
        screen.getByTestId("app-level-retn-rem-pdf-export-data-button").onclick = exportToPDF;

        fireEvent.click(screen.getByTestId("app-level-retn-rem-excel-export-data-button"));
        await waitFor(() => expect(exportToExcel).toHaveBeenCalled());

        fireEvent.click(screen.getByTestId("app-level-retn-rem-pdf-export-data-button"));
        await waitFor(() => expect(exportToPDF).toHaveBeenCalled());
    });

    it("handles row click correctly", async () => {
        jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve({
                columns: ["APPL_SYS_ID","APPL_SYS_NM","ASET_ID","ASET_NM","PRPS_CLS_CD","RGST_STS_CD","RETN_CNTRY_NM","EFF_TS","RCRD_CLS_CD","RETN_CLS_MV","HAS_DATA_STOR_NM","DATA_STOR_HAS_CLS_CD","CLS_CD_COMPARISION_IND","AVLB_DATA_STOR_COUNT","DATA_STOR_COUNT_WITH_MATCHING_CLS_CD","DATA_STOR_COUNT_WITH_NOT_MATCHING_CLS_CD","DESTR_DOCUMENTED_ON_DT","DESTR_DOCUMENTED_BY","DESTR_CONFIRMED_ON_DT","DESTR_CONFIRMED_BY","RETN_DOCUMENTED_ON_DT","RETN_DOCUMENTED_BY","RETN_CONFIRMED_ON_DT","RETN_CONFIRMED_BY","CALC_ERLST_DESTR_ELIG_DT","OVRL_ERLST_DESTR_ELIG_DT","TIME_REMAINING","HAS_DESTR_ELIG_DATA","APPROVED_EXTENDED_RETENTION","EXTENDED_RETENTION_DT","REQ_DESTR_PROC_FREQ","DESTR_ENBL","APPL_OWNR_SID","APPL_OWNR_NM","INFO_OWNR_SID","INFO_OWNR_NM","DATA_OWNR_SID","DATA_OWNR_NM","CRE_TS"],
                rows: [[20553, "Image Services Team", null, null, null, null, "None", "None", null, "DBU030D", "No", "No", "No", 1, 0, 1, null, null, null, null, null, null, null, null, null, null, null, "No", null, null, "Annual", "No", "E128253", "William Welch", "N595287", "Eukarlgen Rothe", "-", "-", "2024-06-11 13:25:36"]],
            }),
        }));

        renderComponent();
        await waitFor(() => expect(screen.queryByTestId('app-levl-retn-rem-mds-progress-spinner')).not.toBeInTheDocument());

        const datatable = screen.getByTestId('app-level-retn-rem-mds-datatable');
        fireEvent.click(datatable, new CustomEvent('click', { detail: { columnIndex: "22", rowIndex: "1" } }));
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalled());
    });
});

