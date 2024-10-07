/**
 * Constants file
 */
sap.ui.define(
  "apptorparameters.utils.Constants",
  [],
  function () {
    "use strict";
    return {
      EMPTY: "",
      TOR_USER: "TOR_User",
      TOR_MASTERDATA: "TOR_MasterData",
      model: {
        ODATA_MODEL: "mainModel",
        LOCAL_MODEL: "localModel",
        I18N_MODEL: "i18n",
        ODATA_MODEL_VALUEHELP: "valueHelpModel",
        MESSAGE_MODEL: "messageModel",
        USER_ROLES_MODEL: "userRolesModel",
        ROLES_MODEL: "rolesModel"
      },
      property: {
        MAIN_BINDING: "/searchParams",
        TABLE_BINBINDG: "/TOR_PARAMETER_TOTALView",
        PARAM_PROPERTY: "param",
        PARAM_VALUE_PROPERTY: "param_value",
        PARAM_VALUE_DESC_PROPERTY: "param_value_desc",
        LANG_PROPERTY: "lang",
        CREATE_BINDING: "/createParams",
        EDIT_BINDING: "/EditTOR_PARAMETER_TOTALView",
        CREATE_ERROR_MESSAGE: "/CreateErrorMessage",
        SELECTEDDESCRIPTION_PROPERTY: "/selectedDescription",
        SELECTEDDESCRIPTION_DESCRIPTIONS_PROPERTY:
          "/selectedDescription/descriptions",
        SELECTEDPARENTROWDESCRIPTION: "/SelectedParentRowDescription",
        SELECTEDPARENTROW: "/SelectedParentRow",
        PARAMETERTABLE_PROPERTY: "/ParameterTable",
        SEARCHPARAMS_PARAMETERTYPE_PROPERTY: "/searchParams/parameterType",
        O_SELECT_LANG: "/oSelectLang",
        LANGUAGE_CODE: "/languageCode",
        PARAMETERTYPE_PROPERTY: "/parameterTypes",
        IS_EDIT_USER: "/isEditUser"
      },
      entity: {
        ENTITY_TOR_PARAMETER_TOTALVIEW: "/TOR_PARAMETER_TOTALView",
        TOR_PARAMETERView: "/TOR_PARAMETERView",
        TOR_PARAMETER_DESCView: "/TOR_PARAMETER_DESCView",
        TOR_USER_ROLES: "/getUserRoles()"
      },
      route: {
        TABLE_ROUTE: "Table",
        CREATE_ROUTE: "CreateView",
        EDIT_ROUTE: "EditView"
      },
      id: {
        CREATEVIEW_MESSAGEPOPOVER_ID: "CreateViewMessagePopoverBtn",
        EDITVIEW_MESSAGEPOPOVER_ID: "EditViewMessagePopoverBtn",
        EDITVIEWTABLE_ID: "EditViewTable",
        TABLEVIEW_MESSAGEPOPOVER_ID: "TableViewMessagePopoverBtn",
        TABLEVIEW_ID: "TableViewTable",
        PARAMETER_TYPE_ID: "parameterTypeId"
      },
      parametersOEvent: {
        BINDING_PARAMS: "bindingParams",
        SELECTED_KEY: "selectedKey",
        SELECTED_ITEM: "selectedItem",
        EXPORT_SETTINGS: "exportSettings",
        LIST_ITEM: "listItem",
        ARGUMENTS: "arguments",
        DATA: "data",
        ITEM: "item",
        CHANGE: "change",
        VALUEHELPREQUEST: "valueHelpRequest",
        DIALOG: "_dialog",
        ITEMS: "items",
        TITLE: "title",
        PARTS: "parts",
        DESCRIPTION: "description",
        PATH: "path",
        VALUE: "value"
      },
      filterKeyPath: {
        LANG: "lang"
      },
      state: {
        INFORMATION: "Information",
        ERROR: "Error",
        WARNING: "Warning",
        SUCCESS: "Success",
        NONE: "None",
        NEGATIVE: "Negative",
        CRITICAL: "Critical",
        NEUTRAL: "Neutral"
      },
      method: {
        GET: "GET",
        POST: "POST"
      },
      icon: {
        ERROR: "sap-icon://error",
        ALERT: "sap-icon://alert",
        SYS_ENTER_2: "sap-icon://sys-enter-2",
        INFORMATION: "sap-icon://information"
      },
      messageModel: {
        TYPE: "{messageModel>type}",
        TITLE: "{messageModel>title}",
        ACTIVETITLE: "{messageModel>active}",
        DESCRIPTION: "{messageModel>description}",
        SUBTITLE: "{messageModel>subtitle}",
        PATH: "messageModel>/"
      }
    };
  },
  true
);
