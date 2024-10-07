sap.ui.define([
        "Coty/RawMaterial/Router",
        "Coty/RawMaterial/util/Constants",
        "Coty/RawMaterial/util/Services",
        "Coty/RawMaterial/util/Commons",
        "Coty/RawMaterial/util/DataManager",
        "sap/ui/export/Spreadsheet",
	],
	function (Router, Constants, Services, Commons, DataManager, Spreadsheet) {
		"use strict";

		return Router.extend("Coty.RawMaterial.controller.Detail", {
            /**
             * Execute one time when enter on this view
             */
			onInit: function () {
                this.getRouter().getRoute(Constants.DETAIL_VIEW).attachMatched(this.onMatchedRoute, this);
                sap.ui.getCore().getEventBus().subscribe(Constants.DETAIL_VIEW, "crossNavigation", this.onCrossNav, this);
                sap.ui.getCore().getEventBus().subscribe(Constants.DETAIL_VIEW, "localNavigation", this.onLocalNav, this);
            },

            /**
             * Execute when navigate to this view
             */
            onMatchedRoute: function() {
                this.checkSelectedVendor();
            },
            
            checkSelectedVendor: function() {
            	let aComposition = this.getView().getModel(Constants.DATAMODEL).getProperty("/Composition");
            	
            	if (!aComposition) {
            		return;
            	}
            	
            	this.filterComposition();
            },

            /**
             * Bus event executed when the there is a local navigation to this app
             * @param {object} oChannel Bus channel
             * @param {object} oEvent Bus event name
             * @param {object} oData Bus data
             */
            onLocalNav: function(oChannel, oEvent, oData) {
                let aMaterialData = [
                    this.getView().getModel(Constants.DATAMODEL).getProperty("/MaterialSelected/RAWMATERIAL_NUMBER"),
                    this.getView().getModel(Constants.DATAMODEL).getProperty("/MaterialSelected/VERSION")
                ];

                this.getMaterialDetails(aMaterialData);
            },

            /**
             * Bus event executed when the there is a cross navigation to this app
             * @param {object} oChannel Bus channel
             * @param {object} oEvent Bus event name
             * @param {object} oData Bus data
             */
            onCrossNav: function(oChannel, oEvent, oData) {
                let aMaterialData = [
                    oData.sRaw,
                    oData.sVersion
                ];

                this.getRawDetails(aMaterialData);
            },

            /**
             * Get raw material details data
             * @param aMaterialData
             */
            getRawDetails: function(aMaterialData) {
                sap.ui.core.BusyIndicator.show(0);
                Services.getRawMaterial(aMaterialData).then((oData) => {
                    sap.ui.core.BusyIndicator.hide();

                    if (!oData.results.length) {
                        return;
                    }
                    this.getView().getModel(Constants.DATAMODEL).setProperty("/MaterialSelected", oData.results[0]);

                    this.getMaterialDetails(aMaterialData);
                }).catch((oError) => {
                    sap.ui.core.BusyIndicator.hide();
                    this.showErrorMessage(oError);
                });
            },

            /**
             * Call services to get detail tab's details
             */
            getMaterialDetails: function(aMaterialData) {
                let aPromises = this.getPromises(aMaterialData);

                sap.ui.core.BusyIndicator.show();
                Promise.all(aPromises).then((oData) => {
                    sap.ui.core.BusyIndicator.hide();
                    this.setDetailMaterial(oData);
                    
                    this.getView().getModel(Constants.DATAMODEL).setProperty("/selectedCompositionVendor", Constants.DEFAULT_FILTER_VENDOR);
                    this.filterComposition();
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
                    this.callServiceFunctionalities(aMaterialData, resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceManufacturing(aMaterialData, resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceSites(aMaterialData, resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceSupliers(aMaterialData, resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceSynonyms(aMaterialData, resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceSource(aMaterialData, resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceApplication(aMaterialData, resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceHazards(aMaterialData, resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceDocument(aMaterialData, resolve, reject);
                }));
                
                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceTestMehods(aMaterialData, resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceComposition(aMaterialData, resolve, reject);
                }));
                
                aPromises.push(new Promise((resolve, reject) => {
                    this.callServiceCompliance(aMaterialData, resolve, reject);
                }));

                return aPromises;
            },

            /** Call service to get Functionalities datas
            * @param {function}    resolve   Executed when services callServiceFunctionalities returns ok
            * @param {function}    reject Executed when service callServiceFunctionalities returns error
            */
            callServiceFunctionalities: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getFunctionalities(aMaterialData, fnSuccess, fnError);
            },

            /** Call service to get Manufacturing datas
            * @param {function}    resolve   Executed when services callServiceManufacturing returns ok
            * @param {function}    reject Executed when service callServiceManufacturing returns error
            */
            callServiceManufacturing: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getManufacturing(aMaterialData, fnSuccess, fnError);
            },

            /** Call service to get Sites datas
            * @param {function}    resolve   Executed when services callServiceSites returns ok
            * @param {function}    reject Executed when service callServiceSites returns error
            */
            callServiceSites: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getSites(aMaterialData, fnSuccess, fnError);
            },

            /** Call service to get Supliers datas
            * @param {function}    resolve   Executed when services callServiceSupliers returns ok
            * @param {function}    reject Executed when service callServiceSupliers returns error
            */
            callServiceSupliers: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getSupliers(aMaterialData, fnSuccess, fnError);
            },

            /** Call service to get Synonyms datas
            * @param {function}    resolve   Executed when services callServiceSynonyms returns ok
            * @param {function}    reject Executed when service callServiceSynonyms returns error
            */
            callServiceSynonyms: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getSynonyms(aMaterialData, fnSuccess, fnError);
            },

            /** Call service to get Source datas
            * @param {function}    resolve   Executed when services callServiceSynonyms returns ok
            * @param {function}    reject Executed when service callServiceSynonyms returns error
            */
            callServiceSource: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getSource(aMaterialData, fnSuccess, fnError);
            },

            /** Call service to get Application datas
            * @param {function}    resolve   Executed when services callServiceApplication returns ok
            * @param {function}    reject Executed when service callServiceApplication returns error
            */
            callServiceApplication: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getApplication(aMaterialData, fnSuccess, fnError);
            },

            /** Call service to get Hazards datas
            * @param {function}    resolve   Executed when services callServiceHazards returns ok
            * @param {function}    reject Executed when service callServiceHazards returns error
            */
            callServiceHazards: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getHazards(aMaterialData, fnSuccess, fnError);
            },
            
            /** Call service to get Test Methods datas
            * @param {function}    resolve   Executed when services callServiceTestMehods returns ok
            * @param {function}    reject Executed when service callServiceTestMehods returns error
            */
            callServiceTestMehods: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
                    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getTestMethods(aMaterialData, fnSuccess, fnError);
            },

            /** Call service to get Composition datas
             * @param {function}    resolve   Executed when services callServiceComposition returns ok
             * @param {function}    reject Executed when service callServiceComposition returns error
             */
            callServiceComposition: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
                    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getComposition(aMaterialData, fnSuccess, fnError);
            },

            /** Call service to get Document datas
            * @param {function}    resolve   Executed when services callDocumentRelationships returns ok
            * @param {function}    reject Executed when service callDocumentRelationships returns error
            */
            callServiceDocument: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getDocument(aMaterialData, fnSuccess, fnError);
            },
            
            /** Call service to get Compliance datas
            * @param {function}    resolve   Executed when services callServiceCompliance returns ok
            * @param {function}    reject Executed when service callServiceCompliance returns error
            */
            callServiceCompliance: function(aMaterialData, resolve, reject) {
                sap.ui.core.BusyIndicator.show(0);
                let fnSuccess = (oData) => {
				    resolve(oData);
                };

                let fnError = (oError) => {
                    reject(oError);
                };

                Services.getCompliance(aMaterialData, fnSuccess, fnError);
            },

            /**
             * Set datas from services
             * @param {*} oData Data's services returned
             */
            setDetailMaterial: function(oData) {
                let oDataModel = this.getView().getModel(Constants.DATAMODEL);

                oDataModel.setProperty("/Functionalities", oData[0].results);
                oDataModel.setProperty("/Manufacturing", oData[1].results);
                oDataModel.setProperty("/Sites", oData[2].results);
                oDataModel.setProperty("/Supliers", oData[3].results);
                oDataModel.setProperty("/Synonyms", oData[4].results);
                oDataModel.setProperty("/Source", oData[5].results);
                oDataModel.setProperty("/Application", oData[6].results);
                oDataModel.setProperty("/Hazards", oData[7].results);
                oDataModel.setProperty("/Documents", oData[8].results);
                oDataModel.setProperty("/TestMethods", oData[9].results);
                oDataModel.setProperty("/Composition", DataManager.setComponentName(oData[10].results));
                oDataModel.setProperty("/Compliance", oData[11].results);
                
                this.getSelectVendorComposition(oData[10].results);
            },
            
            /**
             * Get single vendors
             * @param {*} aVendors Vendors selected
             */
            getSelectVendorComposition: function(aVendors) {
            	aVendors = aVendors.filter(oVendor => {return !!oVendor.ASUPPLIER_ID});
            	aVendors = Object.values(aVendors.reduce((r, o) => (r[o.ASUPPLIER_ID] = o, r), {}));
            	aVendors.unshift({
            		ASUPPLIER_ID: Constants.DEFAULT_FILTER_VENDOR
            	});                  
				this.getView().getModel(Constants.DATAMODEL).setProperty("/VendorsSelect", aVendors);
            },

            /**
             * Navigate to previous view
             */
            onBtnPressNavBack: function() {
                this.navBack();
            },

            /**
             * Navigate to where use view
             */
            onBtnPressWhereUsed: function() {
			    this.getRouter().navTo(Constants.WHEREUSED_VIEW);
            },

            /**
             * Navigate to versions view
             */
            onBtnPressVersions: function() {
			    this.getRouter().navTo(Constants.VERSIONS_VIEW);
            },

            /**
             * Execute when press a composition id
             * @param oEvent
             */
            onPressComposition: function(oEvent) {
                let oDataModel = this.getView().getModel(Constants.DATAMODEL);
                let sPath = oEvent.getSource().getBindingContext(Constants.DATAMODEL).getPath();

                if (oDataModel.getProperty(sPath + "/COMPONENT_TYPE") === Constants.SUBSTANCE_TYPE) {
                    this.sendDataSubstance(oDataModel.getProperty(sPath + "/COMPONENT_ID"));
                    return;
                }

                this.sendDataRaw(oDataModel.getProperty(sPath));
            },
            
            /**
             * Execute when press a composition id
             * @param oEvent
             */
            onPressDocuments: function(oEvent) {
            	let oDataModel = this.getView().getModel(Constants.DATAMODEL);
                let sPath = oEvent.getSource().getBindingContext(Constants.DATAMODEL).getPath();
            	let oDocument = oDataModel.getProperty(sPath);
        
        		let sObjectKey = oDocument.DOC_TYPE_RD + oDocument.DOC_ID_RD + oDocument.DOC_V_SOURCE + oDocument.DOC_PART_RD;
            	
            	this.callServiceGetOriginals(sObjectKey);	
            },
            
            /**
             * Call service to download document selected
             * @param oEvent
             */
            callServiceGetOriginals: function(sObjectKey) {
            	Services.setModel(this.getOwnerComponent().getModel(Constants.DOCUMENTS_MODEL));
            	Services.getLinkDocument(sObjectKey).then((oData) => {
                    sap.ui.core.BusyIndicator.hide();
                    
                    if (!!oData.results.length) {
                    	Services.getDownload(oData.results[0]);	
                    }
            		
                	Services.setModel(this.getOwnerComponent().getModel(Constants.RAWMATERIAL_MODEL));
                }).catch((oError) => {
                    sap.ui.core.BusyIndicator.hide();
                    this.showErrorMessage(oError);
                    Services.setModel(this.getOwnerComponent().getModel(Constants.RAWMATERIAL_MODEL));
                });
            },
            
            /**
             * Execute when change value of select on composition table
             * @param oEvent 
             */
            onSelectVendor: function(oEvent) {
            	this.filterComposition();
            },
            
            /**
             * Create filter for composition table
             */
            filterComposition: function() {
            	let aFilters = [];
            	let oDataModel =  this.getView().getModel(Constants.DATAMODEL);
            	let sVendor = oDataModel.getProperty("/selectedCompositionVendor") === Constants.DEFAULT_FILTER_VENDOR ? Constants.EMPTY : oDataModel.getProperty("/selectedCompositionVendor");
            	
				aFilters.push(new sap.ui.model.Filter(Constants.FILTER_VENDOR_COMPOSITION, sap.ui.model.FilterOperator.EQ, sVendor));
				this.byId(Constants.ID_COMPOSITION_LIST).getBinding("items").filter(aFilters);	
            },

			/**
             * Send data to substance app and navigate to detail
             * @param sSubstance
             */
            sendDataSubstance: function(sSubstance) {
            	this.saveDataSessionStorage();
            	
            	let sApp = parseInt(this.getView().getModel(Constants.DATAMODEL).getProperty("/App")) + Constants.ONE;
            	let sUrl = Commons.replaceParameters(Constants.APP_SUBSTANCE, [sSubstance, Constants.TARGET_VIEW_DETAIL, sApp]);
				window.location.href = sUrl;
            },

			/**
             * Search raw material detail
             * @param oMaterial
             */
            sendDataRaw: function(oMaterial) {
				let aMaterialData = [
                	oMaterial.COMPONENT_ID,
                    oMaterial.COMPONENT_VERSION
                ];

                this.getMaterialDetails(aMaterialData);
            },
            
            /**
             * Download xlsx with composition datas
             * @param {*} oData Data's services returned
             */
            onPressDownloadComposition: function() {
                let oDataModel = this.getView().getModel(Constants.DATAMODEL);
                
				let oSettings = {
					workbook: {
						columns: this.getTemplateColumns(),
					},
					dataSource: oDataModel.getProperty("/Composition"),
					fileName: Constants.EXCEL_NAME + oDataModel.getProperty("/MaterialSelected/ARAWMATERIALSPECNUMBER") + Constants.EXCEL_EXTENSION
				};
	
				let oSheet = new Spreadsheet(oSettings);
				oSheet.build().finally(() => {
					oSheet.destroy();
				});
            },
            
            /**
             * Save the current state of the application
             */
            getTemplateColumns: function() {
            	let oTable = this.byId(Constants.ID_COMPOSITION_LIST);
            	let aColumns = oTable.getColumns();
            	let oItem = !!oTable.getItems().length ? oTable.getItems()[0] : Constants.EMPTY;
            	let aTemplate = [];
            	
            	for (let i = 0; i < aColumns.length; i++) {
            		aTemplate.push(
            			{
            				label: aColumns[i].getHeader().getText(),
            				property: oItem ? oItem.getCells()[i].getBinding("text").getPath() : Constants.EMPTY,
							type: Constants.EXCEL_COLUMN_TYPE_STRING
            			}
            		)
            	}
            	
            	return aTemplate;
            },

            /**
	         * Save actual state in base64 in session storage
	         */
	        saveDataSessionStorage: function() {
	        	let oDataModel = this.getView().getModel(Constants.DATAMODEL);
	        	let sApp = oDataModel.getProperty("/App");
	            let oDataToSave = DataManager.getSaveRestoreData(oDataModel.getData(), Constants.TARGET_VIEW_DETAIL);
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
             * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * @memberOf RawMaterial.view.App
             */
            onExit: function() {
                sap.ui.getCore().getEventBus().unsubscribe(Constants.DETAIL_VIEW, "crossNavigation", this.onCrossNav, this);
                sap.ui.getCore().getEventBus().unsubscribe(Constants.DETAIL_VIEW, "localNavigation", this.onLocalNav, this);
            }

		});
	});
