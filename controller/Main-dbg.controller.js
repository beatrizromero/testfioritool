sap.ui.define([
        "Coty/RawMaterial/Router",
        "Coty/RawMaterial/util/Commons",
        "Coty/RawMaterial/util/Constants",
        "Coty/RawMaterial/util/Services"
	],
	function (Router, Commons, Constants, Services) {
		"use strict";

		return Router.extend("Coty.RawMaterial.controller.Main", {

            /**
             * Execute one time when enter on this view
             */
			onInit: function () {
                this.getRouter().getRoute(Constants.MAIN_VIEW).attachMatched(this.onMatchedRoute, this);
            },
            
            /**
             * Execute when navigate to this view
             */
            onMatchedRoute: function() {
            	
            },
            
            /**
             * Execute when finish select status
             * @param {*} oEvent 
             */
            onSelectionFinishStatus: function(oEvent) {
            	let aSelectedItems = oEvent.getParameter("selectedItems");
            	let aItems = [];
            	
            	aSelectedItems.forEach(oItem => {
            		aItems.push(oItem.getText())
            	});
            	
            	this.getView().getModel(Constants.DATAMODEL).setProperty("/Filters/StatusSelected", aItems);
            },
            
            /**
             * Execute when press go button 
             */
            onBtnPressGo: function() {    
               let aFilters = this.getFilters();

               this.callServiceGetMaterials(aFilters);         
            },
            
            /**
             * call service to get material list
             * @param {*} aFilters 
             */
            callServiceGetMaterials: function(aFilters) {
                let oDataModel = this.getView().getModel(Constants.DATAMODEL);
                let nRows = oDataModel.getProperty("/RowsSearched");

                sap.ui.core.BusyIndicator.show(0);
                Services.getRawMaterials(aFilters, nRows).then((oData) => {
                    sap.ui.core.BusyIndicator.hide();
                    this.getView().getModel(Constants.DATAMODEL).setProperty("/RawMaterial", oData.results);
                }).catch((oError) => {
                    sap.ui.core.BusyIndicator.hide();
                    this.showErrorMessage(oError);
                });
            },
            
            /**
             * Create filters to search materials
             * @returns {any[]} Return filters
             */
            getFilters: function() {
                let oDataModel = this.getView().getModel(Constants.DATAMODEL);
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
             * Execute when press material number and navigate to detail view
             */
            onPressMaterial: function(oEvent) {  
                let oDataModel = this.getView().getModel(Constants.DATAMODEL);
                let sPath = oEvent.getSource().getBindingContext(Constants.DATAMODEL).getPath();

                oDataModel.setProperty("/MaterialSelected", oDataModel.getProperty(sPath));
                this.getRouter().navTo(Constants.DETAIL_VIEW);
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