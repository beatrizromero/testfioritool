sap.ui.define([
	"Coty/RawMaterial/Router",
	"Coty/RawMaterial/util/Services",
	"Coty/RawMaterial/util/Constants",
        "Coty/RawMaterial/util/DataManager"
], function(Router, Services, Constants, DataManager) {
	"use strict";
	
	return Router.extend("Coty.RawMaterial.controller.App", {
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other
		 * one-time initialization.
		 * @memberOf RawMaterial.view.App
		 */
		onInit: function() {
			sap.ui.getCore().getEventBus().subscribe("appRawMaterial", "init", this.handleInitRequest, this);
		},
		
		/**
		 * Set model when start app
		 * @param oChannel
		 * @param oEvent
		 * @param oData
		 */
		handleInitRequest: function(oChannel, oEvent, oData) {
			this.createModels();
			this.getDropStatus(oData);
		},
		
		/**
         * Call service to get status drop down datas
         * @param {*} oCrossData 
         */
		getDropStatus: function(oCrossData) {
            Services.getDropStatus().then((oData) => {
            	this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/DropStatus", oData.results);
            	this.initApp(oCrossData);
            }).catch((oError) => {
                sap.ui.core.BusyIndicator.hide();
            });
		},
		
		/**
         * Init app configuration
         * @param {*} oCrossData 
         */
		initApp: function(oCrossData) {
			let sApp = oCrossData.App ? oCrossData.App : Constants.ZERO;
			let sRestore = sessionStorage.getItem(Constants.RESTORE + sApp);
			
			if (!!sRestore) {
				this.restoreData(sApp);
				return;
			}
			
			this.getRouter().initialize();
			this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/App", sApp);

			if (!oCrossData.sView) {
				return;
			}
			
			this.getRouter().navTo(oCrossData.sView, null, true);
			sap.ui.getCore().getEventBus().publish(oCrossData.sView, "crossNavigation", {
				sRaw: oCrossData.sRaw,
				sVersion: oCrossData.sVersion,
			});
		},

		/**
		 * Create model to the app
		 */
		createModels: function() {
			Services.setModel(this.getOwnerComponent().getModel(Constants.RAWMATERIAL_MODEL));
			this.getOwnerComponent().getModel(Constants.DATAMODEL).setSizeLimit(Constants.LIMIT_MAIN);
			this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/RawMaterial", []);
			this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/Filters", {});
			this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/RowsSearched", Constants.ROWS_DEFAULT);
		},
		
		/**
		 * Get state from Session Storage
		 */
		restoreData: function(sApp) {
        	let oDataRestore = JSON.parse(atob(sessionStorage.getItem(Constants.SESSION_STORAGE_RAW + sApp)));
			
        	sessionStorage.removeItem(Constants.SESSION_STORAGE_RAW + sApp);
        	sessionStorage.removeItem(Constants.RESTORE + sApp);
			this.loadDataRestore(oDataRestore, sApp);
			this.callServicesToRestore(oDataRestore);
		},
		
		/**
		 * Get state from Session Storage
		 * @param {*} oCrossData 
		 * @param {*} sApp
		 */
		loadDataRestore: function(oDataRestore, sApp) {
			let oDataModel = this.getOwnerComponent().getModel(Constants.DATAMODEL);
			oDataModel.setProperty("/Filters", oDataRestore.Filters);
			oDataModel.setProperty("/RowsSearched", oDataRestore.RowSearched);
			oDataModel.setProperty("/selectedCompositionVendor", oDataRestore.selectedCompositionVendor);
			oDataModel.setProperty("/App", sApp);
		},
		
		/**
         * Get filters and call service to get materials
         * @param {*} aFilters 
         */
		callServicesToRestore: function(oDataRestore) {
			let aFilters = this.getFilters();

            this.callServiceGetMaterials(aFilters, oDataRestore); 
		},
		
		/**
         * Create filters to search materials
         * @returns {any[]} Return filters
         */
        getFilters: function() {
            let oDataModel = this.getOwnerComponent().getModel(Constants.DATAMODEL);
            let aStatusItems = oDataModel.getProperty("/Filters/StatusSelected");
            let aFilters = [];

			let aLegacyItems = [];
            if (!!oDataModel.getProperty("/Filters/FilterNumber")) {
                aLegacyItems.push(
                    new sap.ui.model.Filter(
                        "tolower(" + Constants.FILTER_ARAWMATERIAL_ID + ")",
                        sap.ui.model.FilterOperator.Contains,
                        "'" + oDataModel.getProperty("/Filters/FilterNumber").toLowerCase() + "'")
                );
                
                aLegacyItems.push(
                    new sap.ui.model.Filter(
                        "tolower(" + Constants.FILTER_MPCODE + ")",
                        sap.ui.model.FilterOperator.Contains,
                        "'" + oDataModel.getProperty("/Filters/FilterNumber").toLowerCase() + "'")
                );
                
                aFilters.push(new sap.ui.model.Filter(aLegacyItems, false));
            }

            if (!!oDataModel.getProperty("/Filters/FilterCode")) {
                aFilters.push(
                    new sap.ui.model.Filter(
                        "tolower(" + Constants.FILTER_CODE + ")",
                        sap.ui.model.FilterOperator.Contains,
                        "'" + oDataModel.getProperty("/Filters/FilterCode").toLowerCase() + "'")
                );
            }
            
            if (!!oDataModel.getProperty("/Filters/FilterPreferred")) {
                aFilters.push(
                    new sap.ui.model.Filter(
                        "tolower(" + Constants.FILTER_APREFERREDNAME + ")",
                        sap.ui.model.FilterOperator.Contains,
                        "'" +  oDataModel.getProperty("/Filters/FilterPreferred").toLowerCase() + "'")
                );
            }

            if (!!oDataModel.getProperty("/Filters/FilterInci")) {
                aFilters.push(
                    new sap.ui.model.Filter(
                        "tolower(" + Constants.FILTER_AINCINAME + ")",
                        sap.ui.model.FilterOperator.Contains,
                        "'" +  oDataModel.getProperty("/Filters/FilterInci").toLowerCase() + "'")
                );
            }
            
            let aItemsFilter = [];
            if (!!aStatusItems && !!aStatusItems.length) {
            	aStatusItems.forEach(sStatus => {
            		aItemsFilter.push(
            			new sap.ui.model.Filter(Constants.FILTER_ASTATUS, sap.ui.model.FilterOperator.EQ, sStatus)
            		);
            	});
            	
                aFilters.push(new sap.ui.model.Filter(aItemsFilter, false));
            }
            
            if (!!oDataModel.getProperty("/Filters/FilterVendor")) {
                aFilters.push(
                    new sap.ui.model.Filter(
                        "tolower(" + Constants.FILTER_AVENDOR + ")",
                        sap.ui.model.FilterOperator.Contains,
                        "'" +  oDataModel.getProperty("/Filters/FilterVendor").toLowerCase() + "'")
                );
            }
            
            if (!!oDataModel.getProperty("/Filters/FilterTrade")) {
                aFilters.push(
                    new sap.ui.model.Filter(
                        "tolower(" + Constants.FILTER_ATRADE + ")",
                        sap.ui.model.FilterOperator.Contains,
                        "'" +  oDataModel.getProperty("/Filters/FilterTrade").toLowerCase() + "'")
                );
            }

            return aFilters;
        },
		
		/**
         * call service to get material list
         * @param {*} aFilters 
         */
        callServiceGetMaterials: function(aFilters, oDataRestore) {
            let oDataModel = this.getView().getModel(Constants.DATAMODEL);
            let nRows = oDataModel.getProperty("/RowsSearched");

            sap.ui.core.BusyIndicator.show(0);
            Services.getRawMaterials(aFilters, nRows).then((oData) => {
                sap.ui.core.BusyIndicator.hide();
                this.getView().getModel(Constants.DATAMODEL).setProperty("/RawMaterial", oData.results);
                this.getMaterialSelected(oData.results, oDataRestore.RawNumber, oDataRestore.RawVersion);
                this.getMaterialDetails(oDataRestore)
            }).catch((oError) => {
                sap.ui.core.BusyIndicator.hide();
            });
        },
        
        /**
         * Get Material selected
         * @param {*} aMaterials 
         * @param {*} sRawNumber
         * @param {*} sRawVersion
         */
        getMaterialSelected: function(aMaterials, sRawNumber, sRawVersion) {
        	let oMaterial = aMaterials.find(oRaw => {
        		return oRaw.RAWMATERIAL_NUMBER === sRawNumber && oRaw.VERSION === sRawVersion
        	});
        	
        	this.getView().getModel(Constants.DATAMODEL).setProperty("/MaterialSelected", oMaterial);
        },
        
        /**
         * Call services to get detail tab's details
         */
        getMaterialDetails: function(oDataRestore) {
            let aPromises = this.getPromises([oDataRestore.RawNumber, oDataRestore.RawVersion]);

            sap.ui.core.BusyIndicator.show();
            Promise.all(aPromises).then((oData) => {
                sap.ui.core.BusyIndicator.hide();
                this.setDetailMaterial(oData);
                
                if (oDataRestore.View === Constants.TARGET_VIEW_WHERE) {
                	this.getWhereUse([oDataRestore.RawNumber, oDataRestore.RawVersion]);
                }
                
                if (!!oData[8].results.length) {
                    return;
                }
                
                this.getView().getModel(Constants.DATAMODEL).setProperty("/Documents", []);
            }).catch((oError) => {
                sap.ui.core.BusyIndicator.hide();
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
        
        /**
         * Call services to get where use datas
         */
        getWhereUse: function(aMaterialData) {
            let aPromises = this.getPromisesWhereUsed(aMaterialData);

            sap.ui.core.BusyIndicator.show();
            Promise.all(aPromises).then((oData) => {
                sap.ui.core.BusyIndicator.hide();
                let aIngredients = oData[0].results.concat(oData[1].results, oData[2].results);
                this.getView().getModel(Constants.DATAMODEL).setProperty("/Ingredients", aIngredients);
            }).catch((oError) => {
                sap.ui.core.BusyIndicator.hide();
            });
        },
        
        /**
         * Create promise to call all detail services
         */
        getPromisesWhereUsed: function(aMaterialData) {
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
            			
			this.getRouter().initialize();
        },
        
        /**
         * Get single vendors
         * @param {*} aVendors Vendors selected
         */
        getSelectVendorComposition: function(aVendors) {
        	aVendors = Object.values(aVendors.reduce((r, o) => (r[o.ASUPPLIER_ID] = o, r), {}));
			this.getView().getModel(Constants.DATAMODEL).setProperty("/VendorsSelect", aVendors);
        },
		
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf RawMaterial.view.App
		 */
		onExit: function() {
			sap.ui.getCore().getEventBus().unsubscribe("appRawMaterial", "init", this.handleInitRequest, this);
		}
		
	});
	
});
