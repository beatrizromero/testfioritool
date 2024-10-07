/**
 * Constants file
 */
sap.ui.define("Coty.RawMaterial.util.Constants", [], function () {
    'use strict';

    return {
        I18N_MODEL: "i18n",
        DATAMODEL: "dataModel",
        RAWMATERIAL_MODEL: "RawMaterials",
        DOCUMENTS_MODEL: "Documents",

        APP_SUBSTANCE: "https://substancematerial-cq736479b1.dispatcher.us2.hana.ondemand.com?Substance=#0#&TargetView=#1#&App=#2#",
        APP_FORMULAS: "https://formulas-cq736479b1.dispatcher.us2.hana.ondemand.com?Formula=#0#&Version=#1#&TargetView=#2#&App=#3#",
        TARGET_VIEW_DETAIL:"Detail",
        TARGET_VIEW_WHERE: "WhereUsed",
        UNDEFINED: "undefined",
        RESTORE: "RAWRestoreData",
        SESSION_STORAGE_RAW: "RAWSessionStorage",

        MAIN_VIEW: "Main",
        DETAIL_VIEW: "Detail",
        WHEREUSED_VIEW: "WhereUsed",
        VERSIONS_VIEW: "Versions",

        ENTITY_RAWLASTVERSION: "/rawLastVersionVendor",
        ENTITY_DROPSTATUSRAW: "/dropListStatusRaw",
        ENTITY_ORDERVERSION: "/orderByVersionRaw2",
        ENTITY_FUNCTIONALITIES: "/FUNCTIONALITIES_RAWMATERIALS",
        ENTITY_MANUFRACTURING: "/RAW_MANUFACTURING",
        ENTITY_SITES: "/RAW_SITES",
        ENTITY_SUPLIERS: "/RAW_SUPLIERS",
        ENTITY_SYNONYMS: "/RAW_SYNONYMS",
        ENTITY_SOURCE: "/SOURCE_RAWMATERIALS",
        ENTITY_APPLICATION: "/APPLICATION_RAWMATERIALS",
        ENTITY_HAZARDS: "/HAZARDS_RAWMATERIALS",
        ENTITY_DOCUMENTS: "/getRawDocuments",
        ENTITY_GETALLORIGINALS: "/GetAllOriginals",
        ENTITY_ORIGINAL_CONTENT: "/OriginalContentSet(Documenttype='#0#',Documentnumber='#1#',Documentpart='#2#',Documentversion='#3#',ApplicationId='#4#',FileId='#5#')/$value",
        ENTITY_COMPOSITION: "/RAW_COMPOSITION_SUBS",
        ENTITY_TESTMETHOD: "/RAW_TESTMETHODS",
        ENTITY_INGREDIENTS: "/TpmFormulaComponents",
        ENTITY_STANDARD: "/StandardFormulaComponents",
        ENTITY_COMPLIANCE: "/RAW_COMPLIANCE_RULES",

        FILTER_ARAWMATERIAL_ID: "RAWMATERIAL_NUMBER",
        FILTER_MPCODE: "AMMS_CODE",
        FILTER_CODE: "SAPRD_CODE",
        FILTER_APREFERREDNAME: "APREFERREDNAME",
        FILTER_AINCINAME: "AINCINAME",
        FILTER_ASTATUS: "ASTATUS",
        FILTER_AVENDOR: "ASUPPLIERID",
        FILTER_ATRADE: "ATRADENAME",
        
        FILTER_DETAIL: "RAWMATERIAL_NUMBER eq '#0#' and VERSION eq '#1#'",
        FILTER_DETAIL_RELATIONSHIPS: "MATERIAL_NUMBER eq '#0#' and VERSION eq '#1#'",
        FILTER_VERSIONS: "RAWMATERIAL_NUMBER eq '#0#'",
        FILTER_WHEREUSE_RAWCOMPOSITION: "COMPONENT_ID eq '#0#' and COMPONENT_VERSION eq '#1#' and COMPONENT_TYPE eq 'Raw Material'",
        FILTER_INGREDIENTS: "RAWMATERIAL_NUMBER eq '#0#' and RAWMATERIAL_VERSION eq '#1#' and ATPM_FORMULA_ID eq ''",
        FILTER_TPM: "RAWMATERIAL_NUMBER eq '#0#' and RAWMATERIAL_VERSION eq '#1#' and ATPM_FORMULA_ID ne ''",
        FILTER_COMPLIANCE: "RM_NAME eq '#0#'",
        
        ID_COMPOSITION_LIST: "rawCompositionList",
    	FILTER_VENDOR_COMPOSITION: "ASUPPLIER_ID",
        DEFAULT_FILTER_VENDOR: "General Composition (Enterprise Part)",

		ZERO: 0,
		ONE: 1,
        LIMIT_MAIN: 2000,
        ROWS_DEFAULT: 500,
        POINT: ".",
        RESPOSINVE_TYPE: "blob",
        CSV_EXTENSION: "csv",
        UTF8: "utf-8",
        GET_TYPE: "GET",
        SUBSTANCE_TYPE: "Substance",
        RAW_TYPE: "Raw Material",
        FORMULA_TYPE: "Formula",
        
        EMPTY: "",
        EXCEL_NAME: "Raw Composition_",
        EXCEL_EXTENSION: ".xlsx",
        EXCEL_COLUMN_TYPE_STRING: "String",
        
        VALUE_STATE_NONE: "None",
        VALUE_STATE_ERROR: "Error",
        VALUE_STATE_WARNING: "Warning"
    };
}, true);
