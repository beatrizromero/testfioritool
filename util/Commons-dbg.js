sap.ui.define([
        "Coty/RawMaterial/util/Constants",
    ],
    function(Constants) {
    "use strict";
    return {

        /**
         * This function replaces in a text string those parameters that are of type #0# with the
         * parameters that are sent in the array aMapObj.
         * @param {string}  sStr    Text string in which to replace the parameters
         * @param {array}   aMapObj Array with the values to be entered in each parameter of the string
         * @returns {string}    Returns a text string with the replaced parameters
         */
        replaceParameters: function(sStr, aMapObj) {
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
         * @param  {array}  msg Array message to display in the dialog
         * @param  {function}   fnAccept    Function to execute when user click in button
         */
        showMessage: function(context, sTitle, sState, msg, fnAccept, sOrientation ) {
            let oBundle = context.getOwnerComponent().getModel(Constants.I18N_MODEL).getResourceBundle();

            let oAccept = {
                text: Constants.EMPTY,
                closeDialogOnPress: true,
                fn: fnAccept ? fnAccept : Constants.EMPTY
            };
            
            if (sState === Constants.VALUE_STATE_WARNING || sState === Constants.VALUE_STATE_ERROR) {
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
         * @param  {array}  aMsg    Array message to display in the dialog
         * @param  {array}  aButtons    Array buttons to show in footer dialog
         * @param  {string} sState  State for dialog. Ex: 'Error', 'Warning', 'Success'
         */
        showDialog: function(sTitle, aMsg, aButtons, sState, sOrientation) {
            let oContent = this.generateContent(aMsg, sOrientation);
            let oDialog = new sap.m.Dialog({
                title: sTitle,
                state: sState ? sState : Constants.VALUE_STATE_NONE,
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
         * Function to create the content of dialog
         * @param  {array} aMsg Array message to display in the dialog
         * @return {object} sap.m.VBox  VBox component with the messages to be displayed in the dialog
         */
        generateContent: function(aMsg, sOrientation = "Center") {
            let oVBox = new sap.m.VBox({justifyContent: sOrientation, alignItems: sOrientation});
            for (let i = 0; i < aMsg.length; i++) {
                oVBox.addItem(new sap.m.Text({
                    text: aMsg[i]
                }));
            }
            oVBox.addStyleClass("sapUiSmallMargin");
            return oVBox;
        },

        /**
         * Function to create buttons for generic dialog message
         * @param  {array}  aButtonsInfo    Array containing the information of the buttons you want to create
         * @param  {object} oDialog Dialog to which the buttons will be added
         */
        generateButtons: function(aButtonsInfo, oDialog) {
            for (let i = 0; i < aButtonsInfo.length; i++) {
                if (aButtonsInfo[i]) {
                    let fn = aButtonsInfo[i].fn;
                    let oButton = new sap.m.Button({
                        text: aButtonsInfo[i].text,
                        type: aButtonsInfo[i].type,
                        enabled: aButtonsInfo[i].enabled === false ? aButtonsInfo[i].enabled : true,
                        press: () => {
                            if (fn) {
                                fn();
                            }
                            oDialog.close();
                        }
                    });
                    oButton.addStyleClass(aButtonsInfo[i].class);
                    oDialog.addButton(oButton);
                }
            }
        },
        
        /**
		 * This function retrieves the error message that returns backend when a service returns error.
		 * @param {object}	oError	Object that contains the backend information of the reason for the error.
		 * @returns {string}	Backend error message
		 */
		errorSimpleMessage: function(context, oError) {
			let sMsg, oErrorBody, sCode;
			try {
				if (oError.responseText) {
					oErrorBody = JSON.parse(oError.responseText);
				} else if (oError.response) {
					oErrorBody = JSON.parse(oError.response.body);
				}
			} catch (e) {
				return this.errorConnectivity(context);
			}
			
			if (oErrorBody && oErrorBody.error.message) {
				sMsg = oErrorBody.error.message.value;
			} else if (oError.message) {
				sMsg = oError.message;
			} else {
				sMsg = context.getOwnerComponent().getModel(Constants.I18N_MODEL).getResourceBundle().getText("error_genericMessage");
			}
			return sMsg;
		},
		/**
		 * This function returns a connection error message when the token expires
		 * @returns {string}	Connection error message
		 */
		errorConnectivity: function(context) {
			return context.getOwnerComponent().getModel(Constants.I18N_MODEL).getResourceBundle().getText("connection_expired");
		},
    };
});
