sap.ui.define([
        "Coty/RawMaterial/Router",
        "Coty/RawMaterial/util/Constants",
        "Coty/RawMaterial/util/Services",
        "Coty/RawMaterial/util/Commons",
        "Coty/RawMaterial/util/DataManager"
	],
	function (Router, Constants, Services, Commons, DataManager) {
		"use strict";

		return Router.extend("Coty.RawMaterial.controller.WhereUsed", {

            /**
             * Execute one time when enter on this view
             */
			onInit: function () {
                this.getRouter().getRoute(Constants.WHEREUSED_VIEW).attachMatched(this.onMatchedRoute, this);
            },

            /**
             * Execute when navigate to this view
             */
            onMatchedRoute: function() {
            	let aMaterialData = [
                    this.getView().getModel(Constants.DATAMODEL).getProperty("/MaterialSelected/RAWMATERIAL_NUMBER"),
                    this.getView().getModel(Constants.DATAMODEL).getProperty("/MaterialSelected/VERSION")
                ];
            	
                this.getWhereUse(aMaterialData);
            },
            
            /**
             * Call services to get where use datas
             */
            getWhereUse: function(aMaterialData) {
                let aPromises = this.getPromises(aMaterialData);

                sap.ui.core.BusyIndicator.show();
                Promise.all(aPromises).then((oData) => {
                    sap.ui.core.BusyIndicator.hide();
                    let aIngredients = oData[0].results.concat(oData[1].results, oData[2].results);
                    this.getView().getModel(Constants.DATAMODEL).setProperty("/Ingredients", aIngredients);
                    
                }).catch((oError) => {
                    sap.ui.core.BusyIndicator.hide();
                    this.showErrorMessage(oError);
                });
            },
            
            /**
             * Create promise to call all detail services
             */
            getPromises: function(aMaterialData) {
                let aPromises = [];

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceRawComposition(aMaterialData, resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceTpmFormulas(aMaterialData, resolve, reject);
                }));
                
                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceStandardFormulas(aMaterialData, resolve, reject);
                }));

                return aPromises;
            },
            
            /** Call service to get Raw datas
            * @param {function}    resolve   Executed when services callServiceRawComposition returns ok
            * @param {function}    reject Executed when service callServiceRawComposition returns error
            */
            callServiceRawComposition: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
                	oData.results.map((oFormula) => {oFormula.Type = Constants.RAW_TYPE; return oFormula;})
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getRawComposition(aMaterialData, fnSuccess, fnError);
            },
            
            /** Call service to get Formulas datas
            * @param {function}    resolve   Executed when services callServiceFormulas returns ok
            * @param {function}    reject Executed when service callServiceFormulas returns error
            */
            callServiceTpmFormulas: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
                	oData.results.map((oFormula) => {oFormula.Type = Constants.FORMULA_TYPE; return oFormula;})
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getTpmFormulas(aMaterialData, fnSuccess, fnError);
            },
            
            /** Call service to get Formulas datas
            * @param {function}    resolve   Executed when services callServiceStandardFormulas returns ok
            * @param {function}    reject Executed when service callServiceStandardFormulas returns error
            */
            callServiceStandardFormulas: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
                	oData.results.map((oFormula) => {oFormula.Type = Constants.FORMULA_TYPE; return oFormula;})
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getStandardFormulas(aMaterialData, fnSuccess, fnError);
            },
            
            /**
             * Execute when press material number and navigate to detail view on raw material app
             */
            onPressMaterial: function(oEvent) {
                let sPath = oEvent.getSource().getBindingContext(Constants.DATAMODEL).getPath();
            	let oMaterial = this.getView().getModel(Constants.DATAMODEL).getProperty(sPath);
            	
            	if (oMaterial.COMPONENT_TYPE === Constants.RAW_TYPE) {
            		this.callServiceRawMaterial([oMaterial.RAWMATERIAL_NUMBER, oMaterial.VERSION]);
            		return;
            	}
            	
            	this.navToFormulasApp(oMaterial);
            },
            
            /**
             * Get raw material details data
             * @param aMaterialData
             */
            callServiceRawMaterial: function(aMaterialData) {
            	Services.getRawMaterial(aMaterialData).then((oData) => {
                    sap.ui.core.BusyIndicator.hide();
                    this.getView().getModel(Constants.DATAMODEL).setProperty("/MaterialSelected", oData.results[0]);
            		this.navBack();
                	sap.ui.getCore().getEventBus().publish(Constants.DETAIL_VIEW, "localNavigation", {});
                    
                }).catch((oError) => {
                    sap.ui.core.BusyIndicator.hide();
                    this.showErrorMessage(oError);
                });
            },
            
            /**
             * Nav to Formula's app 
             * @param aMaterialData
             */
            navToFormulasApp: function(oFormula) {
            	this.saveDataSessionStorage();
                
                let oDataSend = {
                    Formula: oFormula.FORMULATION_NAME ? oFormula.FORMULATION_NAME : oFormula.ATPM_FORMULA_ID,
                    Version: oFormula.FORMULATION_REVISION ? oFormula.FORMULATION_REVISION : Constants.EMPTY,
                    App: parseInt(this.getView().getModel(Constants.DATAMODEL).getProperty("/App")) + Constants.ONE,
                    TargetView: Constants.TARGET_VIEW_DETAIL
                };

            	let sUrl = Commons.replaceParameters(Constants.APP_FORMULAS, [oDataSend.Formula, oDataSend.Version, Constants.TARGET_VIEW_DETAIL, oDataSend.App]);
				window.location.href = sUrl;
            },
            
            /**
	         * Save actual state in base64 in session storage
	         */
	        saveDataSessionStorage: function() {
	        	let oDataModel = this.getView().getModel(Constants.DATAMODEL);
	        	let sApp = oDataModel.getProperty("/App");
	            let oDataToSave = DataManager.getSaveRestoreData(oDataModel.getData(), Constants.TARGET_VIEW_WHERE);
	            let sData64 = btoa(JSON.stringify(oDataToSave));
	            
	            sessionStorage.setItem(Constants.SESSION_STORAGE_RAW + sApp, sData64);
	            sessionStorage.setItem(Constants.RESTORE + sApp, true);
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
