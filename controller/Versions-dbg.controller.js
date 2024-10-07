sap.ui.define([
        "Coty/RawMaterial/Router",
        "Coty/RawMaterial/util/Commons",
        "Coty/RawMaterial/util/Constants",
        "Coty/RawMaterial/util/Services"
	],
	function (Router, Commons, Constants, Services) {
		"use strict";

		return Router.extend("Coty.RawMaterial.controller.Versions", {

            /**
             * Execute one time when enter on this view
             */
			onInit: function () {
                this.getRouter().getRoute(Constants.VERSIONS_VIEW).attachMatched(this.onMatchedRoute, this);
            },

            /**
             * Execute when navigate to this view
             */
            onMatchedRoute: function() {       
                let sMaterialId = this.getView().getModel(Constants.DATAMODEL).getProperty("/MaterialSelected/RAWMATERIAL_NUMBER");
                this.callServiceGetMaterials(sMaterialId);  
            },

            /**
             * call service to get material list
             */
            callServiceGetMaterials: function(sMaterialId) {
                sap.ui.core.BusyIndicator.show(0);
                Services.getVersions(sMaterialId).then((oData) => {
                    sap.ui.core.BusyIndicator.hide();
                    oData.results = oData.results.sort((a, b) => a.RN - b.RN);
                    this.getView().getModel(Constants.DATAMODEL).setProperty("/Versions", oData.results);
                    
                }).catch((oError) => {
                    sap.ui.core.BusyIndicator.hide();
                    this.showErrorMessage(oError);
                });
            },
            
            /**
             * Get version selected to get detail's data
             * @param {*} oEvent 
             */
            onPressVersion: function(oEvent) {
                let oDataModel = this.getView().getModel(Constants.DATAMODEL);
                let sPath = oEvent.getSource().getBindingContext(Constants.DATAMODEL).getPath();

                oDataModel.setProperty("/MaterialSelected", oDataModel.getProperty(sPath));
                this.navBack();
                sap.ui.getCore().getEventBus().publish(Constants.DETAIL_VIEW, "localNavigation", {});
            },
		
			/**
			 * Displays an error message
			 * @param {Object} oError Error object from service
			 */
			showErrorMessage: function(oError) {
				Commons.showMessage(
					this,
					sap.ui.core.ValueState.Error,
					sap.ui.core.ValueState.Error,
					Commons.errorSimpleMessage(this, oError));
			},

            /**
             * Navigate to previous view
             */
            onBtnPressNavBack: function() {
                this.navBack();
            }
		});
	});
