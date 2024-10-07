sap.ui.define(
  ["apptorparameters/utils/Constants", "sap/m/MessageBox"],
  function (Constants, MessageBox) {
    "use strict";
    return {
      /**
       * This function replaces in a text string those parameters that are of type #0# with the
       * parameters that are sent in the array aMapObj.
       * @param {string}  sStr    Text string in which to replace the parameters
       * @param {Array}   aMapObj Array with the values to be entered in each parameter of the string
       * @returns {string}    Returns a text string with the replaced parameters
       */
      replaceParameters: function (sStr, aMapObj) {
        for (let i = 0; i < aMapObj.length; i++) {
          let sObj = "#" + i + "#";
          sStr = sStr.replace(sObj, aMapObj[i]);
        }
        return sStr;
      },

      /**
       * Show the dialog messages to success or show an error when the user access to a Service method.
       * @param  {object} context Context applied to the passed functions
       * @param  {string} sTitle  Title for dialog
       * @param  {string} sState  State for dialog. Ex: 'Error', 'Warning', 'Success'
       * @param  {Array}  msg Array message to display in the dialog
       * @param  {Function}   fnAccept    Function to execute when user click in button
       * @param {string} sOrientation - Orientation of content in dialog
       */
      showMessage: function (
        context,
        sTitle,
        sState,
        msg,
        fnAccept,
        sOrientation
      ) {
        let oBundle = context
          .getOwnerComponent()
          .getModel(Constants.model.I18N_MODEL)
          .getResourceBundle();
        let oAccept = {
          text: Constants.EMPTY,
          closeDialogOnPress: true,
          fn: fnAccept || Constants.EMPTY
        };
        if (
          sState === Constants.VALUE_STATE_WARNING ||
          sState === Constants.VALUE_STATE_ERROR
        ) {
          oAccept.text = oBundle.getText("dialog_buttonBack");
        } else {
          oAccept.text = oBundle.getText("dialog_buttonOk");
        }
        let aMsg = Array.isArray(msg) ? msg : [msg];
        this.showDialog(sTitle, aMsg, [oAccept], sState, sOrientation);
      },

      /**
       * Generic show dialog message (state:'Error', 'Warning', 'Success') with two optional functions
       * @param  {string} sTitle  Title for dialog
       * @param  {Array}  aMsg    Array message to display in the dialog
       * @param  {Array}  aButtons    Array buttons to show in footer dialog
       * @param  {string} sState  State for dialog. Ex: 'Error', 'Warning', 'Success'
       * @param {string} sOrientation - Orientation of content in dialog
       */
      showDialog: function (sTitle, aMsg, aButtons, sState, sOrientation) {
        let oContent = this.generateContent(aMsg, sOrientation);
        let oDialog = new sap.m.Dialog({
          title: sTitle,
          state: sState || Constants.VALUE_STATE_NONE,
          type: "Standard",
          content: oContent,
          afterClose: () => {
            oDialog.destroy();
          }
        });
        this.generateButtons(aButtons, oDialog);
        oDialog.open();
      },

      /**
       *
       * @param {string} sMsg - String message to show in messageToast
       */
      showMessageToast: function (sMsg) {
        sap.m.MessageToast.show(sMsg);
      },

      /**
       *
       * @param {string} sMsg - String message to show in messageBox
       */
      showMessageBox: function (sMsg) {
        MessageBox.success(sMsg);
      },

      /**
       * Function to create the content of dialog
       * @param  {Array} aMsg Array message to display in the dialog
       * @param {string} sOrientation - Orientation of content in dialog
       * @returns {object} sap.m.VBox  VBox component with the messages to be displayed in the dialog
       */
      generateContent: function (aMsg, sOrientation = "Center") {
        let oVBox = new sap.m.VBox({
          justifyContent: sOrientation,
          alignItems: sOrientation
        });
        for (const element of aMsg) {
          oVBox.addItem(
            new sap.m.Text({
              text: element
            })
          );
        }
        oVBox.addStyleClass("sapUiSmallMargin");
        return oVBox;
      },

      /**
       * Function to create buttons for generic dialog message
       * @param  {Array}  aButtonsInfo    Array containing the information of the buttons you want to create
       * @param  {object} oDialog Dialog to which the buttons will be added
       */
      generateButtons: function (aButtonsInfo, oDialog) {
        for (const element of aButtonsInfo) {
          if (element) {
            let oButton = new sap.m.Button({
              text: element.text,
              type: element.type,
              enabled: element.enabled === false ? element.enabled : true,
              press: () => {
                oDialog.close();
              }
            });
            oButton.addStyleClass(element.class);
            oDialog.addButton(oButton);
          }
        }
      },

      /**
       * This function retrieves the error message that returns backend when a service returns error.
       * @param  {object} context - Context applied to the passed functions
       * @param {object}	oError	Object that contains the backend information of the reason for the error.
       * @param {boolean} bMissing - boolean for display a simple message error
       * @returns {string}	Backend error message
       */
      errorSimpleMessage: function (context, oError, bMissing) {
        let sMsg, oErrorBody;
        let oBundle = context
          .getOwnerComponent()
          .getModel(Constants.model.I18N_MODEL)
          .getResourceBundle();
        try {
          if (oError.responseText) {
            oErrorBody = JSON.parse(oError.responseText);
          } else if (oError.response) {
            oErrorBody = JSON.parse(oError.response.body);
          }
        } catch (e) {
          return this.errorConnectivity(context);
        }
        if (bMissing) {
          sMsg = oBundle.getText("exception_dialog_missing_code_error");
        } else if (oErrorBody?.error.message) {
          sMsg = oErrorBody.error.message.value;
        } else if (oError.message) {
          sMsg = oError.message;
        } else {
          sMsg = oBundle.getText("error_genericMessage");
        }
        return sMsg;
      },

      /**
       * This function returns a connection error message when the token expires
       * @param {object} context - Context applied to the passed functions
       * @returns {string}	Connection error message
       */
      errorConnectivity: function (context) {
        return context
          .getOwnerComponent()
          .getModel(Constants.model.I18N_MODEL)
          .getResourceBundle()
          .getText("connection_expired");
      },

      /**
       *
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       */
      validateNumber: function (oEvent) {
        let sValue = oEvent.getSource().getValue();
        sValue = sValue.replace(Constants.COMA_DECIMAL, Constants.DOT_DECIMAL);
        let aValue = sValue.split(Constants.DOT_DECIMAL);
        let sLength = oEvent.getSource().data("maxLength");
        let sLengthDecimal = oEvent.getSource().data("maxLengthDecimal");
        let oReg = /^\d+$/;
        if (!sValue) {
          return;
        }
        if (
          (!!aValue[0] && !oReg.test(aValue[0])) ||
          sValue === Constants.DOT_DECIMAL ||
          (!!aValue[1] && !oReg.test(aValue[1]))
        ) {
          oEvent.getSource().setValue(sValue.substring(0, sValue.length - 1));
          return;
        }
        if (sValue.length > parseInt(sLength)) {
          oEvent.getSource().setValue(sValue.substring(0, sLength));
          return;
        }
        if (!sLengthDecimal) {
          oEvent.getSource().setValue(parseInt(sValue));
        }
        if (sLengthDecimal) {
          let sLastPlace = sValue.substring(sValue.length - 1);
          if (
            sLastPlace === Constants.DOT_DECIMAL ||
            sLastPlace === Constants.COMA_DECIMAL
          ) {
            oEvent.getSource().setValue(sValue);
            return;
          }

          sLengthDecimal = parseInt(sLengthDecimal);
          if (!aValue[1]) {
            return;
          }

          if (aValue[1].length > sLengthDecimal) {
            sValue = parseFloat(sValue).toFixed(sLengthDecimal);
            oEvent.getSource().setValue(sValue);
          }
        }
      },

      /**
       *
       * @param {object} oData object
       * @returns {object}	oData object filter replace all single quotes to double single quotes
       */
      validateFilters: function (oData) {
        for (let sKey in oData) {
          if (
            typeof oData[sKey] === "string" &&
            oData[sKey].includes(Constants.SINGLE_QUOTES)
          ) {
            oData[sKey] = oData[sKey].replaceAll(
              Constants.SINGLE_QUOTES,
              Constants.DOUBLE_SINGLE_QUOTES
            );
          }
        }
        return oData;
      }
    };
  }
);
